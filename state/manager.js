import redis from '../config/redis';
import cache from './cache';
import io from '../config/socketio';
import GameConfig from '../config/game';
import Game from '../models/game';
import Board from '../helpers/board';
import MoveHistory from '../models/history';
import InitialPieces from '../helpers/initial_pieces';

/*
  game starts
  - setup game
  - accept moves for game (options upgrade type)
  game ends
  - delete from memory
  - get and delete move history from redis
  - store results to db
*/

var getInitialState = function(game) {
  var pieces = InitialPieces();
  return ({
    white: game.white,
    black: game.black,
    pieces: pieces,
    grid: Board.buildGrid(pieces)
  });
};

// PUBLIC API

var init = function(game) {
  if (game.isActive() && game.isFull() && !cache.get(game._id)) {
    let state = cache.put(
      game._id.toString(),
      getInitialState(game),
      1000 * 60 * 30, // 30 minutes max time
      _gameExpired
    );
    io.to(game._id).emit('state-init', {pieces: state.pieces, grid: state.grid});
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
    // handle knight moves / castling / pawn promotion
    _performMove(gameId, pieceId, targetPos);
  };
};

// PRIVATE
var _performMove = function(gameId, pieceId, targetPos) {
  var state = getState(gameId);
  var pieces = state.pieces;

  // moveEnd
  var currPos = pieces[pieceId].pos;
  console.log('currrpos: ', pieces[pieceId]);
  if (currPos[0] === targetPos[0] && currPos[1] === targetPos[1]) {
    setTimeout(() => {
      var state = getState(gameId);
      if (state.pieces[pieceId]) state.pieces[pieceId].onDelay = 0;
      // need to emit here
    }, GameConfig.delay);
    return;
  };

  var newPos = Board.getNextPos(pieceId, targetPos, state);
  if (newPos) {
    var removeId = Board.getTarget(newPos, state); // moveEnd
    delete state.pieces[removeId];

    var pieceData = {
      id: pieceId,
      pos: newPos,
      type: pieces[pieceId].type,
      hasMoved: 1,
      onDelay: 1
    };

    // var moveData = {
    //   piece: pieceData,
    //   removeId: removeId,
    //   createdAt: new Date()
    // };

    state.grid[currPos[0]][currPos[1]] = undefined;
    state.grid[newPos[0]][newPos[1]] = pieceId;

    pieces[pieceId] = pieceData;

    io.to(gameId).emit('game-move', state); // emit to client

    var moveData = {
      state: state,
      createdAt: new Date()
    };
    redis.lpush(gameId, JSON.stringify(moveData)); // add to history

    if (!pieces[28] || !pieces[4]) {
      _gameOver({_id: gameId, state: state});
    } else {
      setTimeout(() => {
        _performMove(gameId, pieceId, targetPos);
      }, GameConfig.speed);
    }
  } else {
    throw new Error('invalid move');
  }
};

var _updateState = function() {
  // TODO: handle update logic
};

var _moveEnd = function() {
  // TODO: send move end
};

var _gameExpired = function(id, state) {
  _gameOver({_id: id, state: state});
};

var _gameOver = function(game) {
  console.log('removed game by id ', game._id);
  var state = game.state;
  var history = redis.lrange(game._id, 0, -1);

  // cleanup cache and redis
  cache.del(game._id);
  redis.del(game._id);

  // update mongo with new state
  Game.findById(game._id, (err, game) => {
    if (err) {
      io.to(game._id).emit('errors', err.errors);
    } else {
      game.status = 'archived';
      game.winner = _getWinner(state);
      game.save();
      MoveHistory.create({game: game, moves: history});
    };
  });
};

var _getWinner = function(state) {
  if (!state.pieces[28] || !state.pieces[4])
    return 'draw';
  else if (!state.pieces[28])
    return 'white';
  else if (!state.pieces[4])
    return 'black';
  else
    return 'none';
};

var _isCorrectUser = function(userId, pieceId, state) {
  let color = (pieceId < 16 ? 'white' : 'black');
  return state[color]._id.toString() === userId;
};

export default {
  init: init,
  movePiece: movePiece,
  getState: getState
};
