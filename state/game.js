import redis from '../config/redis';
import cache from './cache';
import io from '../config/socketio';
import Piece from './pieces';
import {toCoord, toPos} from '../helpers/pos';

/*
  game starts
  - setup game
  - accept moves for game (options upgrade type)
  game ends
  - delete from memory
  - get and delete move history from redis
  - store results to db
*/

function getInitialState(game) {
  return ({
    white: game.white,
    black: game.black,
    pieces: [
       [0,2],  [1,4],  [2,3],  [3,1],  [4,0],  [5,3],  [6,3],  [7,4],
       [8,5],  [9,5], [10,5], [11,5], [12,5], [13,5], [14,5], [15,5],
      [48,5], [49,5], [50,5], [51,5], [52,5], [53,5], [54,5], [55,5],
      [56,2], [57,4], [58,3], [59,1], [60,0], [61,3], [62,3], [63,4]
    ]
  });
}

function init(game) {
  console.log(game);
  if (game.isActive && game.isFull) {
    let state = cache.put(
      game._id.toString(),
      getInitialState(game),
      1000 * 60 * 30, // 30 minutes max time
      gameExpired
    );
    io.to(game._id).emit('state', state);
  } else {
    throw new Error('game cannot be initialized with current status and players');
  }
}

function getGame(game) {
  return cache.get(game._id);
}

function getPiece(game, pieceId) {
  return new Piece(pieceId, cache.get(game._id).pieces[pieceId]);
}

function movePiece(game, pieceId, targetPos) {
  let state = cache.get(game._id);
  let piece = new Piece(pieceId, gamestate.pieces[pieceId]);
  
  // validate correct user
  // insert game logic here
  // remove pieces as needed

  gamestate.pieces[pieceId] = piece.data();
}

function gameExpired(id, state) {
  cleanUpGame({_id: id, state: state});
  io.to(game._id).emit('game-end', {reason: 'time-limit'});
}

function cleanUpGame(game) {
  console.log('removed game by id ', game._id);
  // delete from cache memory
  // get move history from redis
  let history = redis.lrange(game._id, 0, -1);
  redis.del(game._id);
  // save results to mongo and archive
}

export default {
  init: init,
  getPiece: getPiece,
  movePiece: movePiece,
  getGame: getGame
};
