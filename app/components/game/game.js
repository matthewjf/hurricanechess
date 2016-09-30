import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';
import GameSubscription from '../../sockets/game_subscription';
import GameStore from '../../stores/game_store';
import Board from './board';
import Pieces from './pieces';
import Overlay from './overlay';
import Player from './player';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.getGame = this.getGame.bind(this);
    this.rejected = this.rejected.bind(this);
    this.status = this.status.bind(this);
    this.whiteOnBottom = this.whiteOnBottom.bind(this);
    this.playerStatus = this.playerStatus.bind(this);
    this.topCard = this.topCard.bind(this);
    this.botCard = this.botCard.bind(this);
    this.card = this.card.bind(this);

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

  playerStatus() {
    var game = this.state.game;
    if (game.white && game.white._id === this.state.currentUser._id)
      return 'white';
    else if (game.black && game.black._id === this.state.currentUser._id)
      return 'black';
    else
      return 'spectator';
  }

  whiteOnBottom() {
    let game = this.state.game;
    return this.playerStatus() !== 'black';
  }

  topCard() {
    if (!this.state.game) return {};
    return this.whiteOnBottom() ?  this.card('black') : this.card('white');
  }

  botCard() {
    if (!this.state.game) return {};
    return this.whiteOnBottom() ?  this.card('white') : this.card('black');
  }

  card(color) {
    return {color: color, player: this.state.game[color]};
  }

  status() {
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
        <Player data={this.topCard()} />
        <div id='board-wrapper'>
          <Overlay status={this.status()} />
          <Pieces status={this.status()} playerStatus={this.playerStatus()} />
          <Board />
        </div>
        <Player data={this.botCard()} />
      </section>
    );
  }
};

export default Game;
