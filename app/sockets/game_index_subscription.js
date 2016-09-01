import SocketManager from './socket_manager';
import GameIndexActions from '../actions/game_index_actions';
const ROOM = 'index';
var GameIndexSubscription = {
  join() {
    // listen to udpates
    socket.on('message', (data) => {
      console.log('message: ', data);
      GameIndexActions.receiveGame(data.game);
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
