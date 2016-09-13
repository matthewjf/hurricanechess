// Each piece is assigned an ID from 0-31 for redis storage
// Uses an array to list pieces and their relevant information
import {toCoord, toPos} from '../helpers/pos';
import moves from './moves';

const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
const pieceTypeId = {king: 0, queen: 1, rook: 2, bishop: 3, knight: 4, pawn: 5};

class Piece {
  constructor(id, data, grid) {
    this.id = id;
    this.pos = toCoord(data.pos);
    this.type = pieceTypes[data.type];
    this.hasMoved = data.hasMoved;
    this.color = (id < 16 ? 'white' : 'black');
    this.grid = grid;
  }

  getNextPos(endPos) {
    let currPos = this.pos;
    if (this.type === 'knight' && this.canMoveTo(endPos)) { // handle knight move
      return endPos;
    // handle castling
    // } else if (this.type === 'king' && isCastleMove(endPos)) { 
    //   return;
    // handle pawn promotion
    // } else if (this.type === 'pawn' && endPos ) {
    //   return;
    } else { // normal move
      let rowDelta = endPos[0] - currPos[0];
      let colDelta = endPos[1] - currPos[1];
      let newPos = [this.pos[0] + rowDelta, this.pos[1] + colDelta];
      if (this.canMoveTo(newPos)) {
        return newPos;
      }
    }
    return false;
  }

  canMoveTo(pos) {
    var validMoves = moves(this);
    for (var i = 0; i < validMoves.length; i++) {
      var curr = validMoves[i];
      if (curr[0] === pos[0] && curr[1] === pos[1]) return true;
    }
    return false;
  }

  _isCastleMove(endPos) {

  }
}

export default Piece;
