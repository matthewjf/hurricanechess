var React = require('react'),
    Error = require("../shared/error"),
    ErrorUtil = require('../../util/error_util'),
    CurrentUserState = require('../../mixins/current_user_state'),
    GameSubscription = require('../../util/game_subscription'),
    GameStore = require("../../stores/game_store");

module.exports = React.createClass({
  mixins: [CurrentUserState],

  getInitialState: function() {
    return {
      id: this.props.params.gameId,
      error: null
    };
  },

  componentDidMount: function() {
    this.gameListener = GameStore.addListener(this.getGame);
    GameSubscription.subscribe(this.state.id, this.rejected);
  },

  getGame: function() {

  },

  componentWillUnmount: function() {
    this.gameListener.remove();
    GameSubscription.unsubscribe();
  },

  rejected: function() {
    if (this.state.currentUser)
      ErrorUtil.gameRejected();
    else
      ErrorUtil.loginRequired();
  },

  render: function() {
    return (
      <Error error={this.state.error} />
    );
  }
});
