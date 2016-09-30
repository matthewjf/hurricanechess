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
    this.whiteOnBottom = this.whiteOnBottom.bind(this);
    this.isWhite = this.isWhite.bind(this);

    this.state = Object.assign(
      {playerStatus: this.props.playerStatus, status: this.props.status},
      PieceStore.get()
    );
  }

  componentWillReceiveProps(props) {
    this.setState({playerStatus: props.playerStatus, status: props.status});
    if (this.state.status === 'archived')
      $('.timer', '#pieces').remove();
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
                  whiteOnBottom={this.whiteOnBottom()} />;
      });
    } else {
      return null;
    }
  }

  whiteOnBottom() {
    return this.state.playerStatus !== 'black';
  }

  isWhite() {
    return this.state.playerStatus === 'white';
  }

  style() {
    if (!this.whiteOnBottom())
      return {
        transform: 'scale(-1, -1)'
      };
  }

  renderClickHandler() {
    if (this.state.status === 'active' && this.state.playerStatus !== 'spectator' ) {
      return (
        <ClickHandler
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
