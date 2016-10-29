import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/dispatcher.js';
import ChatConstants from '../constants/chat_constants';

var CHANGE_EVENT = 'change';

var _chats = [];

function _addChat(chat) {
  _chats.push(chat);
}

function _removeChats() {
  _chats = [];
}

class ChatStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  all() {
    return _chats;
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
      case ChatConstants.CHAT_RECEIVED:
        _addChat(payload.chat);
        this.emitChange();
        break;
      case ChatConstants.CHATS_REMOVED:
        _removeChats();
        this.emitChange();
        break;
    }
  }
}

export default new ChatStore();
