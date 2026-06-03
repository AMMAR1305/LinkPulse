const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Please add the original URL'],
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true, // Allows null/missing values but ensures uniqueness if present
  },
  clicks: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'disabled'],
    default: 'active',
  },
  expiresAt: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', urlSchema);
