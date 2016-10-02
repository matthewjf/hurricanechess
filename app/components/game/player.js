import React from 'react';
import {browserHistory} from 'react-router';
import GameSubscription from '../../sockets/game_subscription';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.name = this.name.bind(this);
    this.color = this.color.bind(this);
    this.handleSit = this.handleSit.bind(this);
  }

  name() {
    if (this.props.data.player) {
      return this.props.data.player.username;
    } else {
      return 'waiting for an opponent';
    }
  }

  color() {
    if (this.props.data.player)
      return this.props.data.color;
    else if (this.props.data.spectator)
      return <a onClick={this.handleSit} className="waves-effect waves-light btn sit-btn">
          Sit
        </a>;
  }

  handleSit() {
    GameSubscription.join(this.props.data.gameId);
  }

  render() {
    return(
      <div className="card-panel player-card">
        <div className={'col' + (this.props.data.player ? '' : ' waiting grey-text text-lighten-1')}>
          {this.name()}
        </div>
        <div className='col grey-text text-lighten-1'>
          {this.color()}
        </div>
      </div>
    );
  }
};

export default Player;
