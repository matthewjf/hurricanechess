var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.route('/users').get(function(req, res) {
  res.send(JSON.stringify({ a: "user route" })); // test that the endpoint works
});

module.exports = router;
