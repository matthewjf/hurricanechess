import React from 'react';
import Display from '../../utils/display';
import BoardHelper from '../../../helpers/board';
import PieceStore from '../../stores/piece_store';
import GameSubscription from '../../sockets/game_subscription';

class ClickHandler extends React.Component {
  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this);
    this.getOwnPiece = this.getOwnPiece.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.squareClass = this.squareClass.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.isInValidMoves = this.isInValidMoves.bind(this);

    this.state = Object.assign(
      {isWhite: this.props.isWhite, validMoves: []},
      PieceStore.get());
  }

  // LIFE CYCLE

  componentWillReceiveProps(props) {
    this.setState({
      isWhite: props.isWhite
    });
  }

  componentDidMount() {
    this.pieceListener = PieceStore.addChangeListener(this.getState);
  }

  componentWillUnmount() {
    PieceStore.removeChangeListener(this.getState);
  }

  // STATE & LOGIC

  getState() {
    this.setState(Object.assign(this.state, PieceStore.get()));
  }

  getOwnPiece(pos) {
    let isWhite = this.state.isWhite;
    let pieceId = parseInt(this.state.grid[pos[0]][pos[1]]);
    if (Number.isInteger(pieceId) && ((isWhite && pieceId < 16) || (!isWhite && pieceId >= 16)))
      return pieceId;
  }

  clearSelected(){
    this.setState({selected: undefined, validMoves: []});
  }

  isInValidMoves(pos) {
    for (var i = 0; i < this.state.validMoves.length; i++) {
      var curr = this.state.validMoves[i];
      if (curr[0] === pos[0] && curr[1] === pos[1]) return true;
    }
    return false;
  }

  // EVENTS

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
      if (this.isInValidMoves(targetPos))
        GameSubscription.requestMove({
          gameId: this.state.gameId,
          pieceId: this.state.selected,
          pos: targetPos
        });
      this.clearSelected();
    }
  }

  // STYLES

  squareClass(pos) {
    var selectedId = this.state.selected;
    if (Number.isInteger(selectedId)) {
      var piece = this.state.pieces[selectedId];
      if (piece && piece.pos[0] === pos[0] && piece.pos[1] === pos[1])
        return 'selected';
      else if (this.isInValidMoves(pos))
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

  // RENDER

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

  render() {
    return (
      <div id='click-handler' onMouseDown={this.handleClick} style={this.style()}>
        {this.renderTiles()}
      </div>
    );
  }
};

export default ClickHandler;
