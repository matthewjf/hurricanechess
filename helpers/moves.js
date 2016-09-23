// {id: 0, pos: [7,0], type: 2, hasMoved: 0, status: 0}
// const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
// const pieceTypeId = {king: 0, queen: 1, rook: 2, bishop: 3, knight: 4, pawn: 5};

const moves = function(data) {
  _validatePos(data.piece.pos);
  switch (data.piece.type){
    case 0: // king
      return _kingMoves(data);
      break;
    case 1: // queen
      return _straights(data).concat(_diagonals(data));
      break;
    case 2: // rook
      return _straights(data);
      break;
    case 3: // bishop
      return _diagonals(data);
      break;
    case 4: // knight
      return _knightMoves(data);
      break;
    case 5: // pawn
      return _pawnMoves(data);
      break;
    default:
      throw new Error('invalid piece type');
  }
};

// PIECE MOVES
const _straights = function(data) {
  var dirs = [[0,1], [0,-1], [1,0], [-1,0]];
  return _slidingMoves(data, dirs);
};

const _diagonals = function(data) {
  var dirs = [[1,1], [-1,1], [1,-1], [-1,-1]];
  return _slidingMoves(data, dirs);
};

const _knightMoves = function(data) {
  var dirs = [[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1]];
  return _steppingMoves(data, dirs);
};

const _kingMoves = function(data) {
  let dirs = [[-1,-1],[1,1],[1,-1],[-1,1],[0,1],[0,-1],[1,0],[-1,0]];
  var moves = _steppingMoves(data, dirs);
  var piece = data.piece;
  // castling
  if (!piece.hasMoved) {
    if (piece.id < 16)
      var row = 7, lRook = data.pieces[0], rRook = data.pieces[7];
    else
      var row = 0, lRook = data.pieces[24], rRook = data.pieces[31];
    if (lRook && !lRook.status && !lRook.hasMoved &&
        !(_targetPos([row,1], data) || _targetPos([row,2], data) || _targetPos([row,3], data)
          || _ownReserved(piece,[row,1],data) || _ownReserved(piece,[row,2],data) || _ownReserved(piece,[row,3],data)))
      moves.push([row,2]);
    if (rRook && !rRook.status && !rRook.hasMoved &&
        !(_targetPos([row,5], data) || _targetPos([row,6], data)
          || _ownReserved(piece,[row,5],data) || _ownReserved(piece,[row,6],data) ))
      moves.push([row,6]);
  }
  return moves;
};

const _pawnMoves = function(data) {
  var moves = [], piece = data.piece;
  var dir = piece.id < 16 ? -1 : 1;
  var next = [piece.pos[0] + dir, piece.pos[1]];
  if (_inRangePos(next) && !_targetPos(next, data) && !_ownReserved(piece, next, data)) {
    moves.push(next);

    var next2 = [next[0] + dir, next[1]];
    if (!piece.hasMoved && _inRangePos(next2) && !_targetPos(next2, data) && !_ownReserved(piece, next2, data))
      moves.push(next2);
  }

  var rDiag = [piece.pos[0] + dir, piece.pos[1] + 1];
  var lDiag = [piece.pos[0] + dir, piece.pos[1] - 1];

  if (_inRangePos(rDiag) && _targetPos(rDiag, data) && _canTakeTarget(piece, rDiag, data) && !_ownReserved(piece, rDiag, data))
    moves.push(rDiag);
  if (_inRangePos(lDiag) && _targetPos(lDiag, data) && _canTakeTarget(piece, lDiag, data) && !_ownReserved(piece, lDiag, data))
    moves.push(lDiag);

  return moves;
};

// MOVE HELPERS
const _slidingMoves = function(data, dirs) {
  var moves = [];
  dirs.forEach((dir) => {
    moves.push.apply(moves, _slidingMovesDir(data, dir));
  });
  return moves;
};

const _slidingMovesDir = function(data, dir) {
  var piece = data.piece;
  var newPos = [piece.pos[0] + dir[0], piece.pos[1] + dir[1]];
  var moves = [];
  while (_inRangePos(newPos)) {
    if (_ownReserved(piece, newPos, data)) {
      break;
    } else if (_targetPos(newPos, data)) {
      if (_canTakeTarget(piece, newPos, data)) moves.push(newPos);
      break;
    } else {
      moves.push(newPos);
      newPos = [newPos[0] + dir[0], newPos[1] + dir[1]];
    };
  };
  return moves;
};

const _steppingMoves = function(data, dirs) {
  var moves = [];
  dirs.forEach((dir) => {
    let newPos = _steppingMovesDir(data, dir);
    if (newPos) moves.push(newPos);
  });
  return moves;
};

const _steppingMovesDir = function(data, dir) {
  var piece = data.piece;
  var newPos = [piece.pos[0] + dir[0], piece.pos[1] + dir[1]];
  if (_canMoveTo(data, newPos) && !_ownReserved(piece, newPos, data)) {
    return newPos;
  };
};

// POS HELPERS
const _validatePos = function(pos) {
  if (!_inRangePos(pos)) throw new Error('invalid piece position');
};

const _inRangeNum = function(num) {
  return (num >= 0 && num < 8);
};

const _inRangePos = function(pos) {
  return (_inRangeNum(pos[0]) && _inRangeNum(pos[1]));
};

const _targetPos = function(target, state) {
  let [tarRow, tarCol] = target;
  return state.grid[tarRow][tarCol];
};

const _canTakeTarget = function(piece, target, state) {
  let targetId = _targetPos(target, state);
  return !targetId || _diffColor(piece.id, targetId);
};

const _reservedPos = function(target, state) {
  let [tarRow, tarCol] = target;
  return state.reserved[tarRow][tarCol];
};

const _ownReserved = function(piece, target, state) {
  let reservedId = state.reserved[target[0]][target[1]];
  return reservedId && _sameColor(piece.id, reservedId);
};

const _diffColor = function(id1, id2) {
  if (!Number.isInteger(id1) || !Number.isInteger(id2)) return true;
  return (id1 < 16 && id2 >= 16) || (id1 >= 16 && id2 < 16);
};

const _sameColor = function(id1, id2) {
  return !_diffColor(id1, id2);
};

const _canMoveTo = function(data, target) {
  return _inRangePos(target) && (
    !_targetPos(target, data) ||
    _canTakeTarget(data.piece, target, data));
};

export default moves;
