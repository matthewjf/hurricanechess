// {id: 0, pos: [7,0], type: 2, hasMoved: 0, onDelay: 0}
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
  // TODO: add castling
  return moves;
};

const _pawnMoves = function(data) {
  var moves = [], piece = data.piece;
  var dir = piece.id < 16 ? -1 : 1;
  var next = [piece.pos[0] + dir, piece.pos[1]];
  if (_inRangePos(next) && !data.grid[next[0]][next[1]]) {
    moves.push(next);

    var next2 = [next[0] + dir, next[1]];
    if (!piece.hasMoved && _inRangePos(next2) && !data.grid[next2[0]][next2[1]])
      moves.push(next2);
  }

  var rDiag = [piece.pos[0] + dir, piece.pos[1] + 1];
  var lDiag = [piece.pos[0] + dir, piece.pos[1] - 1];

  if (_inRangePos(rDiag) && _targetPos(rDiag, data.grid) && _canTakeTarget(piece, rDiag, data.grid))
    moves.push(rDiag);
  if (_inRangePos(lDiag) && _targetPos(lDiag, data.grid) && _canTakeTarget(piece, lDiag, data.grid))
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
    if (_targetPos(newPos, data.grid)) {
      if (_canTakeTarget(piece, newPos, data.grid)) moves.push(newPos);
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
  if (_canMoveTo(data, newPos)) {
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

const _targetPos = function(target, grid) {
  let [tarRow, tarCol] = target;
  return grid[tarRow][tarCol];
};

const _canTakeTarget = function(piece, target, grid) {
  let targetId = _targetPos(target, grid);
  return targetId && _diffColor(piece.id, targetId);
};

const _diffColor = function(id1, id2) {
  if (!Number.isInteger(id1) || !Number.isInteger(id2)) return true;
  return (id1 < 16 && id2 >= 16) || (id1 >= 16 && id2 < 16);
};

const _canMoveTo = function(data, target) {
  return _inRangePos(target) && (
    !_targetPos(target, data.grid) ||
    _canTakeTarget(data.piece, target, data.grid));
};

export default moves;
