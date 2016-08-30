

var Game = require('../models/game');
var User = require('../models/user');

module.exports = function(client, success) {
  var userId;
  if (client.handshake.session.passport)
    var userId = client.handshake.session.passport.user;


  var gameData = function(data, user) {
    if (data.black)
      data.game.black = user._id;
    else
      data.game.white = user._id;

    return data.game;
  };

  var validateUser = function(id, successCB) {
    User.findById(id, function(_, user){
      if (user) {
        successCB(user);
      } else {
        client.emit('errors', {message: "login required"});
      }
    });
  };

  // TODO: clean up this code: emit from pre save hooks (maybe?)

  client.on("create", function(data){
    validateUser(userId, function(user){
      Game.create(gameData(data, user),
        function(err, game){
          if (err) {
            console.log('err: ', err.errors);
            client.emit('errors', err.errors);
          } else {
            console.log('game: ', game);
            client.emit('created', game);
            var room = game._id;
            client.join(room, function() {
              success({room: room, game: game});
            });
          }
        }
      );
    });
  });

  client.on("join", function(data){
    validateUser(userId, function(user){
      // validate user can join game
    });
  });
};
