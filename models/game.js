var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
  name:     { type: String,  required: true, minlength: 6,      index: true },
  private:  { type: Boolean,                 default: false                 },
  password: { type: String                                                  },
  created:  { type: Date,    required: true, default: Date.now              },
  white:    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  black:    {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Game', Game);
