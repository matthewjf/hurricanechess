var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.route('/users').get(function(req, res) {
  res.json({ a: "user route" });
});

router.route('/users/new').post(function(req, res) {
  User.register(
    new User({ username : req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        return res.json('register', {user: user});
      }
      passport.authenticate('local')(req, res, function() {
        res.json('what does this do?');
      });
    }
  );
});

module.exports = router;
