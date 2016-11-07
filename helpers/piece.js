// Each piece is assigned an ID from 0-31 for redis storage
// Uses an array to list pieces and their relevant information
import moves from './moves';

// const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
// const pieceTypeId = {king: 0, queen: 1, rook: 2, bishop: 3, knight: 4, pawn: 5};

var _getMoves = function(pieceId, state, protecting=false) {
  var piece = state.pieces[pieceId];
  return moves(Object.assign(state, {piece: piece, protecting: protecting}));
};

var _getNextPos = function(pieceId, targetPos, state) {
  var piece = state.pieces[pieceId], currPos = piece.pos;
  var newPos = _getDiff(currPos, targetPos);
  if (_canMoveTo(pieceId, newPos, state)) return newPos;
};

var _canMoveTo = function(pieceId, targetPos, state) {
  var piece = state.pieces[pieceId];
  var validMoves = moves(Object.assign(state, {piece: piece}));
  for (var i = 0; i < validMoves.length; i++) {
    var curr = validMoves[i];
    if (curr[0] === targetPos[0] && curr[1] === targetPos[1]) return true;
  }
  return false;
};

var _getDiff = function(curr, target) {
  var rowDiff, colDiff;
  if (target[0] > curr[0])
    rowDiff = 1;
  else if (target[0] < curr[0])
    rowDiff = -1;
  else
    rowDiff = 0;

  if (target[1] > curr[1])
    colDiff = 1;
  else if (target[1] < curr[1])
    colDiff = -1;
  else
    colDiff = 0;

  return [curr[0] + rowDiff, curr[1] + colDiff];
};


var Piece = {
  getMoves: _getMoves,
  getNextPos: _getNextPos,
  canMoveTo: _canMoveTo
};

export default Piece;
