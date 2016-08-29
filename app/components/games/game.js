import React from 'react';
import ErrorUtil from '../../utils/error_util';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.params.id,
      error: null
    };
  }

  componentDidMount() {
    // this.gameListener = GameStore.addListener(this.getGame);
    // GameSubscription.subscribe(this.state.id, this.rejected);
  }

  getGame() {

  }

  componentWillUnmount() {
    // this.gameListener.remove();
    // GameSubscription.unsubscribe();
  }

  rejected() {
    if (this.state.currentUser)
      ErrorUtil.gameRejected();
    else
      ErrorUtil.loginRequired();
  }

  render() {
    return (
      <div/>
    );
  }
};

export default Game;
