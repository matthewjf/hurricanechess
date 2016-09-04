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
      game: GameStore.get(),
      error: null
    };
  }

  componentDidMount() {
    this.gameListener = GameStore.addChangeListener(this.getGame);
    GameSubscription.join(this.state.id, data => {console.log(data);},this.rejected);
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

  render() {
    return (
      <Board />
    );
  }
};

export default Game;
