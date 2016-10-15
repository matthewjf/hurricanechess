import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/app';

import GameIndex from './components/game_index/index';
import Game from './components/game/game';
import About from './components/about/about';
import Verify from './components/users/verify';
import Forgot from './components/users/forgot';

export default (
  <Route component={App}>
    <Route path='/' component={GameIndex} />
    <Route path='/games' component={GameIndex} />
    <Route path='/games/:id' component={Game} />
    <Route path='/about' component={About} />
    <Route path='/verify' component={Verify} />
    <Route path='/forgot' component={Forgot} />
  </Route>
);
