import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: this.props.show };
  }

  componentWillReceiveProps(props) {
    this.setState({ show: props.show });
  }

  renderFilter() {
    return <div id='filter' className='card-panel'>Filters</div>;
  }

  render() {
    return <VelocityTransitionGroup
          enter={{animation: 'slideDown', duration: '500ms'}}
          leave={{animation: 'slideUp', duration: '500ms'}} >
        {this.state.show ? this.renderFilter() : null}
      </VelocityTransitionGroup>;
  }
}

export default Filter;
