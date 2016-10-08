import SocketManager from './socket_manager';
import GameIndexActions from '../actions/game_index_actions';
import OnlineStatsActions from '../actions/online_stats_actions';

const ROOM = 'index';
var GameIndexSubscription = {
  join() {
    socket.on('game', GameIndexActions.receiveGame);
    socket.on('remove', GameIndexActions.removeGame);
    socket.on('user-count', OnlineStatsActions.receiveUserCount);
    SocketManager.join(ROOM, {}, GameIndexActions.receiveGames);
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
