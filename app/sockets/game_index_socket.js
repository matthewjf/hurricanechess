import Subscribe from '../utils/subscribe';

var GameIndexSocket = {
  subscribe() {
    Subscribe("GameIndex");
  }
};

export default GameIndexSocket;
