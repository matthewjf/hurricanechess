var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.route('/session').get(function(req, res) {
  res.status(200).json({ user: req.user});
});

router.route('/session').post(passport.authenticate('local'), function(req, res) {
  res.status(200).json({user: User.serialize(req.user)});
});

router.route('/session').delete(function(req, res) {
  req.logout();
  res.status(200).json('logged out');
});

module.exports = router;
