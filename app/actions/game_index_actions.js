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

  receiveUserCount: (count) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.USER_COUNT_RECEIVED,
      userCount: userCount
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
