import React from 'react';
import Piece from './piece';

class Pieces extends React.Component {
  constructor(props) {
    super(props);
    this.renderPieces = this.renderPieces.bind(this);

    this.state = {
      pieces: this.props.pieces,
      userColor: this.props.userColor,
      errors: null
    };
  }

  componentWillReceiveProps(props) {
    var newState = {};
    if (props.pieces) newState.pieces = props.pieces;
    if (props.userColor) newState.userColor = props.userColor;
    this.setState(newState);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  renderPieces(pieces) {
    var pieceIds = Object.keys(pieces);
    if (pieceIds.length) {
      return pieceIds.map((pieceId) => {
        return <Piece
                  key={pieceId}
                  pieceId={pieceId}
                  data={pieces[pieceId]}
                  userColor={this.state.userColor}/>;
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div id='pieces'>
        {this.renderPieces(this.state.pieces)}
      </div>
    );
  }
};

export default Pieces;
