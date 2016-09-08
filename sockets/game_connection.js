const Game = require('../models/game');
const User = require('../models/user');

module.exports = (client, joined) => {
  var userId;
  if (client.handshake.session.passport)
    userId = client.handshake.session.passport.user;


  const gameData = (data, user) => {
    if (data.black)
      data.game.black = user._id;
    else
      data.game.white = user._id;

    return data.game;
  };

  const validateUser = (id, successCB) => {
    User.findById(id, (_, user) => {
      if (user)
        successCB(user);
      else
        client.emit('errors', {login: "login required"});
    });
  };

  client.on("create-game", data => {
    validateUser(userId, user => {
      Game.create(gameData(data, user),
        (err, game) => {
          if (err)
            client.emit('errors', err.errors);
          else
            client.emit('created-game', game);
        }
      );
    });
  });

  client.on("join-game", data => {
    console.log('client attempted to join game');
    validateUser(userId, user => {
      Game.findById(data.id)
        .populate('white')
        .populate('black')
        .exec((err, game) => {
          if (err) {
            client.emit('errors', err.errors);
          } else {
            game.join(user, null, (err, game) => {
              if (err) {
                client.emit('errors', err.errors);
              } else {
                console.log("successfully joined game: " + game._id);
                client.broadcast.in('index').send({game: game});
                joined({room: game._id});
                client.join(game._id);
                client.emit('joined-game', {game: game});
              }
            });
          }
        });
    });
  });

  client.on("game-move", data => { // data format: {gameId: -, pieceId: -, posId: -}

  });
};
