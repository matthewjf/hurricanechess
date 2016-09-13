import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';
import GameSubscription from '../../sockets/game_subscription';
import GameStore from '../../stores/game_store';
import Board from './board';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.getGame = this.getGame.bind(this);
    this.rejected = this.rejected.bind(this);

    this.state = {
      id: this.props.params.id,
      game: GameStore.get().game,
      pieces: GameStore.get().pieces,
      error: null
    };
  }

  componentDidMount() {
    this.gameListener = GameStore.addChangeListener(this.getGame);
    GameSubscription.join(this.state.id, null,this.rejected);
  }

  getGame() {
    this.setState(GameStore.get());
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

  render() {
    return (
      <section id='game'>
        <div className='split settings'>
          <a onClick={this.openGameSettings}
             className="waves-effect waves-light btn modal-trigger settings-btn">
            <i className="material-icons settings-icon">settings</i>
          </a>
        </div>
        <Board />
        <Pieces pieces={this.state.pieces} />
      </section>
    );
  }
};

export default Game;
