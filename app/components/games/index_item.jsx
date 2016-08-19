var React = require('react'),
    BrowserHistory = require('react-router').browserHistory;

module.exports = React.createClass({
  getInitialState: function() {
    return {game: this.props.game};
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({game: newProps.game});
  },

  handleClick: function(e) {
    e.preventDefault();
    BrowserHistory.push('games/' + this.state.game.id);
  },

  playerCount: function() {
    var count = 0;
    if (this.state.game.white)
      count += 1;
    if (this.state.game.black)
      count += 1;
    return count;
  },

  render: function() {
    return(
      <li className="row">
        <a onClick={this.handleClick}>
          <div className="game card-panel hoverable waves-effect">
            <div className='col s7'>
              {this.state.game.name}
            </div>
            <div className='col s2 right-align'>
              {this.playerCount()}/2
            </div>
            <div className='col s3 right-align'>
              {this.state.game.status}
            </div>
          </div>
        </a>
      </li>
    );
  }
});
