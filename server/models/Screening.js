const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  matchedKeywords: [String],
  missingKeywords: [String],
  matchedCount: {
    type: Number,
    default: 0
  },
  missingCount: {
    type: Number,
    default: 0
  },
  suggestions: [String],
  formatting: {
    score: { type: Number, default: 0 },
    issues: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Screening', screeningSchema);
