import React from 'react';
import {browserHistory} from 'react-router';
import ErrorUtil from '../../utils/error_util';

export class GameIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);;
  }

  handleClick(e) {
    // TODO: add velocity component with bounce animation if not logged in
    e.preventDefault();
    $("li").velocity('finishAll');
    if (this.props.currentUser) {
      browserHistory.push('games/' + this.props.game._id);
    } else {
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
      <li className="row card-panel hoverable waves-effect game"
          onClick={this.handleClick}>
        <div className='col s7'>
          {game.name}
        </div>
        <div className={this.playerColor(game) + ' col s2 right-align'}>
          {this.playerCount(game) + '/2'}
        </div>
        <div className={this.statusColor(game.status) + ' col s3 right-align'}>
          {game.status}
        </div>
      </li>
    );
  }

};

export default GameIndexItem;
