import redis from '../config/redis';
import io from '../config/socketio';

var _userCount = 0;
var _set = function(id) {
  if (id)
    redis.hset('onlineStatus', id, 1, (err, res) => {
      _userCount += res;
      io.to('index').emit('userCount', _userCount);
    });
  else
    io.to('index').emit('userCount', ++_userCount);
};

var _del = function (id) {
  if (id)
    redis.hdel('onlineStatus', id, (err, res) => {
      _userCount -= res;
      io.to('index').emit('userCount', _userCount);
    });
  else
    io.to('index').emit('userCount', --_userCount);
};

var _getCount = function() {
  return _userCount;
};

export default {
  set: _set,
  del: _del,
  getCount: _getCount
};
