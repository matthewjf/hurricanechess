import GameConfig from '../../../config/game';
import Board from '../../../helpers/board';
import Piece from '../../../helpers/piece';
import PieceStore from '../../stores/piece_store';
import SoloManager from './manager';
import value from './values';

class Computer {
  constructor(color) {
    this.speed = 2000;
    this.color = color;
    this.state = {};
  }
  // PUBLIC

  start() {
    this.state = PieceStore.get();
    PieceStore.addChangeListener(this.getState.bind(this));
    this.moveInterval = setInterval(function() {
      this.setMoves();
      this.protectKing();
      this.makeMove();
    }.bind(this), this.speed);
  }

  end() {
    PieceStore.removeChangeListener(this.getState);
    if (this.moveInterval) clearInterval(this.moveInterval);
  }

  getState() {
    this.state = PieceStore.get();
  }

  // PRIVATE

  // helpers
  pieces() {
    if (this.state) return this.state.pieces;
  }

  grid() {
    if (this.state) return this.state.grid;
  }

  isOwnPiece(id) {
    return (this.color === 'white' && id < 16) || (this.color === 'black' && id > 15);
  }

  setMoves() {
    this.moves = {}; this.targets = [];
    for (var i = 0; i < 8; i++) {
      var col = [];
      for (var j = 0; j < 8; j++) col.push(new Array());
      this.targets.push(col);
    };

    var pieces = this.pieces();
    for (var pieceId in pieces) {
      var availMoves = Piece.getMoves(pieceId, this.state);
      var piece = pieces[pieceId];
      if (piece && piece.status === 0) this.moves[pieceId] = availMoves;
      availMoves.forEach(function(move) {
        this.targets[move[0]][move[1]].push(pieceId);
      }.bind(this));
    }
  }

  isSafe(pos) {
    var pieceIds = this.targets[pos[0]][pos[1]];
    return pieceIds.length === 0 || pieceIds.every(function(id) {
      return this.isOwnPiece(id);
    }.bind(this));
  }

  isProtected(pos) {
    var pieceIds = this.targets[pos[0]][pos[1]];
    return pieceIds.length === 0 || pieceIds.some(function(id) {
      return this.isOwnPiece(id);
    }.bind(this));
  }

  piecesCanTake(pos) {
    return this.targets[pos[0]][pos[1]].filter(function(id) {
      return this.isOwnPiece(id);
    }.bind(this));
  }

  // piece logic
  makeMove() {
    var move = this.findMove();
    if (move) this.performMove(move);
  }

  findMove() {
    var move;
    var maxValue = 0;
    var moves = this.moves;
    for (var pieceId in moves) {
      if (this.isOwnPiece(pieceId) && pieceId != this.getKing().id) {
        var pieceMoves = moves[pieceId];
        for (var i = 0; i < pieceMoves.length; i++) {
          var target = pieceMoves[i];
          if (target) {
            var moveValue = this.moveValue(pieceId, target);
            if (moveValue > maxValue) {
              move = {id: pieceId, target: target};
              maxValue = moveValue;
            }
          }
        }
      }
    }

    return move;
  }

  moveValue(pieceId, target) {
    var net = 0;
    if (!this.isSafe(target)) {
      net -= value(this.pieces()[pieceId]);
      if (this.isProtected(target)) net += 1;
    };

    var tarId = this.grid()[target[0]][target[1]];
    if (tarId) net += value(this.pieces()[tarId]);

    var colVal = (3.5 - Math.abs(3.5 - target[1])) / 30;
    net += colVal;

    if (Math.random() < 0.1)
      net += this.color === 'white' ? ((7 - target[0]) / 70) : (target[0] / 70);

    return net;
  }

  // king logic
  protectKing() {
    var king = this.getKing();
    var threats = this.kingThreats();
    var safePos = this.kingSafePos();

    if (threats && threats.length > 0) {
      var protectingMoves = this.takeKingThreats(threats);
      if (protectingMoves && protectingMoves.length > 0)
        this.performMoves(protectingMoves);
      else if (king.status === 0 && safePos)
        this.performMove({id: king.id, target: safePos});
    }
  }

  getKing() {
    return this.isOwnPiece(4) ? this.pieces()[4] : this.pieces()[28];
  }

  kingThreats() {
    var kingPos = this.getKing().pos;
    return this.targets[kingPos[0]][kingPos[1]];
  }

  kingSafePos() {
    var kingMoves = this.moves[this.getKing().id];
    if (kingMoves)
      for (var i = 0; i < kingMoves.length; i++) {
        if (this.isSafe(kingMoves[i])) return kingMoves[i];
      }
  }

  takeKingThreats(threats) {
    var takingIds = new Set();
    var moves = [];
    for (var i = 0; i < threats.length; i++) {
      var threat = this.pieces()[threats[i]];
      var takingPieces = this.piecesCanTake(threat.pos);
      if (takingPieces && takingPieces.length > 0) {
        for (var j = 0; j < takingPieces.length; j++) {
          if (parseInt(j) === parseInt(this.getKing().id)) continue;
          if (takingIds.has(takingPieces[j])) continue;
          takingIds.add(takingPieces[j]);
          moves.push({id: takingPieces[j], target: threat.pos});
          break;
        }
      };
    }
    return moves;
  }

  // moves
  performMove(move) {
    SoloManager.movePiece(move.id, move.target);
  }

  performMoves(moves) {
    for (var id in moves) this.performMove(moves[id]);
  }
}

export default Computer;
