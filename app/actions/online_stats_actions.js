import OnlineStatsConstants from '../constants/online_stats_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var OnlineStatsActions = {
  receiveUserCount: (count) => {
    AppDispatcher.dispatch({
      actionType: OnlineStatsConstants.USER_COUNT_RECEIVED,
      count: count
    });
  }
};

export default OnlineStatsActions;
