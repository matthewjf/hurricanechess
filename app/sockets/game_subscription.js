import SocketManager from './socket_manager';
import GameActions from '../actions/game_actions';

var GameSubscription = {
  create(data) {
    socket.on('created', (data) => {
      // handle reconnect
    });

    socket.emit('create', data);
  },

  join(id) {
    SocketManager.join(id);

    socket.on('init', (data) => {
      console.log("all games: ", data);
      GameIndexActions.receiveGames(data.games);
    });

    socket.on('message', (data) => {
      console.log('message: ', data);
      GameIndexActions.receiveGame(data.game);
    });
  },

  leave() {
    SocketManager.leave();
    socket.off("created");
    socket.off("joined");
  }
};

export default GameSubscription;
