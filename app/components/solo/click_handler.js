import React from 'react';
import ClickHandler from '../game/click_handler';
import BoardHelper from '../../../helpers/board';
import SoloManager from '../../utils/solo/manager';
import PieceStore from '../../stores/piece_store';

class SoloClickHandler extends ClickHandler {

  handleClick(e) {
    var attrs = e.target.dataset;
    var targetPos = [parseInt(attrs.row), parseInt(attrs.col)];
    var targetId = this.getOwnPiece(targetPos);
    if (Number.isInteger(targetId))
      this.setState({
        selected: targetId,
        validMoves: BoardHelper.getMoves(targetId, this.state)
      });
    else {
      if (this.isValidMove(targetPos))
        SoloManager.requestMove({
          pieceId: this.state.selected,
          pos: targetPos
        });
      this.clearSelected();
    }
  }
}

export default SoloClickHandler;
