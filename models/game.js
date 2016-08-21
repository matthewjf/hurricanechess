var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  name:     { type: String,  required: true, minlength: 6,      index: true },
  private:  { type: Boolean,                 default: false                 },
  password: { type: String                                                  },
  created:  { type: Date,    required: true, default: Date.now              },
  whiteId:  { type: Number,                                     index: true },
  blackId:  { type: Number,                                     index: true }
});

module.exports = mongoose.model('User', userSchema);
