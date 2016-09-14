import io from '../config/socketio';

import GameIndexConnection from './game_index_connection';
import GameConnection from './game_connection';

import User from '../models/user';
import Game from '../models/game';

// import GameManager from '../state/manager';
// var _isActive = function() {return true;};
// var _isFull = function() {return true;};
// var testGame = {_id: "57d49e8de623446ad2761b8b", isActive: _isActive, isFull: _isFull, white: 1};
// GameManager.init(testGame);
// GameManager.movePiece(testGame._id, 1, 8, [3,0]);

io.on('connection', client => {

  console.log('socket connection');
  var currentRoom, userId;

  // CLEANUP
  const cleanupGame = gameId => {
    console.log("trying to cleanup game");
    var userId;
    if (client.handshake.session.passport)
      var userId = client.handshake.session.passport.user;
    Game.findById(gameId)
      .populate('white')
      .populate('black')
      .exec(function(err, game){
        if (err) {
          client.emit('errors', err.errors);
        } else if (game) {
          User.findById(userId, function(_, user){
            if (user)
              game.leave(user, function(err, game){
                if (err)
                  client.emit('errors', err.errors);
                else
                  client.emit('left-game', game);
              });
          });
        }
      });
  };

  // JOIN SUCCESS
  const joined = data => {
    if (currentRoom !== data.room) {
      console.log('joined room: ' + data.room);
      console.log('leaving: ' + currentRoom);
      client.leave(currentRoom, function(){
        console.log("left: " + currentRoom);
        if (currentRoom && currentRoom !== 'index') {
          cleanupGame(currentRoom);
        }
        currentRoom = data.room;
      });
    }
  };

  client.on('disconnect', () => {
    console.log('user disconnected');
    if (currentRoom !== 'index')
      cleanupGame(currentRoom);
  });

  // JOIN INDEX
  GameIndexConnection(client, joined);
  GameConnection(client, joined);
});

module.exports = io;
