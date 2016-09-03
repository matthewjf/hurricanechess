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
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

// INSTANCE METHODS
GameSchema.methods.isEmpty = () => {
  return !(this.white || this.black);
};

GameSchema.methods.isFull = () => {
  return (this.white && this.black);
};

GameSchema.methods.isInGame = (user) => {
  return user.equals(this.white) || user.equals(this.black);
};

GameSchema.methods.join = (user, color, callback) => {
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

GameSchema.methods.leave = (user, callback) => {
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

GameSchema.methods.isRemovable = () => {
  return (this.isEmpty() && (this.status === 'waiting' || this.status === 'starting'));
};

GameSchema.methods.isStartable = () => {
  return (this.isFull() && (this.status === 'waiting'));
};

GameSchema.methods.isActivatable = () => {
  return (this.isFull() && (this.status === 'starting'));
};

GameSchema.methods.isUnstartable = () => {
  return (!this.isFull() && (this.status === 'starting'));
};

GameSchema.methods.activate = () => {
  if (this.isActivatable()) {
    this.status = 'active';
    return this.save();
  } else {
    return false;
  }
};

GameSchema.methods.players = () => {
  return [this.white, this.black];
};

var timeouts = {};

// TRANSACTION CALLBACKS
var clearTimeouts = (id) =>  {
  clearTimeout(timeouts[id]);
};

var delayedRemove = (id) => {
  clearTimeouts(id);
  timeouts[id] = setTimeout(() => {
    console.log("inside remove timeout");
    // TODO: store a ref and clear callback if someone joins
    Game.findById(id, (_, game) => {
      if (game && game.isRemovable()) {
        console.log("game is empty, removing it");
        game.remove().then((game) => {
          console.log("removed");
        });
      }
    });
  }, 10000);
};

var delayedActivate = (id) => {
  clearTimeouts(id);
  timeouts[id] = setTimeout(() => {
    console.log("inside activate timeout");
    Game.findById(id, (_, game) => {
      if (game && game.isActivatable()) {
        game.activate().then((game) => {
          // start game in redis
          console.log("removed");
        });
      }
    });
  }, 10000);
};

GameSchema.pre('save', (next) => {
  console.log("pre save - is empty? ", this.isEmpty());
  if (this.isStartable()) {
    this.status = 'starting';
    delayedActivate(this._id);
  }
  if (this.isRemovable()) {
    console.log("setting a timeout");
    delayedRemove(this._id);
  }
  if (this.isUnstartable()) {
    this.status = 'waiting';
  }
  next();
});

GameSchema.post('save', (game, next) => {
  io.to('index').emit('game', {game: game});
  io.to(game._id).emit('game', {game: game});
  next();
});

GameSchema.post('remove', (game, next) => {
  io.to('index').emit('remove', {game: game});
});

var Game = mongoose.model('Game', GameSchema);
module.exports = Game;
