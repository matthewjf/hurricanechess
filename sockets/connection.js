import socketio from 'socket.io';
import session from '../config/session';
import sharedsession from "express-socket.io-session";

import GameIndexConnection from './game_index_connection';
import GameConnection from './game_connection';

import User from '../models/user';
import Game from '../models/game';

module.exports = function(server) {
  var io = socketio.listen(server);
  io.use(sharedsession(session)); // gives access to express session

  io.on('connection', function(client){
    console.log('socket connection');
    var currentRoom, userId;

    // CLEANUP
    var cleanupGame = function(gameId) {
      var userId;
      if (client.handshake.session.passport)
        var userId = client.handshake.session.passport.user;
      Game.findById(gameId)
        .populate('white')
        .populate('black')
        .exec(function(err, game){
          if (err) {
            client.emit('errors', err.errors);
          } else {
            User.findById(id, function(_, user){
              if (user)
                game.leave(user, function(err, game){
                  if (err)
                    client.emit('errors', err.errors);
                  else
                    console.log('left game');
                    client.emit('left-game', game);
                });
            });
          }
        });
    };

    // JOIN SUCCESS
    var joined = function(data) {
      console.log('joined room: ' + data.room);
      console.log('leaving: ' + currentRoom);
      client.leave(currentRoom, function(){
        console.log("left: " + currentRoom);
        if (currentRoom !== 'index') {
          cleanupGame(currentRoom);
        }
        currentRoom = data.room;
      });
    };

    client.on('disconnect', function(){
      console.log('user disconnected');
      if (currentRoom !== 'index')
        cleanupGame(currentRoom);
    });

    // JOIN INDEX
    GameIndexConnection(client, joined);
    GameConnection(client, joined);
  });
};
