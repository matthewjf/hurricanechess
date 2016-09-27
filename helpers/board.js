import Piece from './piece';

// module pattern with caching is faster
// https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
var _buildGrid = function(pieces) {
  var grid = [];
  for (var i = 0; i < 8; i++) {grid.push(new Array(8));};
  for (var pieceId in pieces) {
    if (pieces[pieceId]) {
      let pos = pieces[pieceId].pos;
      grid[pos[0]][pos[1]] = parseInt(pieceId);
    }
  }
  return grid;
};

var _getMoves = function(pieceId, state) {
  var pieces = state.pieces, piece = pieces[pieceId];
  if (piece && piece.status === 0) {
    return Piece.getMoves(pieceId, state);
  }
  return [];
};

var _canMovePiece = function(pieceId, target, state) {
  var pieces = state.pieces, piece = pieces[pieceId];
  if (piece) {
    if (Piece.canMoveTo(pieceId, target, state) && piece.status === 0) return true;
  }
  return false;
};

var _getNextPos = function(pieceId, target, state) {
  var pieces = state.pieces;
  if (pieces[pieceId]) {
    return Piece.getNextPos(pieceId, target, state);
  }
};

var _getTarget = function(target, state) {
  return state.grid[target[0]][target[1]];
};

var _isCastleMove = function(pieceId, targetPos, state) {
  var piece = state.pieces[pieceId];
  var row = piece.id < 16 ? 7 : 0;
  var lCol = 2, rCol = 6;
  return targetPos[0] === row && (targetPos[1] === rCol || targetPos[1] === lCol);
};

var _shouldPromote = function(pieceId, state) {
  let piece = state.pieces[pieceId];
  let promoteRow = pieceId < 16 ? 0 : 7;
  return piece && piece.type === 5 && piece.pos[0] === promoteRow;
};

var _isGameOver = function(state) {
  return !state.pieces[28] || !state.pieces[4];
};

var _getWinner = function(state) {
  if (!state.pieces) return 'draw';

  if (!state.pieces[28] && !state.pieces[4])
    return 'draw';
  else if (!state.pieces[28])
    return 'white';
  else if (!state.pieces[4])
    return 'black';
  else
    return 'draw';
};

var Board = {
  buildGrid: _buildGrid,
  getMoves: _getMoves,
  canMovePiece: _canMovePiece,
  getNextPos: _getNextPos,
  getTarget: _getTarget,
  isCastleMove: _isCastleMove,
  shouldPromote: _shouldPromote,
  getWinner: _getWinner,
  isGameOver: _isGameOver
};

export default Board;
