/* global Materialize */

import React from 'react';
var UserApi = require('../../util/user_api');

export class LoginForm extends React.Component {
  getInitialState() {
    return {username: '', password: ''};
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
    UserApi.login(this.state, this.success);
  }

  success(data) {
    this.resetState();
    $('#login-modal').closeModal();
    Materialize.toast(
      'Welcome back, ' + data.username + '!',
      2000,
      'success-text'
    );
  }

  render() {
    if (this.state.currentUser) {
      return null;
    } else {
      return (
        <div id="login-modal" className="modal">
          <div className='row'>
            <form onSubmit={this.handleSubmit} >

              <div className="modal-content">

                <div className='row'>
                  <div className='input-field'>
                    <input id="login[username]"
                           type="text"
                           value={this.state.username}
                           onChange={this.setUsername} />
                    <label htmlFor="login[username]">Username</label>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field'>
                    <input id="login[password]"
                           type="password"
                           value={this.state.password}
                           onChange={this.setPassword} />
                    <label htmlFor="login[password]">Password</label>
                  </div>
                </div>
              </div>

              <div className='modal-footer'>
                <input type='submit'
                       value='login'
                       className="waves-effect waves-light btn" />
              </div>

            </form>
          </div>
        </div>
      );
    }
  }
};
