import React from 'react';
import {browserHistory} from 'react-router';
import {VelocityTransitionGroup} from 'velocity-react';

class Onboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderOnboard = this.renderOnboard.bind(this);
    this.close = this.close.bind(this);
    this.hide = this.hide.bind(this);

    this.state = { currentUser: this.props.currentUser, closed: true };
  }

  componentDidMount() {
    if (localStorage && !localStorage.hideOnboard)
      this.setState({closed: false});
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  close() {
    this.setState({closed: true});
  }

  hide() {
    localStorage.hideOnboard = true;
    this.close();
  }

  about() {
    browserHistory.push('/about');
  }

  renderOnboard() {
    if (!this.state.closed && !this.state.currentUser)
      return <div id='onboard' className='card-panel'>
        <div className='welcome'>
          <span>Welcome!</span>
        </div>
        <p>
          ChessX is realtime chess without turns.
          Move your pieces at any time.
          Dodge your opponent and intercept their moves.
          If this is your first visit,
          check out the <a onClick={this.about}>about page</a>.
        </p>
        <div className='footer'>
          <a onClick={this.hide} className='btn btn-flat stop waves-effect waves-light'>
            stop showing this
          </a>
          <a onClick={this.close} className='btn btn-flat close waves-effect waves-light'>
            close
          </a>
        </div>
      </div>;
    else
      return null;
  }

  render() {
    return <VelocityTransitionGroup
          enter={{animation: 'slideDown', duration: '500ms'}}
          leave={{animation: 'slideUp', duration: '500ms'}} >
        {this.renderOnboard()}
      </VelocityTransitionGroup>;
  }
}

export default Onboard;
