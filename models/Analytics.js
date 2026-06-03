const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  browser: {
    type: String,
    default: 'Other',
  },
  device: {
    type: String,
    default: 'Unknown',
  },
  ipAddress: {
    type: String,
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
