import React from 'react';
import {browserHistory} from 'react-router';
import TimeAgo from 'react-timeago';
import ErrorUtil from '../../utils/error_util';
import formatter from '../../utils/formatter';

class GameIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);;
  }

  handleClick(e) {
    // TODO: add velocity component with bounce animation if not logged in
    e.preventDefault();
    $("li", "#game-index").velocity('finishAll');
    if (this.props.currentUser) {
      browserHistory.push('/games/' + this.props.game._id);
    } else {
      $(this.refs.item)
        .velocity({scale: 1.25}, {duration: 100, easing: 'swing'})
        .velocity('reverse');
      ErrorUtil.loginRequired();
    }
  }

  playerCount(game) {
    var count = 0;
    if (game.white)
      count += 1;
    if (game.black)
      count += 1;
    return count;
  }

  playerColor(game) {
    if (this.playerCount(game) === 0)
      return "error-text";
    else
      return '';
  }

  statusColor(status) {
    switch (status){
      case 'waiting':
        return 'primary-text';
        break;
      case 'archived':
        return 'grey-text';
        break;
      case 'active':
        return 'light-green-text text-lighten-1';
        break;
      case 'starting':
        return 'secondary-text';
        break;
      default:
        return '';
    }
  }

  render() {
    let game = this.props.game;
    return(
      <li ref='item' className="row card-panel clickable waves-effect game"
          onClick={this.handleClick}>

        <div className='col s10 m7 game-name name-col'>
          {game.name}
        </div>

        <div className={`${this.playerColor(game)} col s2 m1 count-col`}>
          {this.playerCount(game) + '/2'}
        </div>

        <div className={`${this.statusColor(game.status)} col s6 m2 status-col`}>
          {game.status}
        </div>

        <div className='col s6 m2 right-align time-col'>
          <TimeAgo date={game.createdAt} formatter={formatter} minPeriod={60} />
        </div>
      </li>
    );
  }

};

export default GameIndexItem;
