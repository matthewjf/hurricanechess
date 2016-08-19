import React from 'react';
import Header from './layout/header.jsx';

class App extends React.Component {
  render() {
    return (
      <div id='root'>
        <Header />
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default App;
