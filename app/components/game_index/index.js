import React from 'react';
import {VelocityTransitionGroup, VelocityComponent} from 'velocity-react';

import GameIndexSubscription from '../../sockets/game_index_subscription';
import GameIndexStore from '../../stores/game_index_store';

import GameIndexItem from './index_item';
import NewGameForm from './new_game_form';

class GameIndex extends React.Component {
  constructor(props) {
    super(props);
    this.getGames = this.getGames.bind(this);

    this.state = { games: [] };
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
		$('#new-game-modal').openModal();
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
      <div id='game-index'>
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
              enter={{animation: 'slideDown', stagger: '100ms', duration: '100ms'}}
              leave={'slideUp'} >
            {this.gameList(this.state.games)}
          </VelocityTransitionGroup>
        </ul>
      </div>
    );
  }
};

export default GameIndex;
