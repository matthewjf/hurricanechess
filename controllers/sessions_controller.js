var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.route('/session').get((req, res) => {
  res.status(200).json({user: req.user});
});

router.route('/session').post(passport.authenticate('local'), (req, res) => {
  User.findById(req.user, (err,user) => {
    if (err)
      res.status(422).json({error: err, status: 422});
    else
      res.status(200).json({user: user});
  });
});

router.route('/session').delete((req, res) => {
  req.logout();
  res.status(200).json('logged out');
});

module.exports = router;
