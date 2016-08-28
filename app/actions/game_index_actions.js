import GameIndexConstants from '../constants/game_index_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var GameIndexActions = {
  receiveGames: (games) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.GAMES_RECEIVED,
      games: games
    });
  },

  receiveGame: (game) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.GAME_RECEIVED,
      game: game
    });
  },

  removeGame: (game) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.GAME_REMOVED,
      game: game
    });
  },

  handleError: (error) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.ERROR_RECEIVED,
      error: error
    });
  }
};

export default GameIndexActions;
