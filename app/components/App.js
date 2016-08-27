import React from 'react';
import Header from './layout/header';
import LoginForm from './layout/login_form';
import SignupForm from './layout/signup_form';
import SocketError from './layout/socket_error';
import UserStore from '../stores/user_store';
import UserApi from '../api/user_api';

class App extends React.Component {
  constructor() {
    super();
    this.updateUser = this.updateUser.bind(this);

    this.state = {
      currentUser: UserStore.currentUser()
    };
  }

  componentDidMount() {
    this.userListener = UserStore.addChangeListener(this.updateUser);
    if (!UserStore.currentUser()) {UserApi.fetchCurrentUser();}
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.updateUser);
  }

  updateUser() {
    this.setState({
      currentUser: UserStore.currentUser(),
      userErrors: UserStore.errors()
    });
  }

  render() {
    // all child routes have access to currentUser prop
    return (
      <div id='root'>
        <Header currentUser={this.state.currentUser} />
        <LoginForm />
        <SignupForm />
        <SocketError />
        <main>
          {React.cloneElement(
            this.props.children,
            { currentUser: this.state.currentUser }
          )}
        </main>
      </div>
    );
  }
}

export default App;
