 /*
 /   Responsibility: initialize game state and manage move timers
 /   All game logic is delegated to helper files
*/

import redis from '../config/redis';
import cache from './cache';
import io from '../config/socketio';
import GameConfig from '../config/game';
import Game from '../models/game';
import State from './state';
import Board from '../helpers/board';
import MoveHistory from '../models/history';
import InitialPieces from '../helpers/initial_pieces';

var getInitialState = function(game) {
  var pieces = InitialPieces();
  return ({
    gameId: game._id,
    white: game.white,
    black: game.black,
    pieces: pieces,
    grid: Board.buildGrid(pieces),
    reserved: Board.buildGrid({}),
    moveId: 0
  });
};

// PUBLIC API

var init = function(game) {
  if (game.isActive() && game.isFull() && !cache.get(game._id)) {
    let state = cache.put(
      game._id.toString(),
      getInitialState(game),
      GameConfig.maxTime, // 30 minutes max time
      _gameExpired
    );

    _emitStateData(state.gameId, 'state-init', state);
  } else {
    throw new Error('Game cannot be initialized');
  }
};

var getState = function(gameId) {
  return cache.get(gameId);
};

var movePiece = function(gameId, userId, pieceId, targetPos) {
  var state = getState(gameId);
  if (!state) throw new Error('Game not found');
  if (!_isCorrectUser(userId, pieceId, state)) throw new Error('Incorrect user');
  if (Board.canMovePiece(pieceId, targetPos, state)) {
    var type = Board.getPiece(pieceId, state).type;
    if (type === 4)
      _performKnightMove(pieceId, targetPos, state);
    else if ( type === 0 && Board.isCastleMove(pieceId, targetPos, state))
      _performCastleMove(pieceId, targetPos, state);
    else
      _performMove(pieceId, targetPos, state);
  };
};

// PRIVATE

// MOVE LOGIC
var _performMove = function(pieceId, targetPos, state) {
  var gameId = state.gameId;
  var pieces = state.pieces;
  if (!pieces[pieceId]) return; // piece is not available

  var currPos = pieces[pieceId].pos;
  if (currPos[0] === targetPos[0] && currPos[1] === targetPos[1] || pieceTaken) {
    _moveEnd(pieceId, state);
    return;
  };

  var newPos = Board.getNextPos(pieceId, targetPos, state);
  if (!newPos) { // can't move to target pos
    _moveEnd(pieceId, state);
    return;
  }
  var pieceTaken = !!Board.getPiece(Board.getTarget(newPos, state), state);
  _updatePieceAndEmit(pieceId, { pos: newPos, hasMoved: 1, status: 1 }, state);

  if (Board.isGameOver(state)) {
    _gameOver(state);
    return;
  }

  var newTarget = pieceTaken ? newPos : targetPos;

  setTimeout(() => {
    _performMove(pieceId, newTarget, state);
  }, GameConfig.speed);
};

var _performKnightMove = function(pieceId, targetPos, state) {
  _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: -1 }, state);

  setTimeout(() => {
    _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: 1 }, state);

    if (Board.isGameOver(state)) {
      _gameOver(state);
    } else {
      setTimeout(()=>{_moveEnd(pieceId, state);}, GameConfig.speed);
    }
  }, GameConfig.speed);
};

var _performCastleMove = function(kingId, targetPos, state) {
  var rookRow = kingId < 16 ? 7 : 0;
  var [rookCol, rookTargetCol] = targetPos[1] === 6 ? [7, 5] : [0, 3];
  var rookTargetPos = [rookRow, rookTargetCol];
  var rookId = Board.getTarget([rookRow, rookCol], state);

  _performImmediate(kingId, targetPos, state);
  _performImmediate(rookId, rookTargetPos, state);
};

var _performImmediate = function(pieceId, targetPos, state) {
  _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: 1 }, state);
  setTimeout(() => {_moveEnd(pieceId, state);}, GameConfig.speed);
};

var _moveEnd = function(pieceId, state) {
  if (Board.getPiece(pieceId, state)) {
    var newData = {status: 2};
    if (Board.shouldPromote(pieceId, state)) newData.type = 1;// promote
    _updatePieceAndEmit(pieceId, newData, state); // on delay
  }

  setTimeout(() => {              // off delay
    if (Board.getPiece(pieceId, state)) {
      _updatePieceAndEmit(pieceId, {status: 0}, state);
    }
  }, GameConfig.delay);
};

var _gameExpired = function(id, state) {
  _gameOver(state);
};

var _isCorrectUser = function(userId, pieceId, state) {
  let color = (pieceId < 16 ? 'white' : 'black');
  return state[color]._id.toString() === userId;
};

// UPDATE STATE
var _updatePieceAndEmit = function(pieceId, newData, state) {
  State.updatePiece(pieceId, newData, state);
  state.moveId += 1;
  _emitStateData(state.gameId, 'game-move', {pieceId: pieceId, newData: newData, moveId: state.moveId});
};

// UPDATE DB
var _gameOver = function(state) {
  // update mongo with new state
  Game.findById(state.gameId)
  .populate('white')
  .populate('black')
  .exec((err, game) => {
    var gameId = game._id.toString();
    if (err) {
      io.to(game._id).emit('errors', err.errors);
    } else {
      _archiveGame(game, Board.getWinner(state));
    };
  });
};

var _archiveGame = function(game, winner) {
  game.status = 'archived';
  game.winner = winner;
  game.save();
  var gameId = game._id.toString();
  redis.lrange(gameId, 0, -1, (err, moves) => {
    MoveHistory.create({game: game, moves: moves});
    cache.del(gameId);
    redis.del(gameId);
  });
};

var _updateMoveHistory = function(gameId, data) {
  Object.assign(data, {createdAt: new Date()});
  redis.lpush(gameId.toString(), JSON.stringify(data)); // add to history
};

// CLIENT COMMUNICATION
var _emitStateData = function(gameId, action, data) {
  io.to(gameId).emit(action, data);
  _updateMoveHistory(gameId, {action: action, data: data});
};

export default {
  init: init,
  movePiece: movePiece,
  getState: getState,
  gameOver: _gameOver
};
