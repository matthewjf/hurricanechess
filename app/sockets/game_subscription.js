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
      socket.off('created');
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

    socket.on('message', (data) => {
      console.log('message: ', data);
      GameIndexActions.receiveGame(data.game);
    });

    SocketManager.join(ROOM, {id: id}, (data) => {
      console.log('joined: ', data);
      if (successCB)
        successCB(data);
    });
  },

  leave() {
    SocketManager.leave('game');
    socket.off("errors");
    socket.off("created");
    socket.off("joined");
  }
};

export default GameSubscription;
