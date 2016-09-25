import React from 'react';
import ReactDOM from 'react-dom';
import PieceMap from '../../utils/piece_map';
import Display from '../../utils/display';
import GameConfig from '../../../config/game';

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.style = this.style.bind(this);
    this.renderTimer = this.renderTimer.bind(this);

    this.state = {
      id: this.props.pieceId,
      type: this.props.data.type,
      pos: this.props.data.pos,
      status: this.props.data.status,
      color: this.props.pieceId < 16 ? 'white' : 'black',
      isWhite: this.props.isWhite
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      id: props.pieceId,
      type: props.data.type,
      pos: props.data.pos,
      status: props.data.status,
      color: props.pieceId < 16 ? 'white' : 'black',
      isWhite: props.isWhite
    });
  }

  style() {
    var scale = this.state.isWhite ? '' : 'scale(-1, -1)';
    var transSpeed = this.state.type === 4 ? GameConfig.speed * 2 : GameConfig.speed;
    var transition = "top "+transSpeed+"ms linear, left "+transSpeed+"ms linear";

    return {
      fontSize: (Display.tileSize * 3 / 4) + 'px',
      top: (this.state.pos[0] * Display.tileSize) + 'px',
      left: (this.state.pos[1] * Display.tileSize) + 'px',
      lineHeight: Display.tileSizePx,
      heigt: Display.tileSizePx,
      width: Display.tileSizePx,
      transform: scale,
      transition: transition
    };
  }

  renderTimer() {
    let height = this.state.status === 2 ? Display.tileSizePx : 0;

    return <div
      ref='timer'
      className={'timer ' + (height ? 'timer-animation' : '')}
      style={{
        width: Display.tileSizePx,
        height: height,
        animationDuration: GameConfig.delay + 'ms'
      }} />;
  }

  render() {
    return <div
              className={this.state.color + '-piece piece-wrapper'}
              style={this.style()}>
              <div className='piece'>{PieceMap[this.state.type]}</div>
              {this.renderTimer()}
            </div>;
  }
};

export default Piece;
