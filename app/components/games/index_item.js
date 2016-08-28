import React from 'react';
import {browserHistory} from 'react-router';

export class GameIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // this.playerCount = this.playerCount.bind(this);

    this.state = {game: this.props.game};
  }

  componentWillReceiveProps(props) {
    this.setState({game: props.game});
  }

  handleClick(e) {
    e.preventDefault();
    browserHistory.push('games/' + this.state.game._id);
  }

  render() {
    return(
      <li className="row">
        <a onClick={this.handleClick}>
          <div className="game card-panel hoverable waves-effect">
            <div className='col s7'>
              {this.state.game.name}
            </div>
            <div className='col s2 right-align'>
              {/* {this.playerCount()}/2 */}
            </div>
            <div className='col s3 right-align'>
              {this.state.game.status}
            </div>
          </div>
        </a>
      </li>
    );
  }

};

export default GameIndexItem;
