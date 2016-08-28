import React from 'react';

class SocketError extends React.Component {
  constructor(props) {
    super(props);

    this.state = { socketError: null };
  }

  componentDidMount() {
    socket.on('connect', function(){
      console.log("socket connected");
      this.setState({socketError: null});
    }.bind(this));

    socket.on('disconnect', function() {
      console.log('socket disconnected');
      this.setState(
        {socketError: "LOST CONNECTION TO SERVER... BIG PROBLEMS."}
      );
    }.bind(this));

    socket.on('reconnect', function() {
      console.log("socket reconnected");
      this.setState({socketError: null});
    }.bind(this));
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
