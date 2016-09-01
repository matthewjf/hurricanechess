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
        client.emit('errors', {login: "login required"});
      }
    });
  };

  // TODO: clean up this code: emit from pre save hooks (maybe?)

  client.on("create-game", function(data){
    validateUser(userId, function(user){
      Game.create(gameData(data, user),
        function(err, game){
          if (err) {
            console.log('err: ', err.errors);
            client.emit('errors', err.errors);
          } else {
            console.log('game: ', game);
            client.broadcast.in('index').send({game: game});
            client.emit('created-game', game);
          }
        }
      );
    });
  });

  client.on("join-game", function(data){
    validateUser(userId, function(user){
      console.log('valid user attempted to join game: ' + data.id);
      Game.findById(data.id)
        .populate('white')
        .populate('black')
        .exec(function(err, game){
          if (err) {
            client.emit('errors', err.errors);
          } else {
            // if user is already in game, move on

            // else try to join game
          }
        });
    });
  });
};
