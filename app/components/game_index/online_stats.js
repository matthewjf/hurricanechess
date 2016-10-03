import React from 'react';

import OnlineStatsStore from '../../stores/online_stats_store';

class OnlineStats extends React.Component {
  constructor(props) {
    super(props);
    this.getStats = this.getStats.bind(this);
    this.state = {userCount: 0};
  }

  getStats() {
    this.setState(Object.assign(this.state, OnlineStatsStore.all()));
  }

  componentDidMount() {
    OnlineStatsStore.addChangeListener(this.getStats);
  }

  componentWillUnmount() {
    OnlineStatsStore.removeChangeListener(this.getStats);
  }

  render() {
    return <div>users online: {this.state.userCount}</div>;
  }
};

export default OnlineStats;
