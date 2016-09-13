import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';
import GameSubscription from '../../sockets/game_subscription';
import GameStore from '../../stores/game_store';
import Board from './board';

class Pieces extends React.Component {
  constructor(props) {
    super(props);
    this.renderPieces = this.renderPieces.bind(this);

    this.state = {
      pieces: this.props.pieces,
      errors: null
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // renderPiece(pieces) {
  //   var pieceIds = Object.keys(pieces);
  //   if (pieceIds.length) {
  //     return pieceIds.map((pieceId) => {
  //       return null;
  //     });
  //   } else {
  //     return null;
  //   }
  // }

  render() {
    return (
      null
    );
  }
};

export default Pieces;
