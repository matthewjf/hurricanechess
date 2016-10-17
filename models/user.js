var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');
var crypto = require('crypto');
import Auth from './auth';

var UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [4, 'Username must be at least 4 characters'],
    unique: true,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true
  }
}, {timestamps: true});

UserSchema.plugin(passportLocalMongooseEmail);

UserSchema.statics.register = function(user, password, cb) {
  if (!(user instanceof this)) user = new this(user);
  if (!user.username) return cb('Username is required');

  var self = this;
  self.findByUsername(user.username, function(err, existingUser) {
    if (err) return cb(err);
    if (existingUser) return cb('Username taken');

    user.setPassword(password, function(err, user) {
      if (err) return cb(err);
      user.setAuthToken(function(err,user, token) {
        if (err) return cb(err);
        user.isAuthenticated = false;
        user.save(function(err, user) {
          if (err) return cb(err);
          cb(null, user, token);
        });
      });
    });
  });
};

UserSchema.methods.setAuthToken = function (cb) {
  var user = this;
  crypto.randomBytes(48, function(err, buf) {
    if (err) return cb(err);
    var token = buf.toString('hex');
    Auth.remove({user: user._id}, function(err, removed) {
      Auth.create({token: token, user: user}, function(err, auth) {
        cb(null, user, auth.token);
      });
    });
  });
};

UserSchema.statics.verifyEmail = function(authToken, cb) {
  var self = this;
  self.findAuthToken(authToken, function(err, auth) {
    if (!auth) return cb("Invalid email authentication");
    if (err) return cb(err);
    var user = auth.user;

    user.isAuthenticated = true;
    Auth.remove({user: user._id}, function(err, removed) {
      user.save(function(err) {
        if (err) return cb(err);
        cb(null, user);
      });
    });
  });
};

UserSchema.statics.verifyReset = function(data, cb) {
  var self = this;
  var authToken = data.authToken;
  var password = data.password;
  if (!password) return cb('Password required');
  if (password !== data.confirm) return cb("Passwords don't match");

  self.findAuthToken(authToken, function(err, auth) {
    if (!auth) return cb("Invalid authentication token");
    if (err) return cb(err);
    var user = auth.user;

    Auth.remove({user: user._id}, function(err, removed) {
      user.setPassword(password, function(err, user) {
        user.save(function(err, user) {
          if (err) return cb(err);
          cb(null, user);
        });
      });
    });
  });
};

UserSchema.statics.findAuthToken = function(authToken, cb) {
  var query = Auth.findOne({token: authToken});
  query.populate('user');

  if (cb) query.exec(cb);
  else return query;
};

export default mongoose.model('User', UserSchema);
