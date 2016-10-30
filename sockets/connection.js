import io from '../config/socketio';

import GameIndexConnection from './game_index_connection';
import GameConnection from './game_connection';

import User from '../models/user';
import Game from '../models/game';

import OnlineStatus from '../helpers/online_status';

io.on('connection', client => {
  console.log('client conneted');
  var currentRoom;
  var userId = (client.handshake.session.passport || {}).user || client.id;
  OnlineStatus.set(userId);

  // CLEANUP
  const cleanupGame = gameId => {
    var userId = (client.handshake.session.passport || {}).user;
    Game.findById(gameId)
      .populate('white')
      .populate('black')
      .exec(function(err, game) {
        if (err) {
          client.emit('errors', err.errors);
        } else if (game) {
          User.findById(userId, function(_, user){
            if (user)
              game.leave(user, function(err, game){
                if (err) client.emit('errors', err.errors);
                else {
                  client.emit('left-game', game);
                }
              });
              let msg = {message: `${user.username} left`, time: new Date()};
              io.to(game._id).emit('game-chat', msg);
          });
        }
      });
  };

  // JOIN SUCCESS
  const joined = data => {
    console.log('client joining', data.room);
    if (!currentRoom || currentRoom.toString() !== data.room.toString()) {
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
    if (currentRoom !== 'index')
      cleanupGame(currentRoom);
    OnlineStatus.del(userId);
  });

  // JOIN INDEX
  GameIndexConnection(client, joined);
  GameConnection(client, joined);
});

module.exports = io;
