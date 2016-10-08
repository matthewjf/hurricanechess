import React from 'react';
import HistoryStore from '../../stores/history_store';
import HistoryActions from '../../actions/history_actions';
import Playback from '../../utils/playback';

class Replay extends React.Component {
  constructor(props) {
    super(props);
    this.getHistory = this.getHistory.bind(this);

    this.state = {playback: this.getPlayback()};
  }

  componentDidMount() {
    this.historyListener = HistoryStore.addChangeListener(this.getHistory);
  }

  componentWillUnmount() {
    HistoryStore.removeChangeListener(this.getHistory);
    HistoryActions.removeHistory();
  }

  getHistory() {
    console.log('history received');
    this.setState({playback: this.getPlayback()});
  }

  getPlayback() {
    var moves = HistoryStore.get().moves;
    if (moves)
      return new Playback(moves);
  }

  render() {
    return null;
  }
};

export default Replay;
