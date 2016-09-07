const ENV = require('../server').app.settings.env;
var cache = Object.create(null);
var debug = (ENV === 'development');

function _del(key){
  delete cache[key];
};

export default {
  put(key, value, time, timeoutCallback) {
    if (debug) console.log('caching: %s = %j (@%s)', key, value, time);

    if (typeof time !== 'undefined' && (typeof time !== 'number' || isNaN(time) || time <= 0)) {
      throw new Error('Cache timeout must be a positive number');
    } else if (typeof timeoutCallback !== 'undefined' && typeof timeoutCallback !== 'function') {
      throw new Error('Cache timeout callback must be a function');
    }

    var oldRecord = cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    }

    var record = {
      value: value,
      expire: time + Date.now()
    };

    if (!isNaN(record.expire)) {
      record.timeout = setTimeout(function() {
        _del(key);
        if (timeoutCallback) {
          timeoutCallback(key, value);
        }
      }, time);
    }

    cache[key] = record;

    return value;
  },

  del(key) {
    var canDelete = true;

    var oldRecord = cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
      if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
        canDelete = false;
      }
    } else {
      canDelete = false;
    }

    if (canDelete) {
      _del(key);
      if (debug) console.log('deleting: %s = %j', key, oldRecord.value);
    }

    return canDelete;
  },

  clear() {
    for (var key in cache) {
      clearTimeout(cache[key].timeout);
    }
    cache = Object.create(null);
  },

  get(key) {
    var data = cache[key];
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= Date.now()) {
        return data.value;
      } else {
        delete cache[key];
      }
    }
    return null;
  },

  keys() {
    return Object.keys(cache);
  }
};
