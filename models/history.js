import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var MoveHistorySchema = new Schema({
  game:  { type: Schema.Types.ObjectId, ref: 'Game', require: true },
  moves: [{
    pieceId:   { type: Number, required: true, min: 0, max: 31 },
    pieceType: { type: Number, required: true, min: 0, max: 5  },
    positionId:{ type: Number, required: true, min: 0, max: 63 },
    removeId:  { type: Number,                 min: 0, max: 31 },
    createdAt: { type: Date,   required: true                  }
  }]
});

var MoveHistory = mongoose.model('History', MoveHistorySchema);
module.exports = MoveHistory;
