import GameConstants from '../constants/game_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var GameActions = {
  receiveGameState: (data) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.GAMESTATE_RECEIVED,
      game: data.game,
      state: data.state
    });
  },

  receiveGame: (data) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.GAME_RECEIVED,
      game: data.game
    });
  },

  receiveState: (data) => {
    AppDispatcher.dispatch({
      actionType: GameConstants.STATE_RECEIVED,
      state: data.state
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
