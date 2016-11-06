import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/app';

import GameIndex from './components/index/index';
import Game from './components/game/game';
import About from './components/about/about';
import Verify from './components/users/verify';
import Forgot from './components/users/forgot';
import Reset from './components/users/reset';
import Solo from './components/solo/game';

export default (
  <Route component={App}>
    <Route path='/' component={GameIndex} />
    <Route path='/games' component={GameIndex} />
    <Route path='/games/:id' component={Game} />
    <Route path='/solo' component={Solo} />
    <Route path='/about' component={About} />
    <Route path='/verify' component={Verify} />
    <Route path='/forgot' component={Forgot} />
    <Route path='/reset' component={Reset} />
  </Route>
);
