var Game = require('../models/game');

export default function(client, success) {
  client.on("join", function(data){
    if (data.room === "index") {
      client.join("index", function() {
          success(data);

          Game.find()
            .where('status').ne('archived')
            .populate('white')
            .populate('black')
            .exec(function(err, games) {
              client.emit('init', {games: games});
            });
      });
    }
  });
};
