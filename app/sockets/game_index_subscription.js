import SocketManager from './socket_manager';
import GameIndexActions from '../actions/game_index_actions';
const ROOM = 'index';
var GameIndexSubscription = {
  join() {
    // listen to udpates
    socket.on('game', (data) => {
      console.log('receive game: ', data);
      GameIndexActions.receiveGame(data.game);
    });

    socket.on('remove', (data) => {
      console.log('remove-game: ', data);
      GameIndexActions.removeGame(data.game);
    });

    SocketManager.join(ROOM, {}, (data) => {
      GameIndexActions.receiveGames(data.games);
    });
  },

  leave() {
    SocketManager.leave(ROOM);
    socket.off("joined-index");
    socket.off("message");
  }
};

export default GameIndexSubscription;
