// tokenModel.js

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  username: {
    type: String,
    required: true
  },

  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;