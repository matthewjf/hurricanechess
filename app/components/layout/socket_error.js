import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';

class SocketError extends React.Component {
  constructor(props) {
    super(props);
    this.renderError = this.renderError.bind(this);
    this.connect = this.connect.bind(this);

    this.state = { socketError: null };
  }

  componentDidMount() {
    socket.on('connect', () => {this.connect();});

    socket.on('disconnect', () => {
      $(this.refs.socketError).velocity('finish');
      this.disconnect = setTimeout(() => {
        this.setState(
          {socketError: "LOST CONNECTION TO SERVER... BIG PROBLEMS."}
        );
      }, 500);
    });
  }

  connect() {
    $(this.refs.socketError).velocity('finish');
    clearTimeout(this.disconnect);
    if (this.state.socketError) {
      $(this.refs.socketError).text('RECONNECTED');
      $(this.refs.socketError)
        .velocity({backgroundColor: '#388e3c'}, {duration: 0})
        .velocity({scale: 1.25}, {duration: 200, easing: 'swing'})
        .velocity('reverse');
      setTimeout(() => {
        this.setState({socketError: null});
      }, 500);
    }
  }

  renderError() {
    if (this.state.socketError) {
      return (
        <div id='socket-error' ref='socketError' className="primary-content card-panel white-text error-color">
          {this.state.socketError}
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return <VelocityTransitionGroup
        runOnMount={true}
        enter={{animation: 'fadeIn', duration: 250}}
        leave={{animation: 'fadeOut', duration: 250}} >
      {this.renderError()}
    </VelocityTransitionGroup>;
  }
}

export default SocketError;
