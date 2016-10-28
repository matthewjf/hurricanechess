import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import GameIndexConstants from '../constants/game_index_constants';

var _games = {};
var _error = null;
var _sort = 'newest';
var _statuses = new Set();

var CHANGE_EVENT = 'change';
var SORTS = ['oldest', 'newest'];

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

function _removeGames() {
  _games = {};
};

function _removeGame(game) {
  delete _games[game._id];
};

function _setError(error) {
  _error = error;
};

function _clearError() {
  _error = null;
};

function _setSort(sort) {
  if (SORTS.indexOf(sort) >= 0) _sort = sort;
  else _sort = 'newest';
};

function _setStatuses(statuses) {
  if (statuses) _statuses = new Set(statuses);
}

class GameIndexStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  all() {
    let allGames = Object.keys(_games).map((gameId) => {
      return _games[gameId];
    });

    let games = allGames.filter((game) => {
      return _statuses.has(game.status);
    });

    return games.sort(function(g1, g2) {
      var g1Created = new Date(g1.createdAt);
      var g2Created = new Date(g2.createdAt);
      if (_sort === 'oldest') return g1Created - g2Created;
      else return g2Created - g1Created;
    });
  }

  userCount() {
    return _userCount;
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
        this.emitChange();
        break;
      case GameIndexConstants.GAME_RECEIVED:
        _setGame(payload.game);
        this.emitChange();
        break;
      case GameIndexConstants.GAMES_REMOVED:
        _removeGames();
        this.emitChange();
        break;
      case GameIndexConstants.GAME_REMOVED:
        _removeGame(payload.game);
        this.emitChange();
        break;
      case GameIndexConstants.ERROR_RECEIVED:
        _setError(payload.error);
        this.emitChange();
        break;
      case GameIndexConstants.SORT:
        _setSort(payload.sort);
        this.emitChange();
        break;
      case GameIndexConstants.STATUSES:
        _setStatuses(payload.statuses);
        break;
    }
  }
}

export default new GameIndexStore();
