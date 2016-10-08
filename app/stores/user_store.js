import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import UserConstants from '../constants/user_constants';

var _currentUser, _errors;
var CHANGE_EVENT = 'change';

function _login(user) {
  _currentUser = user;
  _errors = null;
}

function _logout() {
  _currentUser = null;
  _errors = null;
}

function _setErrors(errors) {
  _errors = errors;
}

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  currentUser() {
    if (_currentUser) {
      return _currentUser;
    }
  }

  errors() {
    if (_errors) {
      return _errors;
    }
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
      case UserConstants.LOGIN:
      	_login(data.user);
        this.emitChange();
        break;
      case UserConstants.LOGOUT:
      	_logout();
        this.emitChange();
        break;
      case UserConstants.ERROR:
        _setErrors(data.errors);
        this.emitChange();
        break;
    }
  }
}

export default new UserStore();
