var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');
var db = require('./database');

module.exports = session({
    secret: config.secret,
    store: new MongoStore({mongooseConnection: db.connection}),
    resave: false,
    saveUninitialized: false
});
