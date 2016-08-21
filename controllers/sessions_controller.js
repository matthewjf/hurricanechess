var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/session').get(function(req, res) {
  res.json({ user: req.user});
});

router.route('/session').post(passport.authenticate('local'), function(req, res) {
  res.json('logged in');
});

router.route('/session').delete(function(req, res) {
  req.logout();
  res.jons('logged out');
});

module.exports = router;
