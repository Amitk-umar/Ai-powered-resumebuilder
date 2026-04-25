const Resume = require('../models/Resume');

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
