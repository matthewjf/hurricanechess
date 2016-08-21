var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
  username: String,
  passwordDigest: String
});

module.exports = mongoose.model('User', userSchema);
