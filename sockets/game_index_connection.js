var Game = require('../models/game');

export default function(client, joined) {
  client.on("join-index", function(_){
    console.log('client attempted to join index');
    client.join("index", function() {
        Game.find()
          .where('status').ne('archived')
          .populate('white')
          .populate('black')
          .exec(function(err, games) {
            joined({room: 'index'});
            client.join('index');
            client.emit('joined-index', {games: games});
          });
    });
  });
};
