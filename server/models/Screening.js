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
  analysis: {
    skills: String,
    education: String,
    experience: String,
    certifications: String,
    projects: String,
    overallQuality: String
  },
  careerGuidance: {
    coachingSuggestions: [String],
    improvementAreas: [String],
    missingSkills: [String],
    enhancementStrategies: [String],
    industryGuidance: String
  },
  jobRecommendations: [{
    company: String,
    role: String,
    opportunity: String,
    jd: String,
    qualifications: [String],
    skills: [String],
    eligibility: String
  }],
  formatting: {
    score: { type: Number, default: 0 },
    issues: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Screening', screeningSchema);
