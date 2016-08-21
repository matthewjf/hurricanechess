require('babel-register');
// app
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var swig  = require('swig');
var app = express();
var config = require('./config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// DATABASE
var mongoose = require('mongoose');
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Running `mongod`?');
});

// APP
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: config.secret,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// AUTHENTICATION
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// TODO: Add middleware for routes that require login

// API ROUTES
var games = require('./controllers/games_controller');
var users = require('./controllers/users_controller');
var sessions = require('./controllers/sessions_controller');

app.use('/api', games);
app.use('/api', users);
app.use('/api', sessions);

// NON-API ROUTES
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var ClientRoutes = require('./app/routes');

app.use(function(req, res) {
  Router.match({ routes: ClientRoutes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found');
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
