import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/app.js';

import GameIndex from './components/game_index/index';
import Game from './components/game/game';

export default (
  <Route component={App}>
    <Route path='/' component={GameIndex} />
    <Route path='/games' component={GameIndex} />
    <Route path='/games/:id' component={Game} />
  </Route>
);
