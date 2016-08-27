import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/app';

import GameIndex from './components/games/index';
import Home from './components/home';

export default (
  <Route component={App}>
    <Route path='/' component={GameIndex} />
  </Route>
);
