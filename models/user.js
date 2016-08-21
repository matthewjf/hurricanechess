var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [4, 'Username must be at least 4 characters'],
    index: true
  },
  password: {
    type: String
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
