var config = require('./config');
var redis = require('redis').createClient(config.redis);

redis.on("connect", function() {
  console.info("redis connected");
});

module.exports = redis;
