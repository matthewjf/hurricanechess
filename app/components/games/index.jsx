import React from 'react';

var GameIndexSubscription = require('../../util/game_index_subscription'),
    GameIndexApi = require('../../util/game_index_api'),
    GameIndexStore = require('../../stores/game_index_store'),
    CurrentUserState = require("../../mixins/current_user_state"),
    Error = require('../shared/error');

var GameIndexItem = require('./index_item'),
    NewGameForm = require('./new_game_form');

export class GameIndex extends React.Component {
  getInitialState() {
    return { games: [], error: null, openModal: false };
  }

  getGames() {
    this.setState({games: GameIndexStore.all(), error: GameIndexStore.error()});
  }

  componentDidMount() {
    this.gameIndexListener = GameIndexStore.addListener(this.getGames);
    GameIndexApi.fetchGames();
    GameIndexSubscription.subscribe();
  }

  componentWillUnmount() {
    this.gameIndexListener.remove();
    GameIndexSubscription.unsubscribe();
  }

  openNewGameForm() {
		$('#new-game-modal').openModal();
  }

  gameList(games) {
    if (games) {
      return games.map(function(game) {
        return <GameIndexItem game={game} key={game.id} />;
      });
    } else {
      return null;
    }
  }

  render() {
    return(
      <div id='game-index'>
        <Error error={this.state.error} />
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
