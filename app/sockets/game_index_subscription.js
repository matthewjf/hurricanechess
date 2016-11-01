import SocketManager from './socket_manager';
import GameIndexActions from '../actions/game_index_actions';
import OnlineStatsActions from '../actions/online_stats_actions';

var _filters;

function _getIndex() {
  socket.emit('get-index', _filters);
}

const ROOM = 'index';
var GameIndexSubscription = {
  join() {
    socket.on('game', GameIndexActions.receiveGame);
    socket.on('remove', GameIndexActions.removeGame);
    socket.on('user-count', OnlineStatsActions.receiveUserCount);
    socket.on('games', GameIndexActions.receiveGames);
    SocketManager.join(ROOM, {});
  },

  getIndex(filters) {
    _filters = filters;
    socket.off("connect", _getIndex);
    socket.on("connect", _getIndex);
    _getIndex();
  },

  leave() {
    SocketManager.leave(ROOM);
    socket.off("userCount");
    socket.off("joined-index");
    socket.off("remove");
    socket.off("games");
    socket.off("game");
    socket.off("connect", _getIndex);
  }
};

export default GameIndexSubscription;
