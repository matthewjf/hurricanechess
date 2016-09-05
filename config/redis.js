import config from './config';
var redis = require('redis').createClient(config.redis);

redis.on("connect", function() {
  console.log("redis connected");
});

module.exports = redis;
