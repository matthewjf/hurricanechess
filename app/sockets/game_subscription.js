import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';
import PieceActions from '../actions/piece_actions';
import {browserHistory} from 'react-router';
const ROOM = 'game';

var GameSubscription = {
  create(data, successCB, errorCB) {
    socket.on('created-game', (game) => {
      if (successCB)
        successCB(game);
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

  join(id, successCB, errorCB) {
    socket.on('errors', (data) => {
      if (errorCB)
        errorCB(data);
    });

    socket.on('game', (data) => {
      GameActions.receiveGame(data.game);
    });

    socket.on('state-init', PieceActions.receiveState);

    socket.on('game-move', PieceActions.receiveMove);

    socket.on('game-data', PieceActions.receiveState);

    SocketManager.join(ROOM, {id: id}, (data) => {
      GameActions.receiveGame(data.game);
      PieceActions.receiveState(data.state);
      if (successCB)
        successCB(data);
    });
  },

  requestMove(data) {
    socket.emit('game-move', data);
  },

  requestGameData(gameId) {
    socket.emit('game-data', gameId);
  },

  leave() {
    SocketManager.leave('game');
    socket.off('errors');
    socket.off('created-game');
    socket.off('game');
    socket.off('game-init');
    socket.off('game-move');
    socket.off('game-data');
  }
};

export default GameSubscription;
