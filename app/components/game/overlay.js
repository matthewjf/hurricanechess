import React from 'react';
import Playback from '../../utils/playback';
import GameConfig from '../../../config/game';
import {VelocityTransitionGroup} from 'velocity-react';

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.performCountdown = this.performCountdown.bind(this);
    this.updateStatusText = this.updateStatusText.bind(this);
    this.isActive = this.isActive.bind(this);
    this.getPlaybackStatus = this.getPlaybackStatus.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.waiting = this.waiting.bind(this);
    this.starting = this.starting.bind(this);
    this.archived = this.archived.bind(this);
    this.winnerText = this.winnerText.bind(this);

    this.state = { status: this.props.status, winner: this.props.winner, playbackStatus: Playback.status() };
  }

  componentDidMount() {
    this.updateStatusText();
    Playback.addChangeListener(this.getPlaybackStatus);
  }

  componentWillReceiveProps(props) {
    this.setState({status: props.status, winner: props.winner});
    this.updateStatusText(props.status);
  }

  componentWillUnmount() {
    $(this.refs.status).velocity('stop');
    clearInterval(this.interval);
    Playback.removeChangeListener(this.getPlaybackStatus);
  }

  isActive() {
    return this.state.status === 'active';
  }

  getPlaybackStatus() {
    this.setState({playbackStatus: Playback.status()});
  }

  waiting() {
    clearInterval(this.interval);
    this.countdown = undefined;
    $(this.refs.status).velocity('finish')
      .velocity({opacity: 1, color: '#fff', scale: 1}, {duration: 0});
    this.setState({statusText: 'waiting'});
  }

  starting() {
    if (!Number.isInteger(this.countdown)) {
      this.setState({statusText: 'starting'});
      this.countdown = GameConfig.startDelay / 1000;
      this.performCountdown();
      this.interval = setInterval(function() {
        this.performCountdown();
      }.bind(this), 1000);
    }
  }

  archived() {
    this.setState({statusText: 'game over'});
    if (!this.gameEnded) {
      this.gameEnded = true;
      setTimeout(function() {
        $(this.refs.status)
        .velocity({scale: 1.5}, {duration: 100, easing: 'swing'})
        .velocity('reverse');
      }.bind(this), 500);
    }
  }

  updateStatusText(status = this.state.status) {
    switch (status) {
      case 'waiting':
        this.waiting();
        break;
      case 'starting':
        this.starting();
        break;
      case 'archived':
        this.archived();
        break;
      case 'active':
        $(this.refs.status).velocity('finish');
        this.setState({statusText: undefined});
        break;
    }
  }

  winnerText() {
    if (this.state.winner)
      return this.state.winner === 'draw' ? 'draw' : this.state.winner + ' won';
    else
      return '';
  }

  performCountdown() {
    if (this.countdown) {
      this.countdown -= 1;
      var text = this.countdown ? 'starting ' + (this.countdown) : 'go';
      this.setState({statusText: text});
      this.animateCountdown(this.countdown);
    } else {
      clearInterval(this.interval);
    }
  }

  animateCountdown(countdown) {
    if (countdown > 0 && countdown < 4) {
      $(this.refs.status).velocity({colorBlue: '/=2', colorGreen: '/=2'}, {duration: 75});
      $(this.refs.status)
        .velocity({scale: 1.5 - (countdown / 8)}, {duration: 100, easing: 'swing'})
        .velocity('reverse');
    }
    if (countdown === 0) {
      $(this.refs.status).velocity({color: '#32cd32'}, {duration: 0});
      $(this.refs.status).velocity(
        {scale: 1.25, opacity: 0},
        {delay: 500, duration: 500, easing: 'swing'}
      );
    }
  }

  renderOverlay() {
    if (!this.isActive() && !this.state.playbackStatus || this.state.playbackStatus === 'ended') {
      return (
        <div id='board-overlay'>
          <div id='board-status' ref='status' className='z-depth-1'>
            <span>{this.state.statusText}</span>
            <span id='win-text' className='grey-text'>
              { this.winnerText() }
            </span>
          </div>
        </div>
      );
    } else if (this.state.playbackStatus === 'playing') {
      return <div id='board-replay'>REPLAY</div>;
    } else if (this.state.playbackStatus === 'paused') {
      return <div id='board-replay'>PAUSED</div>;
    } else {
      return null;
    }
  }

  render() {
    return <VelocityTransitionGroup
        runOnMount={true}
        id='board-overlay-velocity'
        enter={{animation: 'fadeIn', duration: 500}}
        leave={{animation: 'fadeOut', duration: 50}} >
      {this.renderOverlay()}
    </VelocityTransitionGroup>;
  }
}

export default Overlay;
