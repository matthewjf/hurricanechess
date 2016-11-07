import React from 'react';
import ReactDOM from 'react-dom';
import PieceMap from '../../utils/piece_map';
import GameConfig from '../../../config/game';

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.style = this.style.bind(this);
    this.renderTimer = this.renderTimer.bind(this);

    this.state = this.buildState(this.props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.buildState(props));
  }

  buildState(props) {
    return {
      id: props.pieceId,
      type: props.data.type,
      pos: props.data.pos,
      status: props.data.status,
      color: props.pieceId < 16 ? 'white' : 'black',
      tileSize: props.tileSize,
      whiteOnBottom: props.whiteOnBottom
    };
  }

  style() {
    let scale = this.state.whiteOnBottom ? '' : 'scale(-1, -1)';
    let transSpeed = 25 + (this.state.type === 4 ? GameConfig.speed * 2 : GameConfig.speed);
    let transition = `top ${transSpeed}ms linear, left ${transSpeed}ms linear`;

    return {
      fontSize: (this.state.tileSize * 4 / 5) + 'px', // css
      top: (this.state.pos[0] * this.state.tileSize) + 'px',
      left: (this.state.pos[1] * this.state.tileSize) + 'px',
      lineHeight: this.state.tileSize + 'px', // css
      height: this.state.tileSize + 'px', // css
      width: this.state.tileSize + 'px', // css
      transform: scale,
      transition: transition
    };
  }

  renderTimer() {
    let height = this.state.status === 2 ? '100%' : 0;

    return <div
      ref='timer'
      className={'timer ' + (height ? 'timer-animation' : '')}
      style={{
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
