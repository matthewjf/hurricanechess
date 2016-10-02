/*
/   Removes any non-archived games on server start
/   Any game state would have been lost on reset
/   Removes any online players
*/

var mongoose = require('../config/database');
import redis from '../config/redis';
import Game from '../models/game';
import cache from '../state/cache';

var connected = {redis: false, mongoose: false};

var cleanupGames = function() {
  if (connected.redis && connected.mongoose) {
    Game.find({status: {$ne: 'archived'}}, function(err, games) {
      games.forEach((game) => {
        var gameId = game._id.toString();
        if (!cache.get(gameId)) {
          Game.findByIdAndRemove(game._id, function(err, doc) { /* nothing */ });
        };
        redis.del(gameId);
      });
    });
  }
};

var resetOnline = function() {
  redis.del('onlineStatus');
};

mongoose.connection.once('open', function() {
  connected.mongoose = true;
  cleanupGames();
});

redis.on("connect", function() {
  connected.redis = true;
  cleanupGames();
  resetOnline();
});

module.exports;
