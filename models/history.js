import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var MoveHistorySchema = new Schema({
  game:  { type: Schema.Types.ObjectId, ref: 'Game', require: true },
  moves: [String]
});

var MoveHistory = mongoose.model('History', MoveHistorySchema);
module.exports = MoveHistory;
