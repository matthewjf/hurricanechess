import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import GameConstants from '../constants/game_constants';

var _game = {};

var _error = null;
var CHANGE_EVENT = 'change';

function _setGame(game) {
  _game = game;
};

function _removeGame(game) {
  _game = {};
};

function _setError(error) {
  _error = error;
};

function _clearError() {
  _error = null;
};

class GameStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  get() {
    return _game;
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
      case GameConstants.GAME_RECEIVED:
        _setGame(payload.game);
        this.emitChange();
        break;
      case GameConstants.ERROR_RECEIVED:
        _setError(payload.error);
        this.emitChange();
        break;
      case GameConstants.CLEAR_GAME:
        _removeGame();
        this.emitChange();
        break;
    }
  }
}

export default new GameStore();
