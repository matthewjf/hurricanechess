var express = require('express');
var router = express.Router();
var passport = require('passport');
var sendgrid = require('../config/sendgrid');
var emailConfirm = require('../helpers/emails/confirm');
import User from '../models/user';

router.route('/users').get((req, res) => {
  res.status(200).json({ a: "user route" });
});

router.route('/users/new').post((req, res) => {
  User.register(
    new User({ username : req.body.username, email: req.body.email }),
    req.body.password,
    (err, user, token) => {
      if (err) {
        res.status(422).json(err);
      } else {
        var authUrl = 'https://www.chessx.io/verify?authToken='+ token;
        sendgrid.API(emailConfirm(user.email, authUrl), function(err, json) {
          if (err) {
            res.status(422).json(err);
          } else {
            res.status(200).json('Email confirmation sent!');
          }
        });
      }
    }
  );
});

router.route('/verify').post(function(req, res) {
  User.verifyEmail(req.body.authToken, function(err, user) {
    if (err) res.status(422).json(err);
    else res.status(200).json('Email verified!');
  });
});

router.route('/forgot').post(function(req, res) {
  User.find({email: req.body.email}, function(err, user) {

  });
});

module.exports = router;
