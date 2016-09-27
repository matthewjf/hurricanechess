var mongoose = require('../config/database');
var redis = require('../config/redis');
import Game from '../models/game';
import cache from '../state/cache';

var connected = {redis: false, mongoose: false};

var cleanup = function(){
  if (connected.redis && connected.mongoose) {
    Game.find({status: 'active'}, function(err, games) {
      games.forEach((game) => {
        var gameId = game._id.toString();
        if (!cache.get(gameId)) {
          Game.findByIdAndRemove(game._id, function(err, doc) { /* nothing */ });
          redis.del(gameId);
        };
      });
    });
  }
};

mongoose.connection.once('open', function() {
  connected.mongoose = true;
  cleanup();
});

redis.on("connect", function() {
  connected.redis = true;
  cleanup();
});

module.exports;
