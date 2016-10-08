import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';
import PieceActions from '../actions/piece_actions';
import HistoryActions from '../actions/history_actions';
import {browserHistory} from 'react-router';
const ROOM = 'game';

var GameSubscription = {
  create(data, successCB, errorCB) {
    socket.on('created-game', (game) => {
      if (successCB) successCB(game);
      socket.off('created-game');
      socket.off('errors');
      browserHistory.push("/games/" + game._id);
    });

    socket.on('errors', (errors) => {
      browserHistory.push("/");
      if (errorCB)
        errorCB(errors);
    });

    socket.emit('create-game', data);
  },

  join(id, errorCB) {
    socket.on('errors', (data) => {
      if (errorCB)
        errorCB(data);
    });

    socket.on('game', GameActions.receiveGame);
    socket.on('game-init', PieceActions.receiveState);
    socket.on('game-move', PieceActions.receiveMove);
    socket.on('game-state', PieceActions.receiveState);
    socket.on('game-end', PieceActions.receiveState);
    socket.on('game-history', HistoryActions.receiveHistory);
    SocketManager.join(ROOM, {id: id}, GameActions.receiveGame);
      // TODO: handle history for archived games better and replay functionality
      // if (data.history) {
      //   console.log(data.history);
      //   PieceActions.receiveState(JSON.parse(data.history.moves[0]).data);
      // }
  },

  requestMove(data) {
    socket.emit('game-move', data);
  },

  requestGameState(gameId) {
    socket.emit('game-state', gameId);
  },

  leave() {
    SocketManager.leave('game');
    socket.off('errors');
    socket.off('created-game');
    socket.off('game');
    socket.off('game-history');
    socket.off('game-init');
    socket.off('game-move');
    socket.off('game-state');
    socket.off('game-end');
  }
};

export default GameSubscription;
