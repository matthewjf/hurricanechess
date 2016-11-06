import React from 'react';
import Pieces from '../game/pieces';
import SoloClickHandler from './click_handler';

class SoloPieces extends Pieces {
  renderClickHandler() {
    if (this.state.status === 'active' && this.state.playerStatus !== 'spectator' ) {
      return (
        <SoloClickHandler
          pieces={this.state.pieces}
          grid={this.state.grid}
          reserved={this.state.reserved}
          gameId={this.state.gameId}
          isWhite={this.isWhite()} />
      );
    } else {
      return null;
    }
  }
}

export default SoloPieces;
