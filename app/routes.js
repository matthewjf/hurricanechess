import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/app';

import GameIndex from './components/games/index';
import Game from './components/games/game';

export default (
  <Route component={App}>
    <Route path='/' component={GameIndex} />
    <Route path='/games' component={GameIndex} />
    <Route path='/games/:id' component={Game} />
  </Route>
);
