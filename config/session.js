var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var db = require('./database');
var config = require('./config');

module.exports = session({
    secret: config.secret,
    store: new MongoStore({mongooseConnection: db.connection}),
    resave: false,
    saveUninitialized: false
});
