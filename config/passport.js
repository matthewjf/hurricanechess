var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne(
        {_id: id},
        '-password',
        function(err, user) {
            done(err, user);
        }
    );
});

module.exports = passport;
