import PieceConstants from '../constants/piece_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var PieceActions = {
  receivePieces: (pieces) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.PIECES_RECEIVED,
      pieces: pieces
    });
  },

  handleError: (error) => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.ERROR_RECEIVED,
      error: error
    });
  },

  removePieces: () => {
    AppDispatcher.dispatch({
      actionType: PieceConstants.PIECES_REMOVED
    });
  }
};

export default PieceActions;
