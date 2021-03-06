import React from 'react';
import {browserHistory} from 'react-router';
import UserApi from '../../api/user_api';

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.setEmail = this.setEmail.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {email: '', currentUser: this.props.currentUser};
  }

  componentDidMount() {
    this.isLoggedIn(this.state.currentUser);
  }

  componentWillReceiveProps(props) {
    this.isLoggedIn(props.currentUser);
    this.setState({currentUser: props.currentUser});
  }

  setEmail(e) {
    delete this.state.error;
    this.setState({email: e.currentTarget.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    UserApi.sendResetEmail(this.state.email, this.success, this.error);
  }

  isLoggedIn(user) {
    if (user) browserHistory.push('/');
  }

  success(res) {
    Materialize.toast('Password reset email sent!', 2000, 'success-text');
    browserHistory.push('/');
  }

  error(err) {
    this.setState({error: err.responseJSON});
  }

  render() {
    return <div id='forgot'>
        <h2 id='forgot-title'>Forgot your password?</h2>
        <div className='card-panel'>
          <form id='forgot-form' onSubmit={this.handleSubmit}>
            <div className='row'>
              <div className='input-field'>
                <input id="forgot[email]"
                       type="email"
                       className={this.state.error ? 'invalid' : ''}
                       value={this.state.email}
                       onChange={this.setEmail} />
                <label htmlFor="forgot[email]">Email</label>
                <div className='error'>{this.state.error}</div>
              </div>
            </div>
            <input id='forgot-submit' type="submit" value="Send reset email" className='btn'/>
          </form>
        </div>
      </div>;
  }
}

export default Forgot;
