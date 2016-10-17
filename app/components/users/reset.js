import React from 'react';
import {browserHistory} from 'react-router';
import UserApi from '../../api/user_api';

class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.setPassword = this.setPassword.bind(this);
    this.setConfirm = this.setConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.success = this.success.bind(this);

    this.state = {
      currentUser: this.props.currentUser,
      authToken: this.props.location.query.authToken,
      password: '',
      confirm: ''
    };
  }

  componentDidMount() {
    this.isLoggedIn(this.state.currentUser);
  }

  componentWillReceiveProps(props) {
    this.isLoggedIn(props.currentUser);
    this.setState({currentUser: props.currentUser});
  }

  setPassword(e) {
    this.setState({password: e.currentTarget.value});
  }

  setConfirm(e) {
    this.setState({confirm: e.currentTarget.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    UserApi.verifyReset({
      authToken: this.state.authToken,
      password: this.state.password,
      confirm: this.state.confirm
    }, this.success, this.error);
  }

  isLoggedIn(user) {
    if (user) browserHistory.push('/');
  }

  success(res) {
    Materialize.toast('Password changed!', 2000, 'success-text');
    browserHistory.push('/');
    if (!this.state.currentUser) $('#login-modal').openModal();
  }

  error(err) {
    // TODO: more descriptive error messages
    Materialize.toast('Error occurred', 2000, 'success-text');
  }

  render() {
    return <div id='reset'>
        <h5 id='reset-title'>Password reset</h5>
        <div className='card-panel'>
          <form id='reset-form' onSubmit={this.handleSubmit}>
            <div className='row'>
              <div className='input-field'>
                <input id="reset[password]"
                       type="password"
                       value={this.state.password}
                       onChange={this.setPassword} />
                <label htmlFor="reset[password]">Password</label>
              </div>
            </div>
            <div className='row'>
              <div className='input-field'>
                <input id="reset[confirm]"
                       type="password"
                       value={this.state.confirm}
                       onChange={this.setConfirm} />
                <label htmlFor="reset[confirm]">Confirm</label>
              </div>
            </div>
            <input id='reset-submit' type="submit" value="Reset password" className='btn'/>
          </form>
        </div>
      </div>;
  }
}

export default Reset;
