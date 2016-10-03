import redis from '../config/redis';
import io from '../config/socketio';

var _userCount = 0;
// TODO: need to update online status for login/logout
var _set = function(id) {
  console.log('setting online status: ', _userCount);
  if (id)
    redis.hset('onlineStatus', id, 1, (err, res) => {
      _userCount += res;
      io.to('index').emit('userCount', _userCount);
    });
  else
    io.to('index').emit('userCount', ++_userCount);

};

var _del = function (id) {
  console.log('deleting online status: ', _userCount);
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
