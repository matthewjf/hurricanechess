var express = require('express');
var router = express.Router();
var passport = require('passport');
import User from '../models/user';

router.route('/users').get((req, res) => {
  res.status(200).json({ a: "user route" });
});

// register user and create session
router.route('/users/new').post((req, res) => {
  User.register(
    new User({ username : req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.status(422).json(err);
      } else {
        passport.authenticate('local')(req, res, () => {
          req.session.save((err) => {
            if (err) {
              return next(err);
            }
            User.findById(req.user, (err,user) => {
              res.status(200).json({user: user});
            });
          });
        });
      }
    }
  );
});

module.exports = router;
