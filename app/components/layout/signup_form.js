/* global Materialize */
import React from 'react';
import UserApi from '../../api/user_api';

class SignupForm extends React.Component {
  constructor() {
    super();
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.success = this.success.bind(this);

    this.state = {username: '', password: ''};
  }

  setUsername(e) {
    this.setState({username: e.currentTarget.value});
  }

  setPassword(e) {
    this.setState({password: e.currentTarget.value});
  }

  resetState() {
    this.setState({username: '', password: ''});
  }

  handleSubmit(e) {
    e.preventDefault();
    UserApi.signup(this.state, this.success);
  }

  success(data) {
    this.resetState();
    $('#signup-modal').closeModal();
    Materialize.toast('Welcome, ' + data.username + '!', 2000, 'success-text');
  }

  render() {
    if (this.state.currentUser) {
      return null;
    } else {
      return (
        <div id="signup-modal" className="modal">
          <div className='row'>
            <form onSubmit={this.handleSubmit} >

              <div className="modal-content">

                <div className='row'>
                  <div className='input-field'>
                    <input id="signup[username]"
                           type="text"
                           value={this.state.username}
                           onChange={this.setUsername} />
                    <label htmlFor="signup[username]">Username</label>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field'>
                    <input id="signup[password]"
                           type="password"
                           value={this.state.password}
                           onChange={this.setPassword} />
                    <label htmlFor="signup[password]">Password</label>
                  </div>
                </div>
              </div>

              <div className='modal-footer'>
                <input type='submit'
                       value='sign up'
                       className="waves-effect waves-light btn" />
              </div>

            </form>
          </div>
        </div>
      );
    }
  }
};

export default SignupForm;
