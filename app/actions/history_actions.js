import HistoryConstants from '../constants/history_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var HistoryActions = {
  receiveHistory: (history) => {
    AppDispatcher.dispatch({
      actionType: HistoryConstants.HISTORY_RECEIVED,
      history: history
    });
  },

  removeHistory: () => {
    AppDispatcher.dispatch({
      actionType: HistoryConstants.HISTORY_REMOVED
    });
  }
};

export default HistoryActions;
