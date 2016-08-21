var express = require('express');
var router = express.Router();
var Game = require('../models/game');

router.route('/games').get(function(req, res) {
  res.send(JSON.stringify({ a: 1 })); // test that the endpoint works
});

module.exports = router;
