import Board from '../helpers/board';

// PRIVATE

var _setTarget = function(pieceId, target, state) {
  state.grid[target[0]][target[1]] = pieceId;
};

var _clearTarget = function(target, state) {
  _setTarget(undefined, target, state);
};

var _setReserved = function(pieceId, target, state) {
  state.reserved[target[0]][target[1]] = pieceId;
};

var _clearReserved = function(target, state) {
  _setReserved(undefined, target, state);
};

var _deletePiece = function(pieceId, state) {
  var piece = Board.getPiece(pieceId, state);
  if (piece) {
    _clearTarget(piece.pos, state);
    delete state.pieces[pieceId];
  }
};

// PUBLIC

var _updatePiece = function(pieceId, newData, state) {
  var piece = Board.getPiece(pieceId, state);
  if (newData.status) {
    if (newData.status === 1) {
      if (piece.type === 4) _clearReserved(newData.pos, state); // clear reserved if knight
      _deletePiece(Board.getTarget(newData.pos, state), state); // delete piece at target
      _clearTarget(piece.pos, state); // clear current grid pos
      _setTarget(pieceId, newData.pos, state); // set new grid pos
    } else if (newData.status === -1) {
      _clearTarget(piece.pos, state);  // clear current grid pos
      _setReserved(pieceId, newData.pos, state); // set reserved
    }
  }
  Object.assign(Board.getPiece(pieceId, state), newData);
};

var State = {
  updatePiece: _updatePiece
};

export default State;
