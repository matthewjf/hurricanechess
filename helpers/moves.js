import {toCoord, toPos} from '../helpers/pos';

const moves = function(piece) {
  _validatePos(piece.pos);
  switch (piece.type){
    case 'king':
      return _kingMoves(piece);
      break;
    case 'queen':
      return _straights(piece).concat(_diagonals(piece));
      break;
    case 'rook':
      return _straights(piece);
      break;
    case 'bishop':
      return _diagonals(piece);
      break;
    case 'knight':
      return _knightMoves(piece);
      break;
    case 'pawn':
      return _pawnMoves(piece);
      break;
    default:
      throw new Error('invalid piece type');
  }
};

// PIECE MOVES
const _straights = function(piece) {
  var dirs = [[0,1], [0,-1], [1,0], [-1,0]];
  return _slidingMoves(piece, dirs);
};

const _diagonals = function(piece) {
  var dirs = [[1,1], [-1,1], [1,-1], [-1,-1]];
  return _slidingMoves(piece, dirs);
};

const _knightMoves = function(piece) {
  var dirs = [[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1]];
  return _steppingMoves(piece, dirs);
};

const _kingMoves = function(piece) {
  let dirs = [[-1,-1],[1,1],[1,-1],[-1,1],[0,1],[0,-1],[1,0],[-1,0]];
  var moves = _steppingMoves(piece, dirs);
  // TODO: add castling - need more info
  return moves;
};

const _pawnMoves = function(piece) {
  var moves = [];
  var dir = piece.color === 'white' ? 1 : -1;
  var next = [piece.pos[0] + dir, piece.pos[1]];
  if (_inRangePos(next) && !piece.grid[next[0]][next[1]]) {
    moves.push[next];
    var next2 = [next[0] + dir, next[1]];
    if (!piece.hasMoved && _inRangePos(next2) && !piece.grid[next2[0]][next2[1]])
      moves.push(next2);
  }

  var rDiag = [piece.pos[0] + dir, piece.pos[1] + 1];
  var lDiag = [piece.pos[0] + dir, piece.pos[1] - 1];

  if (_inRangePos(rDiag) && _targetPos(piece, rDiag) && _canTakeTarget(piece, rDiag))
    moves.push(rDiag);
  if (_inRangePos(lDiag) && _targetPos(piece, lDiag) && _canTakeTarget(piece, lDiag))
    moves.push(lDiag);

  return moves;
};

// MOVE HELPERS
const _slidingMoves = function(piece, dirs) {
  var moves = [];
  dirs.forEach((dir) => {
    moves.push.apply(moves, _slidingMoveDir(piece, dir));
  });
  return moves;
};

const _slidingMoveDir = function(piece, dir) {
  let newPos = [piece.pos[0] + dir[0], piece.pos[1] + dir[1]];
  var moves = [];
  while (_inRangePos(newPos)) {
    if (_targetPos(newPos)) {
      if (_canTakeTarget(piece, newPos)) moves.push(newPos);
      break;
    } else {
      moves.push(newPos);
      newPos = [newPos[0] + dir[0], newPos[1] + dir[1]];
    };
  };
  return moves;
};

const _steppingMoves = function(piece, dirs) {
  var moves = [];
  dirs.forEach((dir) => {
    let newPos = _steppingMoveDir(piece, dir);
    if (newPos) moves.push(newPos);
  });
  return moves;
};

const _steppingMoveDir = function(piece, dir) {
  var newPos = [piece.pos[0] + dir[0], piece.pos[1] + dir[1]];
  if (_canMoveTo(piece, newPos)) {
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

const _targetPos = function(piece, target) {
  let [tarRow, tarCol] = target;
  return piece.grid[tarRow][tarCol];
};

const _canTakeTarget = function(piece, target) {
  let targetId = _targetPos(piece, target);
  return targetId && _diffColor(piece.id, targetId);
};

const _diffColor = function(id1, id2) {
  if (!id1 || !id2) return true;
  return (id1 < 8 && id2 >= 8) || (id1 >= 8 && id2 < 8);
};

const _canMoveTo = function(piece, target) {
  return _inRangePos(target) && (!_targetPos(piece, target) || _canTakeTarget(piece, target));
};

export default moves;
