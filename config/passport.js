var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findOne(
        {_id: id},
        '-password',
        (err, user) => {
            done(err, user);
        }
    );
});

module.exports = passport;
