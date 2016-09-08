// Each piece is assigned an ID from 0-31 for redis storage
// Uses an array to list pieces and their relevant information
import {toCoord, toPos} from '../helpers/pos';

const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
const pieceId = {king: 0, queen: 1, rook: 2, bishop: 3, knight: 4, pawn: 5};

// module pattern with caching is faster
// https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/

class Piece {
  constructor(id, data) {
    this.id = id;
    this.pos = toCoord(data[0]);
    this.type = pieceTypes[data[1]];
    this.hasMoved = !!data[2];
  }

  move(pos) {
    this.pos = pos;
    return pos;
  }

  promote(type) {
    if (this.type === 'pawn' && pieceId[type]) {
      this.type = type;
      return true;
    } else {
      return new RangeError(type + ' is not a valid piece type');
    }
  }

  data() {
    let pieceData = [toPos(this.pos), pieceId[this.type]];
    if (this.hasMoved) this.pieceData[2] = 1;
    return pieceData;
  }

  toJSON() {
    return this;
  }

  pos() {
    return toPos(this.pos);
  }
}

export default Piece;
