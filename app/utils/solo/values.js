// type map
const typeMap = {
  0: 'king',
  1: 'queen',
  2: 'rook',
  3: 'bishop',
  4: 'knight',
  5: 'pawn'
};

const valueMap = {
  'king':   100,
  'queen':  9,
  'rook':   5,
  'bishop': 3,
  'knight': 3,
  'pawn':   1
};

export default function(piece) {
  return valueMap[typeMap[piece.type]];
};
