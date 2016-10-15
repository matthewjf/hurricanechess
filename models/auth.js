import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var AuthSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true,
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
