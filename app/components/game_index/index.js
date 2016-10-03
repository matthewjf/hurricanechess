import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import ErrorUtil from '../../utils/error_util';

import GameIndexSubscription from '../../sockets/game_index_subscription';
import GameIndexStore from '../../stores/game_index_store';

import GameIndexItem from './index_item';
import NewGameForm from './new_game_form';
import OnlineStats from './online_stats';

class GameIndex extends React.Component {
  constructor(props) {
    super(props);
    this.openNewGameForm = this.openNewGameForm.bind(this);
    this.getGames = this.getGames.bind(this);
    this.gameList = this.gameList.bind(this);

    this.state = { currentUser: this.props.currentUser, games: [] };
  }

  getGames() {
    this.setState({games: GameIndexStore.all()});
  }

  componentDidMount() {
    this.gameIndexListener = GameIndexStore.addChangeListener(this.getGames);
    GameIndexSubscription.join();
  }

  componentWillUnmount() {
    GameIndexStore.removeChangeListener(this.getGames);
    GameIndexSubscription.leave();
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  openNewGameForm() {
    if (this.state.currentUser)
		  $('#new-game-modal').openModal();
    else
      ErrorUtil.loginRequired();
  }

  gameList(games) {
    return games.map(game => {
      return <GameIndexItem
                game={game}
                key={game._id}
                currentUser={this.state.currentUser}/>;
    });
  }

  render() {
    return(
      <div id='game-index' className='primary-content'>
        <OnlineStats />
        <div className='split'>
          <h2>GAMES</h2>

          <a className="waves-effect waves-light btn modal-trigger"
             onClick={this.openNewGameForm}>
            new game
          </a>

          <div id="new-game-modal" className="modal">
            <NewGameForm />
          </div>
        </div>

        <ul id='game-list'>
          <VelocityTransitionGroup
              enter={{animation: 'slideDown', stagger: '50ms', duration: '50ms'}}
              leave={{animation: 'slideUp', duration: '500ms'}} >
            {this.gameList(this.state.games)}
          </VelocityTransitionGroup>
        </ul>
      </div>
    );
  }
};

export default GameIndex;
