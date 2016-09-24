import React from 'react';
import Piece from './piece';
import ClickHandler from './click_handler';
import PieceStore from '../../stores/piece_store';
import Display from '../../utils/display';
import PieceActions from '../../actions/piece_actions';

class Pieces extends React.Component {
  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this);
    this.renderPieces = this.renderPieces.bind(this);
    this.style = this.style.bind(this);
    this.renderClickHandler = this.renderClickHandler.bind(this);

    this.state = Object.assign(
      {isWhite: this.props.isWhite, status: this.props.status, errors: null},
      PieceStore.get()
    );
  }

  componentWillReceiveProps(props) {
    this.setState({isWhite: props.isWhite, status: props.status});
    if (this.state.status === 'archived')
      $('.timer').remove();
  }

  componentDidMount() {
    this.pieceListener = PieceStore.addChangeListener(this.getState);
  }

  componentWillUnmount() {
    PieceStore.removeChangeListener(this.getState);
    PieceActions.removeState();
  }

  getState() {
    this.setState(Object.assign(this.state, PieceStore.get()));
  }

  renderPieces(pieces) {
    var pieceIds = Object.keys(pieces);
    if (pieceIds.length) {
      return pieceIds.map((pieceId) => {
        return <Piece
                  key={pieceId}
                  pieceId={pieceId}
                  data={pieces[pieceId]}
                  isWhite={this.state.isWhite} />;
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

  renderClickHandler() {
    if (this.state.status === 'active') {
      return (
        <ClickHandler
          pieces={this.state.pieces}
          grid={this.state.grid}
          reserved={this.state.reserved}
          gameId={this.state.gameId}
          isWhite={this.state.isWhite} />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div id='pieces' style={this.style()}>
        {this.renderClickHandler()}
        {this.renderPieces(this.state.pieces)}
      </div>
    );
  }
};

export default Pieces;
