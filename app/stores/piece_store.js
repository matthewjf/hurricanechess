import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import PieceConstants from '../constants/piece_constants';

var _pieces = {};

var _error = null;
var CHANGE_EVENT = 'change';

function _setPieces(pieces) {
  _pieces = pieces;
}

function _removePieces() {
  _pieces = {};
}

function _removePiece(piece) {

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
    return _pieces;
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
      case PieceConstants.PIECES_RECEIVED:
        _setPieces(payload.pieces);
        break;
      case PieceConstants.ERROR_RECEIVED:
        _setError(payload.error);
        break;
      case PieceConstants.PIECES_REMOVED:
        _removePieces();
        break;
    }
    this.emitChange();
  }
}

export default new PieceStore();
