import React from 'react';

class SocketError extends React.Component {
  constructor(props) {
    super(props);

    this.state = { socketError: null };
  }

  componentDidMount() {
    socket.on('connect', () => {
      console.log("socket connected");
      this.setState({socketError: null});
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
      this.setState(
        {socketError: "LOST CONNECTION TO SERVER... BIG PROBLEMS."}
      );
    });

    socket.on('reconnect', () => {
      console.log("socket reconnected");
      this.setState({socketError: null});
    });
  }

  render() {
    if (this.state.socketError) {
      return (
        <div id='socket-error' className="card-panel white-text error-color">
          <span>{this.state.socketError}</span>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default SocketError;
