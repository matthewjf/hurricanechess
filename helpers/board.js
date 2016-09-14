import Piece from './piece';

// module pattern with caching is faster
// https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
var _buildGrid = function(pieces) {
  var grid = [];
  for (var i = 0; i < 8; i++) {grid.push(new Array(8));};
  for (var pieceId in pieces) {
    if (pieces[pieceId]) {
      let pos = pieces[pieceId].pos;
      grid[pos[0]][pos[1]] = pieceId;
    }
  }
  return grid;
};

var _canMovePiece = function(pieceId, target, state) {
  if (state.pieces[pieceId]) {
    var piece = new Piece(pieceId, state.pieces[pieceId], _buildGrid(state.pieces));
    if (piece.canMoveTo(target) && !piece.onDelay) return true;
  }
  return false;
};

var _getNextPos = function(pieceId, target, state) {
  if (state.pieces[pieceId]) {
    var grid = _buildGrid(state.pieces);
    let piece = new Piece(pieceId, state.pieces[pieceId], grid);
    return piece.getNextPos(target);
  }
};

var _getTarget = function(target, state) {
  for (var id = 0; id < 32; id++) {
    var pos = state.pieces[id].pos;
    if ( pos[0] === target[0] && pos[1] === target[1]) return id;
  }
};

var Board = {
  canMovePiece: _canMovePiece,
  getNextPos: _getNextPos,
  getTarget: _getTarget
};

export default Board;
