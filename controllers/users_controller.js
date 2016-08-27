var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.route('/users').get(function(req, res) {
  res.status(200).json({ a: "user route" });
});

// register user and create session
router.route('/users/new').post(function(req, res) {
  User.register(
    new User({ username : req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        res.status(422).json({error: err, status: 422});
      } else {
        passport.authenticate('local')(req, res, function() {
          req.session.save(function(err) {
            if (err) {
              return next(err);
            }
            User.findById(req.user, function(err,user) {
              res.status(200).json({user: user});
            });
          });
        });
      }
    }
  );
});

module.exports = router;
