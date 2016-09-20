import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import PieceConstants from '../constants/piece_constants';

var _pieces = {};
var _grid = [];

var _error = null;
var CHANGE_EVENT = 'change';

function _setPieces(pieces) {
  _pieces = pieces || {};
}

function _setGrid(grid) {
  _grid = grid || [];
}

function _removeState() {
  _pieces = {};
  _grid = [];
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
    return {pieces: _pieces, grid: _grid};
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
        _setPieces(payload.pieces);
        _setGrid(payload.grid);
        break;
      case PieceConstants.ERROR_RECEIVED:
        _setError(payload.error);
        break;
      case PieceConstants.STATE_REMOVED:
        _removeState();
        break;
    }
    this.emitChange();
  }
}

export default new PieceStore();
