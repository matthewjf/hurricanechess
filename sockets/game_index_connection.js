var Game = require('../models/game');

export default function(client, success) {
  client.on("join-index", function(_){
    client.join("index", function() {
        Game.find()
          .where('status').ne('archived')
          .populate('white')
          .populate('black')
          .exec(function(err, games) {
            success({room: 'index'});
            client.join('index');
            client.emit('joined-index', {games: games});
          });
    });
  });
};
