import GameConstants from '../constants/game_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var GameActions = {
  gameJoined: (game) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.GAME_JOINED,
      game: game
    });
  },

  handleError: (error) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.ERROR_RECEIVED,
      error: error
    });
  }
};

export default GameActions;
