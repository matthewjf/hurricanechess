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

var _canMovePiece = function(pieceId, target, state) {
  var grid = state.grid, pieces = state.pieces, piece = pieces[pieceId];
  if (piece) {
    if (Piece.canMoveTo(pieceId, target, state) && !piece.onDelay) return true;
  }
  return false;
};

var _getNextPos = function(pieceId, target, state) {
  var grid = state.grid, pieces = state.pieces;
  if (pieces[pieceId]) {
    return Piece.getNextPos(pieceId, target, state);
  }
};

var _getTarget = function(target, state) {
  for (var id = 0; id < 32; id++) {
    var pos = state.pieces[id].pos;
    if ( pos[0] === target[0] && pos[1] === target[1]) return id;
  }
};

var Board = {
  buildGrid: _buildGrid,
  canMovePiece: _canMovePiece,
  getNextPos: _getNextPos,
  getTarget: _getTarget
};

export default Board;
