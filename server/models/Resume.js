const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  template: {
    type: String,
    enum: ['Modern', 'Professional', 'Minimal'],
    default: 'Modern'
  },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    description: String
  }],
  skills: {
    technical: { type: String, default: '' },
    soft: { type: String, default: '' },
    languages: { type: String, default: '' },
    tools: { type: String, default: '' }
  },
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
