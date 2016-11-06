import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import PieceConstants from '../constants/piece_constants';
import State from '../../state/state';
import GameSubscription from '../sockets/game_subscription';

var _pieces = {};
var _grid = [];
var _reserved = [];
var _gameId;
var _moveId;

var _error = null;
var CHANGE_EVENT = 'change';

function _setState(state) {
  _gameId = state.gameId;
  _pieces = state.pieces || {};
  _grid = state.grid || [];
  _reserved = state.reserved || [];
  _moveId = state.moveId;
}

function _getState() {
  return {pieces: _pieces, grid: _grid, gameId: _gameId, reserved: _reserved};
}

function _setMove(data) {
  if (_moveId && data.moveId < _moveId) {
    GameSubscription.requestGameState(_gameId);
  } else {
    _moveId = data.moveId;
    State.updatePiece(data.pieceId, data.newData, _getState());
  }
}

function _removeState() {
  _gameId = undefined;
  _pieces = {};
  _grid = [];
  _reserved = [];
  _moveId = undefined;
}

function _setError(error) {
  _error = error;
}

function _clearError() {
  _error = null;
}

class PieceStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  get() {
    return _getState();
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
      case PieceConstants.STATE_RECEIVED:
        _setState(payload);
        this.emitChange();
        break;
      case PieceConstants.MOVE_RECEIVED:
        _setMove(payload.data);
        this.emitChange();
        break;
      case PieceConstants.ERROR_RECEIVED:
        _setError(payload.error);
        this.emitChange();
        break;
      case PieceConstants.STATE_REMOVED:
        _removeState();
        this.emitChange();
        break;
    }
  }
}

export default new PieceStore();
