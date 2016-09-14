import React from 'react';
import PieceMap from '../../utils/piece_map';
const SQUARESIZE = 64;

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.style = this.style.bind(this);

    this.state = {
      id: this.props.pieceId,
      type: this.props.data.type,
      pos: this.props.data.pos,
      color: this.props.pieceId < 16 ? 'white' : 'black',
      userColor: this.props.userColor
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      id: props.pieceId,
      type: props.data.type,
      pos: props.data.pos,
      color: props.pieceId < 16 ? 'white' : 'black',
      userColor: props.userColor
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  style() {
    if (this.state.userColor === 'white') {
      var top = (SQUARESIZE * 7) - (this.state.pos[0] * SQUARESIZE);
      var left = (SQUARESIZE * 7) - (this.state.pos[1] * SQUARESIZE);
    } else {
      var top = this.state.pos[0] * SQUARESIZE;
      var left = this.state.pos[1] * SQUARESIZE;
    }

    return {
      fontSize: (SQUARESIZE * 3 / 4) + 'px',
      top: top + 'px',
      left: left + 'px',
      lineHeight: SQUARESIZE + 'px',
      heigt: SQUARESIZE + 'px',
      width: SQUARESIZE + 'px'
    };
  }

  render() {
    console.log(this.state.userColor);
    return <div
              className={this.state.color + '-piece piece'}
              style={this.style()}>
            {PieceMap[this.state.type]}
           </div>;
  }
};

export default Piece;
