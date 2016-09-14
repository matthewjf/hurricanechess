import GameConstants from '../constants/game_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var GameActions = {
  receiveGame: (game) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.GAME_RECEIVED,
      game: game
    });
  },

  handleError: (error) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.ERROR_RECEIVED,
      error: error
    });
  },
  
  removeGame: () => {
    AppDispatcher.dispatch({
      actionType: GameConstants.GAME_REMOVED
    });
  }
};

export default GameActions;
