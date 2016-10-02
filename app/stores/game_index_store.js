import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import GameIndexConstants from '../constants/game_index_constants';

var _games = {};
var _userCount;
var _error = null;
var CHANGE_EVENT = 'change';

function _resetGames(games) {
  _games = {};

  games.forEach(function(game) {
    _games[game._id] = game;
  });
  _clearError();
};

function _setGame(game) {
  _games[game._id] = game;
};

function _removeGame(game) {
  delete _games[game._id];
};

function _setUserCount(count) {
  _userCount = count;
};

function _setError(error) {
  _error = error;
};

function _clearError() {
  _error = null;
};

class GameIndexStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  all() {
    var games = Object.keys(_games).map((gameId) => {
      return _games[gameId];
    });

    return games;
    // return games.sort(function(g1, g2){
    //   return new Date(g2.updated_at) - new Date(g1.updated_at);
    // });
  }

  error() {
    return _error;
  }

  find(id) {
    return _games[id];
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
      case GameIndexConstants.GAMES_RECEIVED:
        _resetGames(payload.games);
        break;
      case GameIndexConstants.GAME_RECEIVED:
        _setGame(payload.game);
        break;
      case GameIndexConstants.GAME_REMOVED:
        _removeGame(payload.game);
        break;
      case GameIndexConstants.USER_COUNT_RECEIVED:
        _setUserCount(payload.count);
        break;
      case GameIndexConstants.ERROR_RECEIVED:
        _setError(payload.error);
        break;
    }
    this.emitChange();
  }
}

export default new GameIndexStore();
