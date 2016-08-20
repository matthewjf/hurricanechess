import React from 'react';
import Header from './layout/header.jsx';
import LoginForm from './layout/login_form.jsx';
import SignupForm from './layout/signup_form.jsx';

class App extends React.Component {
  render() {
    return (
      <div id='root'>
        <Header />
        <LoginForm />
        <SignupForm />
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default App;
