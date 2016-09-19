import React from 'react';
import Display from '../../utils/display';
import BoardHelper from '../../../helpers/board';
import GameSubscription from '../../sockets/game_subscription';

class ClickHandler extends React.Component {
  constructor(props) {
    super(props);
    this.getGameState = this.getGameState.bind(this);
    this.getOwnPiece = this.getOwnPiece.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.squareClass = this.squareClass.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      gameId: this.props.gameId,
      pieces: this.props.pieces,
      grid: this.props.grid,
      isWhite: this.props.isWhite,
      errors: null
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      gameId: props.gameId,
      pieces: props.pieces,
      grid: props.grid,
      isWhite: props.isWhite
    });
  }

  getGameState() {
    return {pieces: this.state.pieces, grid: this.state.grid};
  }

  getOwnPiece(pos) {
    let isWhite = this.state.isWhite;
    let pieceId = parseInt(this.state.grid[pos[0]][pos[1]]);
    if (Number.isInteger(pieceId) && ((isWhite && pieceId < 16) || (!isWhite && pieceId >= 16)))
      return pieceId;
  }

  renderGrid(classFunction) {
    let gridList = [];
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        gridList.push(
          <div
            className={classFunction([row,col])}
            key={row * 8 + col}
            data-row={row}
            data-col={col} />
        );
      }
    };
    return gridList;
  }

  renderTiles() {
    return this.renderGrid( (pos) => {
      return 'square ' + this.squareClass(pos);
    });
  }

  handleClick(e) {
    var attrs = e.target.dataset;
    var targetPos = [parseInt(attrs.row), parseInt(attrs.col)];
    var targetId = this.getOwnPiece(targetPos);
    if (Number.isInteger(targetId))
      this.setState({selected: targetId});
    else {
      if (BoardHelper.canMovePiece(this.state.selected, targetPos, this.getGameState()))
        GameSubscription.requestMove({
          gameId: this.state.gameId,
          pieceId: this.state.selected,
          pos: targetPos
        });
      this.clearSelected();
    }
  }

  clearSelected(){
    this.setState({selected: undefined});
  }

  squareClass(pos) {
    var selectedId = this.state.selected;
    if (Number.isInteger(selectedId)) {
      var piece = this.state.pieces[selectedId];
      if (piece && piece.pos[0] === pos[0] && piece.pos[1] === pos[1])
        return 'selected';
      else if (piece && BoardHelper.canMovePiece(selectedId, pos, this.getGameState()))
        return 'highlight';
    }

    return '';
  }

  style() {
    return {
      height: Display.gridSizePx,
      width: Display.gridSizePx
    };
  }

  render() {
    return (
      <div id='click-handler' onMouseDown={this.handleClick} style={this.style()}>
        {this.renderTiles()}
      </div>
    );
  }
};

export default ClickHandler;
