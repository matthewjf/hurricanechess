var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
  name:     { type: String,  required: true, minlength: 6,      index: true },
  private:  { type: Boolean,                 default: false                 },
  password: { type: String                                                  },
  white:    { type: Schema.Types.ObjectId, ref: 'User' },
  black:    { type: Schema.Types.ObjectId, ref: 'User' },
  status:   { type: String,  required: true, default: 'waiting', enum: ['waiting', 'starting', 'active', 'archived'] }
}, {timestamps: true});

Game.methods.isEmpty = function(){
  return !(this.white || this.black);
};

Game.methods.isFull = function(){
  return (this.white && this.black);
};

Game.methods.join = function(user, color, successCB, errorCB){
  color = color || 'white';
};

Game.pre('save', function(next) {
  if (this.isEmpty)
    this.remove();
  next();
});

module.exports = mongoose.model('Game', Game);
