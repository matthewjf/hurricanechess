import React from 'react';
import {browserHistory} from 'react-router';

export class GameIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.playerCount = this.playerCount.bind(this);
    this.playerColor = this.playerColor.bind(this);
    this.statusColor = this.statusColor.bind(this);

    this.state = {game: this.props.game};
  }

  componentWillReceiveProps(props) {
    this.setState({game: this.props.game});
  }

  handleClick(e) {
    e.preventDefault();
    browserHistory.push('games/' + this.state.game._id);
  }

  playerCount() {
    var count = 0;
    if (this.state.game.white)
      count += 1;
    if (this.state.game.black)
      count += 1;
    return count;
  }

  playerColor() {
    if (this.playerCount() === 0) {
      return "error-text";
    }
  }

  statusColor() {
    switch (this.state.game.status){
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
    return(
      <li className="row card-panel hoverable waves-effect game">
        <a onClick={this.handleClick}>
          <div className='col s7'>
            {this.state.game.name}
          </div>
          <div className={this.playerColor() + ' col s2 right-align'}>
            {this.playerCount()}/2
          </div>
          <div className={this.statusColor() + ' col s3 right-align'}>
            {this.state.game.status}
          </div>
        </a>
      </li>
    );
  }

};

export default GameIndexItem;
