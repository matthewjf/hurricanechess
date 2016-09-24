import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';
import GameSubscription from '../../sockets/game_subscription';
import GameStore from '../../stores/game_store';
import Board from './board';
import Pieces from './pieces';
import Overlay from './overlay';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.getGame = this.getGame.bind(this);
    this.rejected = this.rejected.bind(this);
    this.isWhite = this.isWhite.bind(this);
    this.getStatus = this.getStatus.bind(this);

    this.state = {
      gameId: this.props.params.id,
      game: GameStore.get(),
      error: null,
      currentUser: this.props.currentUser
    };
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  componentDidMount() {
    this.gameListener = GameStore.addChangeListener(this.getGame);
    GameSubscription.join(this.state.gameId, null,this.rejected);
  }

  getGame() {
    this.setState({game: GameStore.get()});
  }

  componentWillUnmount() {
    GameStore.removeChangeListener(this.getGame);
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

  isWhite() {
    var game = this.state.game;
    if (game.white && game.white._id === this.state.currentUser._id)
      return true;
    else
      return false;
  }

  getStatus() {
    if (this.state.game) return this.state.game.status;
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
        <Overlay status={this.getStatus()} />
        <Pieces status={this.getStatus()} isWhite={this.isWhite()} />
        <Board />
      </section>
    );
  }
};

export default Game;
