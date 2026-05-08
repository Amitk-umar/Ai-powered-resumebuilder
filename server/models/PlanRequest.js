const mongoose = require('mongoose');

const planRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  requestedPlan: {
    type: String,
    enum: ['pro', 'premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanRequest', planRequestSchema);
