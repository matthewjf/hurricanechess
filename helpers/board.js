import {toCoord, toPos} from '../helpers/pos';
import Piece from './piece';

// module pattern with caching is faster
// https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
var _buildGrid = function(pieces) {
  var grid = [];
  for (var i = 0; i < 8; i++) {grid.push(new Array(8));};
  for (var pieceId in pieces) {
    if (pieces[pieceId]) {
      let coord = toCoord(pieces[pieceId].pos);
      grid[coord[0]][coord[1]] = pieceId;
    }
  }
  return grid;
};

var _canMovePiece = function(pieceId, targetId, state) {
  if (state.pieces[pieceId]) {
    var piece = new Piece(pieceId, state.pieces[pieceId], _buildGrid(state.pieces));
    if (piece.canMoveTo(toCoord(targetId)) && !piece.onDelay) return true;
  }
  return false;
};

var _getNextPos = function(pieceId, targetId, state) {
  if (state.pieces[pieceId]) {
    var grid = _buildGrid(state.pieces);
    let piece = new Piece(pieceId, state.pieces[pieceId], grid);
    return piece.getNextPos(toCoord(targetId));
  }
};

var _getTarget = function(targetId, state) {
  for (var id = 0; id < 8; id++) {
    if (state.pieces[id][0] === targetId) return id;
  }
};

var Board = {
  canMovePiece: _canMovePiece,
  getNextPos: _getNextPos,
  getTarget: _getTarget
};

export default Board;
