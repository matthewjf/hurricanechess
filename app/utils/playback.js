import PieceActions from '../actions/piece_actions';

class Playback {
  constructor(moves) {
    this.moves = this.parseMoves(moves);
    if (this.end) setTimeout(function() {PieceActions.receiveState(this.end.data);}.bind(this),0);
  }

  parseMoves(moves) {
    var parsed = [];
    for (var i in moves) {
      var move = JSON.parse(moves[i]);
      if (move.action === 'game-init') this.init = move;
      if (move.action === 'game-end') this.end = move;
      parsed.push(move);
    }
    return parsed.sort((a,b) =>{
      if (a.createdAt > b.createdAt) return 1;
      else return -1;
    });
  }

  play() {

  }

  pause() {

  }
};

export default Playback;
