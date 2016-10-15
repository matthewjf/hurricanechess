import React from 'react';
import {browserHistory} from 'react-router';
import UserApi from '../../api/user_api';

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.success = this.success.bind(this);

    this.state = {currentUser: this.props.currentUser};
  }

  componentDidMount() {
    this.isLoggedIn(this.state.currentUser);
    UserApi.verifyEmail(this.props.location.query.authToken, this.success, this.error);
  }

  componentWillReceiveProps(props) {
    this.isLoggedIn(props.currentUser);
    this.setState({currentUser: props.currentUser});
  }

  isLoggedIn(user) {
    if (user) browserHistory.push('/');
  }

  success(res) {
    Materialize.toast('Email verified!', 2000, 'success-text');
    browserHistory.push('/');
    if (!this.state.currentUser) $('#login-modal').openModal();
  }

  error(err) {
    Materialize.toast(err.responseJSON, 2000, 'error-text');
    browserHistory.push('/');
  }

  render() {
    return <div/>;
  }
}

export default Verify;
