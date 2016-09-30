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
    this.runTimer = this.runTimer.bind(this);

    this.state = this.buildState(this.props);
  }

  componentWillReceiveProps(props) {
    if (this.state.status !== 2 && props.data.status === 2) this.runTimer();
    this.setState(this.buildState(props));
  }

  buildState(props) {
    return {
      id: props.pieceId,
      type: props.data.type,
      pos: props.data.pos,
      status: props.data.status,
      color: props.pieceId < 16 ? 'white' : 'black',
      whiteOnBottom: props.whiteOnBottom
    };
  }

  style() {
    var scale = this.state.whiteOnBottom ? '' : 'scale(-1, -1)';
    var transSpeed = this.state.type === 4 ? GameConfig.speed * 2 : GameConfig.speed;
    var transition = "top "+transSpeed+"ms linear, left "+transSpeed+"ms linear";

    return {
      fontSize: (Display.tileSize * 4 / 5) + 'px',
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
    return <div
      ref='timer'
      className='timer'
      style={{
        width: Display.tileSizePx,
      }} />;
  }

  runTimer() {
    $(this.refs.timer)
      .velocity({height: Display.tileSizePx, marginTop: 0}, {duration: 0})
      .velocity({height: 0, marginTop: Display.tileSizePx}, {duration: GameConfig.delay, easing: 'linear'});
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
