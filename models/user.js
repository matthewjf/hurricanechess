var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: { type: String, required: true, minlength: 6, index: true },
  password: { type: String, required: true }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
