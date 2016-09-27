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

  // UPDATE STATE
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

  var removeId = Board.getTarget(newPos, state);
  delete state.pieces[removeId];

  _clearTarget(currPos, state);
  _setTarget(pieceId, newPos, state);

  var pieceData = { pos: newPos, hasMoved: 1, status: 1 };

  Object.assign(pieces[pieceId], pieceData);

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
  _clearTarget(currPos, state);
  state.reserved[targetPos[0]][targetPos[1]] = pieceId;
  Object.assign(state.pieces[pieceId], { pos: targetPos, hasMoved: 1, status: -1 });
  _emitStateData('game-move', state);

  setTimeout(() => {
    var removeId = Board.getTarget(targetPos, state);
    delete state.pieces[removeId];
    _setTarget(pieceId, targetPos, state);
    state.reserved[targetPos[0]][targetPos[1]] = undefined;
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
  delete state.pieces[Board.getTarget(pos, state)];
  _clearTarget(currPos, state);
  _setTarget(pieceId, pos, state);
  Object.assign(state.pieces[pieceId], { pos: pos, hasMoved: 1, status: 1 });
  setTimeout(() => {_moveEnd(pieceId, state);}, GameConfig.speed);
};

var _updateMoveHistory = function(state) {
  var moveData = { state: state, createdAt: new Date() };
  redis.lpush(state.gameId.toString(), JSON.stringify(moveData)); // add to history
};

var _moveEnd = function(pieceId, state) {
  if (Board.shouldPromote(pieceId, state) && state.pieces[pieceId])
    state.pieces[pieceId].type = 1; // promote

  if (state.pieces[pieceId]) state.pieces[pieceId].status = 2;
  _emitStateData('game-move', state);

  setTimeout(() => { // off delay
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

var _gameExpired = function(id, state) {
  _gameOver(state);
};

var _isCorrectUser = function(userId, pieceId, state) {
  let color = (pieceId < 16 ? 'white' : 'black');
  return state[color]._id.toString() === userId;
};

  // UPDATE DB
var _gameOver = function(state) {
  var gameId = state.gameId;
  var history = redis.lrange(gameId, 0, -1);

  // cleanup cache and redis
  cache.del(gameId);
  redis.del(gameId);

  // update mongo with new state
  Game.findById(gameId)
  .populate('white')
  .populate('black')
  .exec((err, game) => {
    if (err) {
      io.to(game._id).emit('errors', err.errors);
    } else {
      game.status = 'archived';
      game.winner = Board.getWinner(state);
      game.save();
      MoveHistory.create({game: game, moves: history});
    };
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
