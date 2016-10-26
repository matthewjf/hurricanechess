import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import ErrorUtil from '../../utils/error_util';

import GameIndexSubscription from '../../sockets/game_index_subscription';
import GameIndexStore from '../../stores/game_index_store';
import GameIndexActions from '../../actions/game_index_actions';

import GameIndexItem from './index_item';
import NewGameForm from './new_game_form';
import OnlineStats from './online_stats';
import Filter from './filter';
import Onboard from '../about/onboard';

class GameIndex extends React.Component {
  constructor(props) {
    super(props);
    this.openNewGameForm = this.openNewGameForm.bind(this);
    this.getGames = this.getGames.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.gameList = this.gameList.bind(this);

    this.state = { currentUser: this.props.currentUser, games: [], showFilter: false };
  }

  getGames() {
    this.setState({games: GameIndexStore.all()});
  }

  componentDidMount() {
    GameIndexStore.addChangeListener(this.getGames);
    GameIndexSubscription.join();
  }

  componentWillUnmount() {
    GameIndexStore.removeChangeListener(this.getGames);
    GameIndexSubscription.leave();
    GameIndexActions.removeGames();
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

  toggleFilter() {
    if (this.state.showFilter) this.setState({showFilter: false});
    else this.setState({showFilter: true});
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
      <div id='index-wrapper'>
        <div id='game-index' className='primary-content'>
          <Onboard currentUser={this.state.currentUser} />
          <div className='split'>
            <h2>GAMES</h2>

            <div id='index-controls'>
              <a className="waves-effect waves-light btn modal-trigger"
                 onClick={this.openNewGameForm}>
                new game
              </a>
              <a id='filter-btn'
                className={'btn btn-flat waves-effect ' + (this.state.showFilter ? 'active' : '')}
                onClick={this.toggleFilter}>
                <i className="material-icons sort-icon">sort</i>
              </a>
            </div>

            <div id="new-game-modal" className="modal">
              <NewGameForm />
            </div>
          </div>
          <Filter show={this.state.showFilter} toggleFilter={this.toggleFilter} />
          <ul id='game-list'>
            <VelocityTransitionGroup
                enter={{animation: 'slideDown', stagger: '50ms', duration: '50ms'}}
                leave={{animation: 'slideUp', stagger: '50ms', duration: '500ms'}} >
              {this.gameList(this.state.games)}
            </VelocityTransitionGroup>
          </ul>
        </div>

        <div className='secondary-content'>
          <OnlineStats />
        </div>
      </div>
    );
  }
};

export default GameIndex;
