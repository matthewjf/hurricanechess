import React from 'react';

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
  }

  openNewGameForm() {
		$('#new-game-modal').openModal();
  }

  gameList(games) {
    if (games) {
      return games.map(function(game) {
        return <GameIndexItem game={game} key={game._id} />;
      });
    } else {
      return null;
    }
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
          { this.gameList(this.state.games) }
        </ul>
      </div>
    );
  }
};

export default GameIndex;
