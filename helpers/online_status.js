import redis from '../config/redis';
import io from '../config/socketio';

var _set = function(id) {
  redis.hincrby('onlineStatus', id, 1, (err, res) => {
    if (res) {
      _getCount(_sendCount);
    }
  });
};

var _del = function (id) {
  redis.hincrby('onlineStatus', id, -1, (err, res) => {
    if (res < 1) {
      redis.hdel('onlineStatus', id, (err, res) => {
        _getCount(_sendCount);
      });
    } else {
      _getCount(_sendCount);
    }
  });
};

var _sendCount = function(count) {
  io.to('index').emit('user-count', count);
};

var _getCount = function(cb) {
  if (cb) {
    redis.hlen('onlineStatus', (err, count) => {
      cb(count);
    });
  }
};

export default {
  set: _set,
  del: _del,
  getCount: _getCount
};
