import React from 'react';
import Piece from './piece';
import ClickHandler from './click_handler';
import PieceStore from '../../stores/piece_store';
import PieceActions from '../../actions/piece_actions';
import Display from '../../utils/display';

class Pieces extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.getState = this.getState.bind(this);
    this.style = this.style.bind(this);
    this.whiteOnBottom = this.whiteOnBottom.bind(this);
    this.isWhite = this.isWhite.bind(this);
    this.renderPieces = this.renderPieces.bind(this);
    this.renderClickHandler = this.renderClickHandler.bind(this);

    this.state = Object.assign(
      {playerStatus: this.props.playerStatus, status: this.props.status, tileSize: Display.tileSize},
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
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    PieceStore.removeChangeListener(this.getState);
    PieceActions.removeState();
  }

  handleResize() {
    this.setState({tileSize: Display.tileSize()});
  }

  getState() {
    this.setState(Object.assign(this.state, PieceStore.get()));
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

  renderPieces(pieces) {
    var pieceIds = Object.keys(pieces);
    if (pieceIds.length) {
      return pieceIds.map((pieceId) => {
        return <Piece
                  key={pieceId}
                  pieceId={pieceId}
                  data={pieces[pieceId]}
                  tileSize={this.state.tileSize}
                  whiteOnBottom={this.whiteOnBottom()} />;
      });
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
