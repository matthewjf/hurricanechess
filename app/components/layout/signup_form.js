/* global Materialize */
import React from 'react';
import UserApi from '../../api/user_api';

class SignupForm extends React.Component {
  constructor() {
    super();
    this.setUsername = this.setUsername.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.errorClass = this.errorClass.bind(this);
    this.errorText = this.errorText.bind(this);

    this.defaultState = {username: '', password: '', email: '', errors: {}};

    this.state = this.defaultState;
  }

  setUsername(e) {
    if (this.state.errors) delete this.state.errors.username;
    this.setState({username: e.currentTarget.value});
  }

  setPassword(e) {
    if (this.state.errors) delete this.state.errors.password;
    this.setState({password: e.currentTarget.value});
  }

  setEmail(e) {
    if (this.state.errors) delete this.state.errors.email;
    this.setState({email: e.currentTarget.value});
  }

  resetState() {
    this.setState(this.defaultState);
  }

  handleSubmit(e) {
    e.preventDefault();
    UserApi.signup(this.state, this.success, this.error);
  }

  success(data) {
    this.resetState();
    $('#signup-modal').closeModal();
    Materialize.toast('Email verification sent!', 10000, 'success-text');
  }

  error(err) {
    var json = err.responseJSON;
    if (json.errors) this.setState({errors: json.errors});
    else if (json.code === 11000)
      this.setState({errors: {email: {message: 'Email already in use'}}});
    else this.setState({errors: {error: {message: json}}});
    // TODO: more descriptive errors
  }

  errorClass(field) {
    return this.state.errors[field] ? 'invalid' : '';
  }

  errorText(field) {
    var err = this.state.errors[field];
    return err ? err.message : '';
  }

  render() {
    if (this.state.currentUser) {
      return null;
    } else {
      return (
        <div id="signup-modal" className="modal">
          <div className='row'>
            <form onSubmit={this.handleSubmit}>

              <div className="modal-content">
                <div className='error-text'>{this.errorText('error')}</div>
                <div className='row'>
                  <div className='input-field'>
                    <input id="signup[username]"
                           type="text"
                           className={this.errorClass('username')}
                           value={this.state.username}
                           onChange={this.setUsername} />
                    <label htmlFor="signup[username]">Username</label>
                    <div className='error'>{this.errorText('username')}</div>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field'>
                    <input id="signup[email]"
                           type="email"
                           className={this.errorClass('email')}
                           value={this.state.email}
                           onChange={this.setEmail} />
                    <label htmlFor="signup[email]">Email</label>
                    <div className='error'>{this.errorText('email')}</div>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field'>
                    <input id="signup[password]"
                           type="password"
                           className={this.errorClass('password')}
                           value={this.state.password}
                           onChange={this.setPassword} />
                    <label htmlFor="signup[password]">Password</label>
                    <div className='error'>{this.errorText('password')}</div>
                  </div>
                </div>

              </div>
              <input type="submit" className='hidden-submit' />
              <div className='modal-footer'>
                <a onClick={this.handleSubmit} className="waves-effect waves-light btn">
                  Sign Up
                </a>
              </div>

            </form>
          </div>
        </div>
      );
    }
  }
};

export default SignupForm;
