const Resume = require('../models/Resume');
const User = require('../models/User');
const { getActivePlan } = require('../config/plans');

const planDateFilter = (planName) => {
  const now = new Date();
  if (planName === 'pro') {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    return { createdAt: { $gte: weekStart } };
  }
  if (planName === 'premium') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return { createdAt: { $gte: monthStart } };
  }
  return {};
};

const planLimit = (planName) => {
  if (planName === 'pro') return 3;
  if (planName === 'premium') return 20;
  return 3;
};

// GET /api/resumes — list user's resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.uid })
      .sort({ updatedAt: -1 })
      .select('-__v');
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/resumes/:id — get single resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/resumes — create resume
exports.createResume = async (req, res) => {
  try {
    const { title, template, personalInfo, education, experience, skills, projects } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const plan = getActivePlan(user);
    const count = await Resume.countDocuments({
      userId: req.user.uid,
      ...planDateFilter(plan.name)
    });

    if (count >= planLimit(plan.name)) {
      return res.status(403).json({
        error: `Your ${plan.label} plan allows ${plan.resumeLimitText}. Please upgrade or wait for the limit to reset.`
      });
    }

    if (!plan.templates.includes(template || 'Modern')) {
      return res.status(403).json({
        error: `${template} is not available in your ${plan.label} plan.`
      });
    }

    const resume = await Resume.create({
      userId: req.user.uid,
      title: title || 'Untitled Resume',
      template: template || 'Modern',
      personalInfo,
      education,
      experience,
      skills,
      projects
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/resumes/:id — update resume
exports.updateResume = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const plan = getActivePlan(user);
    if (req.body.template && !plan.templates.includes(req.body.template)) {
      return res.status(403).json({
        error: `${req.body.template} is not available in your ${plan.label} plan.`
      });
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/resumes/:id — delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
