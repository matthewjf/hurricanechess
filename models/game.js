import io from '../config/socketio';
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var GameSchema = new Schema({
  name:     { type: String,  required: true, minlength: 6,      index: true },
  private:  { type: Boolean,                 default: false                 },
  password: { type: String                                                  },
  white:    { type: Schema.Types.ObjectId, ref: 'User' },
  black:    { type: Schema.Types.ObjectId, ref: 'User' },
  status:   { type: String,  required: true, default: 'waiting', enum: ['waiting', 'starting', 'active', 'archived'] }
}, {timestamps: true});

// SERIALIZE WITHOUT PASSWORD
GameSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

// INSTANCE METHODS
GameSchema.methods.isEmpty = function(){
  return !(this.white || this.black);
};

GameSchema.methods.isFull = function(){
  return (this.white && this.black);
};

GameSchema.methods.isInGame = function(user) {
  return user.equals(this.white) || user.equals(this.black);
};

GameSchema.methods.join = function(user, color, callback){
  console.log("trying to join a game");
  // var userRef = mongoose.Types.ObjectId(user);
  if (this.isInGame(user)) {

  } else if (this.isEmpty()) {
    if (color === 'white')
      this.white = user;
    else
      this.black = user;
  } else if (this.white) {
    this.black = user;
  } else {
    this.white = user;
  }
  this.save(callback);
};

GameSchema.methods.leave = function(user, callback){
  if (this.status === 'waiting' || this.status == 'starting') {
    if (user.equals(this.white))
      this.white = undefined;
    if (user.equals(this.black))
      this.black = undefined;
    this.save(callback);
  } else {
    callback({errors: "can't leave game"}, this);
  }
};

GameSchema.methods.isRemovable = function(){
  if (this.isEmpty() && (this.status === 'waiting' || this.status === 'starting'))
    return true;
  else
    return false;
};

GameSchema.methods.players = function(){
  return [this.white, this.black];
};

// TRANSACTION CALLBACKS
var timeouts = {};

GameSchema.pre('save', function(next) {
  console.log("post save - is empty? ", this.isEmpty());
  // wait 10 secs to allow reconnection
  if (this.isRemovable()) {
    console.log("setting a timeout");
    setTimeout(function(){
      console.log("inside timeout");
      // TODO: store a ref and clear callback if someone joins
      Game.findById(this._id, function(_, game){
        if (game && game.isRemovable()) {
          console.log("game is empty, removing it");
          game.remove().then(function(game){
            console.log("removed");
            io.to('index').emit('remove', {game: game});
          });
        }
      });
    }.bind(this), 10000);
  }
  next();
});

GameSchema.post('save', function(game, next){
  io.to('index').emit('game', {game: game});
  io.to(game._id).emit('game', {game: game});
  next();
});

GameSchema.post('remove', function(game, next){
  io.to('index').emit('remove', {game: game});
});

var Game = mongoose.model('Game', GameSchema);
module.exports = Game;
