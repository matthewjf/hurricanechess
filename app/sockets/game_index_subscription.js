import SocketManager from './socket_manager';
import GameIndexActions from '../actions/game_index_actions';
const ROOM = 'index';
var GameIndexSubscription = {
  join() {
    socket.on('game', (data) => {
      GameIndexActions.receiveGame(data.game);
    });

    socket.on('remove', (data) => {
      GameIndexActions.removeGame(data.game);
    });

    socket.on('userCount', (count) => {
      GameIndexActions.receiveUserCount(count);
    });

    SocketManager.join(ROOM, {}, (data) => {
      GameIndexActions.receiveGames(data.games);
    });
  },

  leave() {
    SocketManager.leave(ROOM);
    socket.off("userCount");
    socket.off("joined-index");
    socket.off("remove");
    socket.off("game");
  }
};

export default GameIndexSubscription;
