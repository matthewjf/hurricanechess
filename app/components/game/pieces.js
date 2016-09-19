import React from 'react';
import Piece from './piece';
import ClickHandler from './click_handler';
import PieceStore from '../../stores/piece_store';
import Display from '../../utils/display';

class Pieces extends React.Component {
  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this);
    this.renderPieces = this.renderPieces.bind(this);
    this.style = this.style.bind(this);

    this.state = {
      gameId: this.props.gameId,
      isWhite: this.props.isWhite,
      pieces: PieceStore.get().pieces,
      grid: PieceStore.get().grid,
      errors: null
    };
  }

  componentWillReceiveProps(props) {
    this.setState({isWhite: props.isWhite, gameId: props.gameId});
  }

  componentDidMount() {
    this.pieceListener = PieceStore.addChangeListener(this.getState);
  }

  componentWillUnmount() {
    PieceStore.removeChangeListener(this.getState);
  }

  getState() {
    var state = PieceStore.get();
    this.setState({pieces: state.pieces, grid: state.grid});
  }

  renderPieces(pieces) {
    var pieceIds = Object.keys(pieces);
    if (pieceIds.length) {
      return pieceIds.map((pieceId) => {
        return <Piece
                  key={pieceId}
                  pieceId={pieceId}
                  data={pieces[pieceId]}
                  isWhite={this.state.isWhite}/>;
      });
    } else {
      return null;
    }
  }

  style() {
    if (!this.state.isWhite)
      return {
        transform: 'scale(-1, -1)',
        top: Display.gridSizePx
      };
  }

  render() {
    return (
      <div id='pieces' style={this.style()}>
        <ClickHandler
          pieces={this.state.pieces} 
          grid={this.state.grid}
          isWhite={this.state.isWhite}
          gameId={this.state.gameId} />
        {this.renderPieces(this.state.pieces)}
      </div>
    );
  }
};

export default Pieces;
