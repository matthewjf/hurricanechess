import Join from '../utils/join';
import GameIndexActions from '../actions/game_index_actions';

var GameIndexSocket = {
  join() {
    Join("index");

    socket.on('allGames', (data) => {
      console.log("all games: ", data);
      GameIndexActions.receiveGames(data.games);
    });
  }
};

export default GameIndexSocket;
