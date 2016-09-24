import React from 'react';
import GameConfig from '../../../config/game';
import Display from '../../utils/display';

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.performCountdown = this.performCountdown.bind(this);
    this.updateStatusText = this.updateStatusText.bind(this);
    this.isActive = this.isActive.bind(this);

    this.state = {
      status: this.props.status
    };
  }

  componentDidMount() {
    this.updateStatusText();
  }

  componentWillReceiveProps(props) {
    this.setState({status: props.status});
    this.updateStatusText(props.status);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  isActive() {
    return this.state.status === 'active';
  }

  updateStatusText(status = this.state.status) {
    switch (status) {
      case 'waiting':
        clearInterval(this.interval);
        this.setState({statusText: 'waiting'});
        break;
      case 'starting':
        if (!Number.isInteger(this.countdown)) {
          this.setState({statusText: 'starting'});
          this.countdown = GameConfig.startDelay / 1000;
          this.performCountdown();
          this.interval = setInterval(function() {this.performCountdown();}.bind(this), 1000);
        }
        break;
      case 'archived':
        this.setState({statusText: 'game over'});
        break;
      case 'active':
        this.setState({statusText: undefined});
        break;
    }
  }

  performCountdown() {
    if (this.countdown) {
      this.countdown -= 1;
      var text = this.countdown ? 'starting ' + (this.countdown) : 'go';
      this.setState({statusText: text});
    } else {
      clearInterval(this.interval);
    }
  }

  render() {
    if (!this.isActive()) {
      return (
        <div id='board-overlay' style={{height: Display.gridSizePx, width: Display.gridSizePx}}>
          <div id='board-status' className='z-depth-1'>
            {this.state.statusText}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Overlay;
