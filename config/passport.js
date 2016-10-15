var passport = require('passport');
import User from '../models/user';

passport.use(User.createStrategy());
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
