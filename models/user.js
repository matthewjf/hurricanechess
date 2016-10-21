var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');
var crypto = require('crypto');
import Auth from './auth';

var UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    minlength: [4, 'Username must be at least 4 characters'],
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    index: {unique: true}
  }
}, {timestamps: true});

UserSchema.plugin(passportLocalMongooseEmail);

UserSchema.add({hash: { type: String, required: [true, 'Password required'] } });

UserSchema.statics.register = function(user, password, cb) {
  if (!(user instanceof this)) user = new this(user);

  var self = this;
  self.findByUsername(user.username, function(err, existingUser) {
    if (err) return cb(err);
    if (existingUser) return cb({errors: {username: {message: 'Username taken'}}});

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

UserSchema.methods.setPassword = function (password, cb) {
  var self = this;

  crypto.randomBytes(32, function(err, buf) {
    if (err) return cb(err);
    var salt = buf.toString('hex');
    if (password) {
      crypto.pbkdf2(password, salt, 25000, 512, 'SHA1', function(err, hashRaw) {
        if (err) return cb(err);
        self.set('hash', new Buffer(hashRaw, 'binary').toString('hex'));
        self.set('salt', salt);

        cb(null, self);
      });
    } else {
      cb(null, self);
    }
  });
};

export default mongoose.model('User', UserSchema);
