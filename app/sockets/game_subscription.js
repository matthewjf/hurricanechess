import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';

// created, joined, update

var GameSubscription = {
  create(data) {
    socket.on('created', (data) => {
      console.log("created: ", data);
    });

    socket.on("joined", (data) => {
      console.log('joined: ', data);
    });

    socket.on('errors', (data) => {
      console.log('errors: ', data);
    });

    socket.emit('create', data);
  },

  join(id) {
    socket.on('errors', (data) => {
      console.log("errors: ", data);
    });

    socket.on('message', (data) => {
      console.log('message: ', data);
      GameIndexActions.receiveGame(data.game);
    });

    SocketManager.join(id);
  },

  leave() {
    SocketManager.leave();
    socket.off("errors");
    socket.off("created");
    socket.off("joined");
  }
};

export default GameSubscription;
