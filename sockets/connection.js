var socketio = require('socket.io');
var session = require('../config/session');
var sharedsession = require("express-socket.io-session");

var User = require('../models/user');
var Game = require('../models/game');

module.exports = function(server) {

  var io = socketio.listen(server);
  io.use(sharedsession(session)); // gives access to same session

  io.on('connection', function(client){
    console.log('a user connected');

    var userData = client.handshake.session.passport;
    var currentRoom;

    // `client.handshake.session.passport.user` where the current user is provided
    if (userData) {
      User.findById(userData.user, function(err,user) {console.log(err,user);});
    } else {
      console.log('no user');
    };

    // JOIN ROOMS
    client.on('subscribe', function(data){
      if (currentRoom)
        client.leave(currentRoom);

      console.log('subscribing to ' + data.room);
      client.join(data.room, function(){
        currentRoom = data.room;
        client.emit('welcome', "welcome to " + data.room);
      });
    });

    client.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
};
