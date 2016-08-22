import React from 'react';
// basic test to see if I can pass props down to child routes from `App.js`
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = this.currentUser.bind(this);
    this.state = {currentUser: this.props.currentUser};
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  currentUser() {
    if (this.state.currentUser) {
      return this.state.currentUser.username;
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className='alert alert-info'>
        Hello from Home Component {this.currentUser()}
      </div>
    );
  }
}

export default Home;
