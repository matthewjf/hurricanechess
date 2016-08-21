var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.route('/session').get(function(req, res) {
  res.send(JSON.stringify({ a: "session route" })); // test that the endpoint works
});

module.exports = router;
