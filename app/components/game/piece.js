import React from 'react';
import PieceMap from '../../utils/piece_map';
import Display from '../../utils/display';
import GameConfig from '../../../config/game';

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.style = this.style.bind(this);

    this.state = {
      id: this.props.pieceId,
      type: this.props.data.type,
      pos: this.props.data.pos,
      color: this.props.pieceId < 16 ? 'white' : 'black',
      isWhite: this.props.isWhite
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      id: props.pieceId,
      type: props.data.type,
      pos: props.data.pos,
      color: props.pieceId < 16 ? 'white' : 'black',
      isWhite: props.isWhite
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  style() {
    var scale = this.state.isWhite ? '' : 'scale(-1, -1)';
    var transition = "top "+GameConfig.speed+"ms linear, left "+GameConfig.speed+"ms linear";

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

  render() {
    return <div
              className={this.state.color + '-piece piece'}
              style={this.style()}>
            {PieceMap[this.state.type]}
           </div>;
  }
};

export default Piece;
