import PieceConstants from '../constants/piece_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var PieceActions = {
  receiveState: (state) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.STATE_RECEIVED,
      gameId: state.gameId,
      pieces: state.pieces,
      grid: state.grid,
      reserved: state.reserved
    });
  },

  receiveMove: (data) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.MOVE_RECEIVED,
      data: data
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
