var Game = require('../models/game');
var User = require('../models/user');

module.exports = function(client, success) {
  var userId;
  if (client.handshake.session.passport)
    var userId = client.handshake.session.passport.user;


  var makeGame = function() {

  };

  var joinGame = function() {

  };

  client.on("create", function(data){
    // validate user
    User.findById(userId, function(err,user) {
      if (user) {
        Game.create(data, function(err, game) {
          console.log(game);
        });
      } else {
        client.emit('error', {message: "login required"});
      }
    });
  });

  client.on("join", function(data){
    // validate user
    User.findById(userId, function(err,user) {
      if (user) {
        
      } else {
        client.emit('error', {message: "login required"});
      }
    });
  });
};
