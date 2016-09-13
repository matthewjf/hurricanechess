import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';
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
      console.log('game: ', data);
      GameActions.receiveGame(data);
    });

    socket.on('game-init', (data) => {
      console.log('state: ', data);
      GameActions.receiveState(data);
    });

    socket.on('game-move', (moveData) => {
      console.log('moveData: ', moveData);
    });

    SocketManager.join(ROOM, {id: id}, (data) => {
      GameActions.receiveGameState(data);
      if (successCB)
        successCB(data);
    });
  },

  leave() {
    SocketManager.leave('game');
    socket.off("errors");
    socket.off("created-game");
    socket.off("game");
  }
};

export default GameSubscription;
