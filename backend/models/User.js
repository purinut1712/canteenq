const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  password: {
    type: String, 
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'shop'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;