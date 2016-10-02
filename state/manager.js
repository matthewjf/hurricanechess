 /*
 /   Responsibility: initialize game state and manage move timers
 /   All game logic is delegated to helper files
 /   TODO: break this up into smaller modules
*/

import redis from '../config/redis';
import cache from './cache';
import io from '../config/socketio';
import GameConfig from '../config/game';
import Game from '../models/game';
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
    reserved: Board.buildGrid({})
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

    _emitStateData('state-init', state);
  } else {
    throw new Error('game cannot be initialized');
  }
};

var getState = function(gameId) {
  return cache.get(gameId);
};

var movePiece = function(gameId, userId, pieceId, targetPos) {
  var state = getState(gameId);
  if (!state) throw new Error('no game found');
  if (!_isCorrectUser(userId, pieceId, state)) throw new Error('incorrect user');
  if (Board.canMovePiece(pieceId, targetPos, state)) {
    var type = state.pieces[pieceId].type;
    if (type === 4)
      _performKnightMove(pieceId, targetPos, state);
    else if ( type === 0 && Board.isCastleMove(pieceId, targetPos, state))
      _performCastleMove(pieceId, targetPos, state);
    else
      _performMove(pieceId, targetPos, state);
  };
};

// PRIVATE

  // MOVE STATE
var _performMove = function(pieceId, targetPos, state) {
  var gameId = state.gameId;
  var pieces = state.pieces;
  if (!pieces[pieceId]) return; // piece is not available

  var currPos = pieces[pieceId].pos;
  if (currPos[0] === targetPos[0] && currPos[1] === targetPos[1]) {
    _moveEnd(pieceId, state);
    return;
  };

  var newPos = Board.getNextPos(pieceId, targetPos, state);
  if (!newPos) { // can't move to target pos
    _moveEnd(pieceId, state);
    return;
  }

  _deletePiece(Board.getTarget(newPos, state), state);
  _updatePiece(pieceId, { pos: newPos, hasMoved: 1, status: 1 }, state);

  _emitStateData('game-move', state);

  if (Board.isGameOver(state)) {
    _gameOver(state);
  } else {
    setTimeout(() => {
      _performMove(pieceId, targetPos, state);
    }, GameConfig.speed);
  }
};

var _performKnightMove = function(pieceId, targetPos, state) {
  let currPos = state.pieces[pieceId].pos;

  // TODO: updatePiece
  _clearTarget(currPos, state);
  _setReserved(pieceId, targetPos, state);
  Object.assign(state.pieces[pieceId], { pos: targetPos, hasMoved: 1, status: -1 });

  _emitStateData('game-move', state);

  setTimeout(() => {
    _deletePiece(Board.getTarget(targetPos, state), state);

    // TODO: updatePiece
    _setTarget(pieceId, targetPos, state);
    _clearReserved(targetPos, state);
    _emitStateData('game-move', state);
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

  _emitStateData('game-move', state);
};

var _performImmediate = function(pieceId, pos, state) {
  var currPos = state.pieces[pieceId].pos;
  _deletePiece(Board.getTarget(pos, state), state);
  _updatePiece(pieceId, { pos: pos, hasMoved: 1, status: 1 }, state);
  setTimeout(() => {_moveEnd(pieceId, state);}, GameConfig.speed);
};

var _updateMoveHistory = function(state) {
  // TODO: redefine movedata
  var moveData = { state: state, createdAt: new Date() };
  redis.lpush(state.gameId.toString(), JSON.stringify(moveData)); // add to history
};

var _moveEnd = function(pieceId, state) {
  if (Board.shouldPromote(pieceId, state) && state.pieces[pieceId]) // promote
    state.pieces[pieceId].type = 1;

  if (state.pieces[pieceId]) state.pieces[pieceId].status = 2; // on delay
  _emitStateData('game-move', state);

  setTimeout(() => {              // off delay
    if (state.pieces[pieceId]) {
      state.pieces[pieceId].status = 0;
      _emitStateData('game-move', state);
    }
  }, GameConfig.delay);
};

  //  HELPERS

var _setTarget = function(pieceId, target, state) {
  state.grid[target[0]][target[1]] = pieceId;
};

var _clearTarget = function(target, state) {
  _setTarget(undefined, target, state);
};

var _setReserved = function(pieceId, target, state) {
  state.reserved[target[0]][target[1]] = pieceId;
};

var _clearReserved = function(target, state) {
  _setReserved(undefined, target, state);
};

var _deletePiece = function(pieceId, state) {
  var piece = state.pieces[pieceId];
  if (pieceId && piece) {
    _clearTarget(piece.pos, state);
    delete state.pieces[pieceId];
    // TODO: emit here
  }
};

var _updatePiece = function(pieceId, newData, state) {
  var piece = state.pieces[pieceId];
  if (pieceId && piece) {
    if (newData.pos) {
      _clearTarget(piece.pos, state);
      _setTarget(pieceId, newData.pos, state);
    }
    Object.assign(state.pieces[pieceId], newData);
    // TODO: emit here
  }
};

var _gameExpired = function(id, state) {
  _gameOver(state);
};

var _isCorrectUser = function(userId, pieceId, state) {
  let color = (pieceId < 16 ? 'white' : 'black');
  return state[color]._id.toString() === userId;
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

  // CLIENT COMMUNICATION
var _emitStateData = function(action, state) {
  io.to(state.gameId).emit(action, state);
  _updateMoveHistory(state);
};

export default {
  init: init,
  movePiece: movePiece,
  getState: getState,
  gameOver: _gameOver
};
