import Board from '../../../helpers/board';
import PieceStore from '../../stores/piece_store';
import GameConfig from '../../../config/game';
import PieceActions from '../../actions/piece_actions';
import GameActions from '../../actions/game_actions';
import InitialPieces from '../../../helpers/initial_pieces';

var _timers = new Set();

// GAME SETUP

var _players;
function _getPlayers(color) {
  let white = color && color === 'white' ? 'You' : 'Computer';
  let black = color && color === 'white' ? 'Computer' : 'You';
  return {
    white: {username: white},
    black: {username: black}
  };
};

function _getInitialState() {
  let pieces = InitialPieces();
  return {
    gameId: 'solo',
    pieces: pieces,
    grid: Board.buildGrid(pieces),
    reserved: Board.buildGrid({})
  };
};

function _startGame() {
  GameActions.receiveGame(Object.assign({status: 'active'}, _players));
  PieceActions.receiveState(Object.assign(_getInitialState(), _players));
};

// MOVES
function _performMove(pieceId, targetPos, state) {
  var pieces = state.pieces;
  if (!pieces[pieceId]) return; // piece is not available

  var currPos = pieces[pieceId].pos;
  if (currPos[0] === targetPos[0] && currPos[1] === targetPos[1] || pieceTaken) {
    _moveEnd(pieceId, state);
    return;
  };

  var newPos = Board.getNextPos(pieceId, targetPos, state);
  if (!newPos) { // can't move to target pos
    _moveEnd(pieceId, state);
    return;
  }
  var pieceTaken = !!Board.getPiece(Board.getTarget(newPos, state), state);
  _updatePieceAndEmit(pieceId, { pos: newPos, hasMoved: 1, status: 1 });

  if (Board.isGameOver(state)) {
    _gameOver(state);
    return;
  }

  var newTarget = pieceTaken ? newPos : targetPos;

  let timer = setTimeout(() => {
    _performMove(pieceId, newTarget, state);
  }, GameConfig.speed);
  _timers.add(timer);
};

function _performKnightMove(pieceId, targetPos, state) {
  _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: -1 });

  let timer = setTimeout(() => {
    _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: 1 });

    if (Board.isGameOver(state))
      _gameOver(state);
    else
      _timers.add(setTimeout(()=>{_moveEnd(pieceId, state);}, GameConfig.speed));
  }, GameConfig.speed);
  _timers.add(timer);
};

function _performCastleMove(kingId, targetPos, state) {
  var rookRow = kingId < 16 ? 7 : 0;
  var [rookCol, rookTargetCol] = targetPos[1] === 6 ? [7, 5] : [0, 3];
  var rookTargetPos = [rookRow, rookTargetCol];
  var rookId = Board.getTarget([rookRow, rookCol], state);

  _performImmediate(kingId, targetPos, state);
  _performImmediate(rookId, rookTargetPos, state);
};

function _performImmediate(pieceId, targetPos, state) {
  _updatePieceAndEmit(pieceId, { pos: targetPos, hasMoved: 1, status: 1 });
  _timers.add(setTimeout(() => {_moveEnd(pieceId, state);}, GameConfig.speed));
};

function _moveEnd(pieceId, state) {
  if (Board.getPiece(pieceId, state)) {
    var newData = {status: 2};
    if (Board.shouldPromote(pieceId, state)) newData.type = 1;// promote
    _updatePieceAndEmit(pieceId, newData); // on delay
  }

  let timer = setTimeout(() => {              // off delay
    if (Board.getPiece(pieceId, state)) {
      _updatePieceAndEmit(pieceId, {status: 0});
    }
  }, GameConfig.delay);
  _timers.add(timer);
};

// SEND DATA
function _updatePieceAndEmit(pieceId, newData) {
  PieceActions.receiveMove({pieceId: pieceId, newData: newData});
};

function _turnOffDelay(state) {
  var pieces = state.pieces;
  if (pieces) {
    for (var i = 0; i < 32; i++) {
      if (pieces[i])
        pieces[i].status = 0;
    }
  }
};

function _gameOver(state) {
  _turnOffDelay(state);
  PieceActions.receiveState(state);
  let winner = Board.getWinner(state);
  GameActions.receiveGame(Object.assign({status: 'archived', winner: winner}, _players));
};

// PUBLIC
var SoloManager = {
  join(color='white') {
    _players = _getPlayers(color);
    GameActions.receiveGame(Object.assign({status: 'starting'}, _players));
    this.startTimeout = setTimeout(_startGame, 10 * 1000);
  },

  requestMove(data) {
    SoloManager.movePiece(data.pieceId, data.pos);
  },

  leave() {
    if (this.startTimeout) clearTimeout(this.startTimeout);
  },

  movePiece(pieceId, targetPos) {
    var state = PieceStore.get();

    if (Board.canMovePiece(pieceId, targetPos, state)) {
      var type = Board.getPiece(pieceId, state).type;
      if (type === 4)
        _performKnightMove(pieceId, targetPos, state);
      else if ( type === 0 && Board.isCastleMove(pieceId, targetPos, state))
        _performCastleMove(pieceId, targetPos, state);
      else
        _performMove(pieceId, targetPos, state);
    };
  }
};

export default SoloManager;
