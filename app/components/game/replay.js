import React from 'react';
import Playback from '../../utils/playback';

class Replay extends React.Component {
  constructor(props) {
    super(props);
    this.getPlayback = this.getPlayback.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.play = this.play.bind(this);

    this.state = {status: Playback.status(), hasHistory: Playback.hasHistory()};
  }

  componentDidMount() {
    Playback.addChangeListener(this.getPlayback);
  }

  componentWillUnmount() {
    Playback.removeChangeListener(this.getPlayback);
    Playback.removeHistory();
  }

  getPlayback() {
    this.setState({status: Playback.status(), hasHistory: Playback.hasHistory()});
  }

  play() {
    if (this.state.status === 'playing') {
      Playback.pause();
    } else {
      Playback.play();
    }
  }

  stop() {
    Playback.end();
  }

  replayClasses() {
    return "material-icons replay-action clickable waves-effect waves-light";
  }

  renderControls() {
    if (this.state.hasHistory) {
      var icon = this.state.status === 'playing' ? "pause" : "play_arrow";
      return <div id='replay-controls'>
          <div id='control-wrapper'>
            <i onClick={this.play} className={this.replayClasses()}>{icon}</i>
            <i onClick={this.stop} className={this.replayClasses()}>stop</i>
          </div>
        </div>;
    } else {
      return null;
    }
  }

  render() {
    return <div id='replay'>{this.renderControls()}</div>;
  }
};

export default Replay;
