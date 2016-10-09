import mongoose from 'mongoose';
import io from '../config/socketio';

var Schema = mongoose.Schema;

var MoveHistorySchema = new Schema({
  game:  { type: Schema.Types.ObjectId, ref: 'Game', require: true },
  moves: [String]
});

MoveHistorySchema.post('save', (history, next) => {
  io.to(history.game._id).emit('game-history', history);
  next();
});

var MoveHistory = mongoose.model('History', MoveHistorySchema);

export default MoveHistory;
