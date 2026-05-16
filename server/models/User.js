const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'recruiter', 'admin'],
    default: 'user'
  },
  plan: {
    name: {
      type: String,
      enum: ['basic', 'pro', 'premium'],
      default: 'basic'
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'canceled', 'past_due', 'unpaid'],
      default: 'active'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  stripePriceId: {
    type: String,
    default: null
  },
  resumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }],
  screeningsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
