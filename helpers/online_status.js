import redis from '../config/redis';
import io from '../config/socketio';

var _set = function(id) {
  redis.sadd('onlineStatus', id, (err, res) => {
    if (res) {
      _getCount((onlineCount) => {
        io.to('index').emit('user-count', onlineCount);
      });
    }
  });
};

var _del = function (id) {
  redis.srem('onlineStatus', id, (err, res) => {
    if (res) {
      _getCount((onlineCount) => {
        io.to('index').emit('user-count', onlineCount);
      });
    }
  });
};

var _getCount = function(cb) {
  if (cb) {
    redis.scard('onlineStatus', (err, onlineCount) => {
      cb(onlineCount);
    });
  }
};

export default {
  set: _set,
  del: _del,
  getCount: _getCount
};
