import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';
import PieceActions from '../actions/piece_actions';
import {browserHistory} from 'react-router';
const ROOM = 'game';

var GameSubscription = {
  create(data, successCB, errorCB) {
    socket.on('created-game', (game) => {
      console.log("created-game: ", game);
      if (successCB)
        successCB(game);
      socket.off('created-game');
      socket.off('errors');
      browserHistory.push("games/" + game._id);
    });

    socket.on('errors', (errors) => {
      console.log('errors: ', errors);
      if (errorCB)
        errorCB(errors);
    });

    socket.emit('create-game', data);
  },

  join(id, successCB, errorCB) {
    socket.on('errors', (data) => {
      console.log("errors: ", data);
      if (errorCB)
        errorCB(errorCB);
    });

    socket.on('game', (data) => {
      console.log('game: ', data.game);
      GameActions.receiveGame(data.game);
    });

    socket.on('game-init', (data) => {
      PieceActions.receivePieces(data.pieces);
    });

    socket.on('game-move', (moveData) => {
      console.log('moveData: ', moveData);
    });

    SocketManager.join(ROOM, {id: id}, (data) => {
      GameActions.receiveGame(data.game);
      PieceActions.receivePieces(data.pieces);
      if (successCB)
        successCB(data);
    });
  },

  leave() {
    SocketManager.leave('game');
    socket.off('errors');
    socket.off('created-game');
    socket.off('game');
    socket.off('game-init');
    socket.off('game-move');
  }
};

export default GameSubscription;
