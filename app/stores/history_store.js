import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import HistoryConstants from '../constants/history_constants';

var _history = {};

var CHANGE_EVENT = 'change';

function _setHistory(history) {
  _history = history;
};

function _removeHistory() {
  _history = {};
};

class HistoryStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  get() {
    return _history;
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

  dispatcherCallback(payload) {
    switch(payload.actionType) {
      case HistoryConstants.HISTORY_RECEIVED:
        _setHistory(payload.history);
        this.emitChange();
        break;
      case HistoryConstants.HISTORY_REMOVED:
        _removeHistory();
        this.emitChange();
        break;
    }
  }
}

export default new HistoryStore();
