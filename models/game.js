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

Game.methods.isInGame = function(user) {
  return this.white === user._id || this.black === user._id;
};

Game.methods.join = function(user, color, callback){
  console.log("trying to join");
  if (this.isInGame(user)) {
    callback(null, this);
  } else if (this.isEmpty) {
    color = color || 'white';
    this[color] = user._id;
  } else if (this.white) {
    this.black = user._id;
  } else {
    this.white = user._id;
  }
  this.save(callback);
};

Game.methods.leave = function(user, callback){
  if (this.white === user._id)
    this.white = undefined;
  if (this.black === user._id)
    this.black = undefined;

  this.save(callback);
};

Game.methods.players = function(){
  return [this.white, this.black];
};

Game.post('save', function(doc, next) {
  console.log("post save - is empty? ", doc.isEmpty());
  // wait 10 secs to allow reconnection
  setTimeout(function() {
    if (doc.isEmpty()) {
      console.log("game is empty, removing");
      doc.remove();
    }
    next();
  }, 10000);
});

module.exports = mongoose.model('Game', Game);
