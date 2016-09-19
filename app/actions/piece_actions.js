import PieceConstants from '../constants/piece_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var PieceActions = {
  receiveState: (state) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.STATE_RECEIVED,
      pieces: state.pieces,
      grid: state.grid
    });
  },

  handleError: (error) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.ERROR_RECEIVED,
      error: error
    });
  },

  removeState: () => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.STATE_REMOVED
    });
  }
};

export default PieceActions;
