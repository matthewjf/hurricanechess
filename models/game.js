import io from '../config/socketio';
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var Game = new Schema({
  name:     { type: String,  required: true, minlength: 6,      index: true },
  private:  { type: Boolean,                 default: false                 },
  password: { type: String                                                  },
  white:    { type: Schema.Types.ObjectId, ref: 'User' },
  black:    { type: Schema.Types.ObjectId, ref: 'User' },
  status:   { type: String,  required: true, default: 'waiting', enum: ['waiting', 'starting', 'active', 'archived'] }
}, {timestamps: true});

// SERIALIZE WITHOUT PASSWORD
Game.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

// INSTANCE METHODS
Game.methods.isEmpty = function(){
  return !(this.white || this.black);
};

Game.methods.isFull = function(){
  return (this.white && this.black);
};

Game.methods.isInGame = function(user) {
  return user.equals(this.white) || user.equals(this.black);
};

Game.methods.join = function(user, color, callback){
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

Game.methods.leave = function(user, callback){
  if (this.status === 'waiting' || this.status == 'starting') {
    if (user.equals(this.white))
      this.white = undefined;
    if (user.equals(this.black))
      this.black = undefined;
    this.save(callback);
  } else {
    callback({error: "can't leave game"}, this);
  }
};

Game.methods.players = function(){
  return [this.white, this.black];
};

// TRANSACTION CALLBACKS
Game.post('save', function(game, next) {
  console.log("post save - is empty? ", game.isEmpty());
  // wait 10 secs to allow reconnection
  setTimeout(function() {
    if (game.isEmpty() && (game.status === 'waiting' || game.status === 'starting')) {
      console.log("game is empty, removing it");
      game.remove().then(function(game){
        console.log("removed");
        io.to('index').emit('remove', {game: game});
      });
    }
  }, 10000);
  next();
});

Game.post('save', function(game, next){
  io.to('index').emit('game', {game: game});
  io.to(game._id).emit('game', {game: game});
  next();
});

Game.post('remove', function(game, next){
  io.to('index').emit('remove', {game: game});
});

module.exports = mongoose.model('Game', Game);
