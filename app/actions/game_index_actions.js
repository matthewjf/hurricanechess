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

  removeGames: () => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.GAMES_REMOVED
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
  },

  setSort: (sort) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.SORT,
      sort: sort
    });
  },

  setStatuses: (statuses) => {
    AppDispatcher.dispatch({
      actionType: GameIndexConstants.STATUSES,
      statuses: statuses
    });
  }
};

export default GameIndexActions;
