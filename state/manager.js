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
  return ({
    white: game.white,
    black: game.black,
    pieces: InitialPieces
  });
};

// PUBLIC API

var init = function(game) {
  console.log(game);
  if (game.isActive() && game.isFull() && !cache.get(game._id)) {
    let state = cache.put(
      game._id.toString(),
      getInitialState(game),
      1000 * 60 * 30, // 30 minutes max time
      // 1000,
      _gameExpired
    );
    console.log(state.pieces);
    io.to(game._id).emit('game-init', {pieces: state.pieces});
  } else {
    throw new Error('game cannot be initialized');
  }
};

var getState = function(gameId) {
  return cache.get(gameId);
};

var movePiece = function(gameId, userId, pieceId, target) {
  var state = getState(gameId);
  if (!state) return new Error('no game found');
  if (!_isCorrectUser(userId, pieceId, state)) return new Error('incorrect user');
  if (Board.canMovePiece(pieceId, target, state)) {
    console.log('trying to move piece');
    // handle knight moves / castling / pawn promotion
    _performMove(gameId, pieceId, target);
  };
};

// PRIVATE
var _performMove = function(gameId, pieceId, target) {
  console.log('performing move');
  var state = getState(gameId);
  var pieces = state.pieces;

  // at move end
  var pos = pieces[pieceId].pos;
  if (pos[0] === target[0] && pos[1] === target[1]) {
    setTimeout(() => {
      var state = getState(gameId);
      if (state.pieces[pieceId]) state.pieces[pieceId].onDelay = 0;
    }, GameConfig.delay);
    return;
  };

  var newPos = Board.getNextPos(pieceId, target, state);
  if (newPos) {
    var removeId = Board.getTarget(target, state);
    delete state.pieces[removeId];

    var moveData = {
      pieceId: pieceId,
      pos: newPos,
      type: pieces[pieceId].type,
      removeId: removeId,
      createdAt: new Date()
    };

    pieces[pieceId] = {pos: moveData.pos, type: moveData.type, hasMoved: 1, onDelay: 1}; // set new state

    io.to(gameId).emit('game-move', moveData); // emit to client
    redis.lpush(gameId, JSON.stringify(moveData)); // add to history

    if (!state.pieces[28] || !state.pieces[4]) {
      _gameOver({_id: gameId, state: state});
    } else {
      setTimeout(() => {
        _performMove(gameId, pieceId, target);
      }, GameConfig.speed);
    }
  } else {
    throw new Error('invalid move');
  }
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
  return state[color] === userId;
};

export default {
  init: init,
  movePiece: movePiece,
  getState: getState
};
