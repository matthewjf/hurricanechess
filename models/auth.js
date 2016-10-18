import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var AuthSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User required'],
    unique: true
  },
  token: {
    type: String,
    required: [true, 'Token required'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AuthSchema.index({createdAt: 1}, {expireAfterSeconds: 60 * 60 * 24});

var Auth = mongoose.model('Auth', AuthSchema);

export default Auth;
