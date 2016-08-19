import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/App';

// import GameIndex from './components/games/index';
import Home from './components/Home';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
  </Route>
);
