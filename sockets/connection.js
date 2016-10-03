import io from '../config/socketio';

import GameIndexConnection from './game_index_connection';
import GameConnection from './game_connection';

import User from '../models/user';
import Game from '../models/game';

import OnlineStatus from '../helpers/online_status';

io.on('connection', client => {
  var currentRoom;
  var userId = (client.handshake.session.passport || {}).user || client.id;

  OnlineStatus.set(userId);

  // CLEANUP
  const cleanupGame = gameId => {
    var userId = (client.handshake.session.passport || {}).user;
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
      client.leave(currentRoom, function(){
        if (currentRoom && currentRoom !== 'index') {
          cleanupGame(currentRoom);
        }
        currentRoom = data.room;
      });
    }
  };

  // DICONNECT
  client.on('disconnect', () => {
    OnlineStatus.del(userId);

    if (currentRoom !== 'index')
      cleanupGame(currentRoom);
  });

  // JOIN INDEX
  GameIndexConnection(client, joined);
  GameConnection(client, joined);
});

module.exports = io;
