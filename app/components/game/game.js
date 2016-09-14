import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';
import GameSubscription from '../../sockets/game_subscription';
import GameStore from '../../stores/game_store';
import PieceStore from '../../stores/piece_store';
import Board from './board';
import Pieces from './pieces';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.getGame = this.getGame.bind(this);
    this.getPieces = this.getPieces.bind(this);
    this.rejected = this.rejected.bind(this);
    this.color = this.color.bind(this);

    this.state = {
      id: this.props.params.id,
      game: GameStore.get(),
      pieces: PieceStore.get(),
      error: null,
      currentUser: this.props.currentUser
    };
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  componentDidMount() {
    this.gameListener = GameStore.addChangeListener(this.getGame);
    this.pieceListener = PieceStore.addChangeListener(this.getPieces);
    GameSubscription.join(this.state.id, null,this.rejected);
  }

  getGame() {
    this.setState({game: GameStore.get()});
  }

  getPieces() {
    this.setState({pieces: PieceStore.get()});
  }

  componentWillUnmount() {
    GameStore.removeChangeListener(this.getGame);
    PieceStore.removeChangeListener(this.getPieces);
    GameSubscription.leave();
  }

  rejected() {
    browserHistory.push('/');
    if (this.state.currentUser)
      ErrorUtil.gameRejected();
    else
      ErrorUtil.loginRequired();
  }

  openGameSettings() {
    $('#game-settings-modal').openModal();
  }

  color() {
    var game = this.state.game;
    if (game.white && game.white._id === this.state.currentUser._id)
      return 'white';
    else if (game.black && game.black._id === this.state.currentUser._id)
      return 'black';
  }

  render() {
    return (
      <section id='game' className='no-select'>
        <div className='split settings'>
          <a onClick={this.openGameSettings}
             className="waves-effect waves-light btn modal-trigger settings-btn">
            <i className="material-icons settings-icon">settings</i>
          </a>
        </div>
        <Pieces pieces={this.state.pieces} userColor={this.color()}/>
        <Board />
      </section>
    );
  }
};

export default Game;
