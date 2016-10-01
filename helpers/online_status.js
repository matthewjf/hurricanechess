import redis from '../config/redis';

var _set = function(id) {
  redis.incr('onlineCount');
  redis.hmset('onlineStatus', id, 1, (err, res) => {});
};

var _remove = function (id) {
  redis.decr('onlineCount');
  redis.hdel('onlineStatus', id, (err, res) => {});
};
