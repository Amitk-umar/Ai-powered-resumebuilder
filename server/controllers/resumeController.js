const Resume = require('../models/Resume');
const User = require('../models/User');
const { getActivePlan } = require('../config/plans');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// ── Helpers ────────────────────────────────────────────

// ── Controllers ────────────────────────────────────────

/** GET /api/resumes — list all resumes for the authenticated user. */
exports.getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.uid })
    .sort({ updatedAt: -1 })
    .select('-__v');
  res.json(resumes);
});

/** GET /api/resumes/:id — fetch a single resume by ID. */
exports.getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user.uid,
  });
  if (!resume) throw new ApiError(404, 'Resume not found');
  res.json(resume);
});

/** POST /api/resumes — create a new resume (enforces plan limits). */
exports.createResume = asyncHandler(async (req, res) => {
  const { title, template, personalInfo, education, experience, skills, projects } = req.body;
  const user = await User.findOne({ firebaseUid: req.user.uid });
  const plan = getActivePlan(user);

  // Quota is now checked by checkResumeLimit middleware

  // Check template access
  const selectedTemplate = template || 'Modern';
  if (!plan.templates.includes(selectedTemplate)) {
    throw new ApiError(403, `${selectedTemplate} is not available in your ${plan.label} plan.`);
  }

  const resume = await Resume.create({
    userId: req.user.uid,
    title: title || 'Untitled Resume',
    template: selectedTemplate,
    personalInfo, education, experience, skills, projects,
  });

  res.status(201).json(resume);
});

/** PUT /api/resumes/:id — update an existing resume. */
exports.updateResume = asyncHandler(async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });
  const plan = getActivePlan(user);

  if (req.body.template && !plan.templates.includes(req.body.template)) {
    throw new ApiError(403, `${req.body.template} is not available in your ${plan.label} plan.`);
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.uid },
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true },
  );
  if (!resume) throw new ApiError(404, 'Resume not found');

  res.json(resume);
});

/** DELETE /api/resumes/:id — permanently delete a resume. */
exports.deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.uid,
  });
  if (!resume) throw new ApiError(404, 'Resume not found');

  res.json({ success: true, message: 'Resume deleted' });
});
