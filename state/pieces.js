// Each piece is assigned an ID from 0-31 for redis storage
// Uses an array to list pieces and their relevant information

const pieceTypes = ['king', 'queen', 'rook', 'bishop', ''];
class Piece {
  constructor(storedData) {
    this.id = storedData;
  }
}
var pieces = {
  color(id) {
    if (id < 0 || id > 31)
      throw new Error('tried to get color of '+id+', not a valid piece id');
    else
      return (id < 16 ? 'white' : 'black');
  },

  type(id) {

  }
};
