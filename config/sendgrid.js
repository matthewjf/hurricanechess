var config = require('./config');
var sendgrid = require('sendgrid')(config.sendgrid_api_key);
module.exports = sendgrid;
