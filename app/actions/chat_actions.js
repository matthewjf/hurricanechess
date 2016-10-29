import ChatConstants from '../constants/chat_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var ChatActions = {
  receiveChat: (chat) => {
    if (chat)
      AppDispatcher.dispatch({
        actionType: ChatConstants.CHAT_RECEIVED,
        chat: chat
      });
  },

  removeChats: () => {
    AppDispatcher.dispatch({
      actionType: ChatConstants.CHATS_REMOVED
    });
  }
};

export default ChatActions;
