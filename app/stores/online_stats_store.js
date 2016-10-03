import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import OnlineStatsConstants from '../constants/online_stats_constants';

var _userCount;
var CHANGE_EVENT = 'change';

function _setUserCount(count) {
  _userCount = count;
};

class OnlineStatsStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  all() {
    return {userCount: _userCount};
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  dispatcherCallback(data) {
    switch(data.actionType) {
      case OnlineStatsConstants.USER_COUNT_RECEIVED:
        _setUserCount(data.count);
        break;
    }
    this.emitChange();
  }
}

export default new OnlineStatsStore();
