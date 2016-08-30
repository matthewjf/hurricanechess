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
    console.log('connection');
    var currentRoom, userId;

    // JOIN SUCCESS
    var joined = function(data) {
      console.log('joined room: ' + data.room);
      client.leave(currentRoom);
      currentRoom = data.room;
      client.emit('joined', data);
    };

    // CURRENT USER
    if (client.handshake.session.passport)
      userId = client.handshake.session.passport.user;
    User.findById(userId, function(err,user) {
      console.log('user: ' + user);
    });

    // JOIN INDEX
    GameIndexConnection(client, joined);
    GameConnection(client, joined);

    client.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
};
