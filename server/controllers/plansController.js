const User = require('../models/User');
const PlanRequest = require('../models/PlanRequest');
const Resume = require('../models/Resume');
const { PLANS, getActivePlan } = require('../config/plans');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/** GET /api/plans/me — get the authenticated user's active plan. */
exports.getMyPlan = asyncHandler(async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });
  const plan = getActivePlan(user);
  const pendingRequest = await PlanRequest.findOne({
    userId: req.user.uid,
    status: 'pending',
  }).sort({ createdAt: -1 });

  res.json({ plan, userPlan: user?.plan, pendingRequest });
});

/** POST /api/plans/request — submit an upgrade request. */
exports.requestUpgrade = asyncHandler(async (req, res) => {
  const { requestedPlan } = req.body;
  if (!['pro', 'premium'].includes(requestedPlan)) {
    throw new ApiError(400, 'Choose Pro or Premium plan');
  }

  const user = await User.findOne({ firebaseUid: req.user.uid });
  const existing = await PlanRequest.findOne({
    userId: req.user.uid,
    status: 'pending',
  });
  if (existing) {
    throw new ApiError(409, 'You already have a pending upgrade request');
  }

  const planRequest = await PlanRequest.create({
    userId: req.user.uid,
    userName: user?.name || req.user.name,
    userEmail: user?.email || req.user.email,
    requestedPlan,
  });

  res.status(201).json(planRequest);
});

/** GET /api/plans/companies — skill-matched company suggestions (Premium only). */
exports.getCompanySuggestions = asyncHandler(async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });
  const plan = getActivePlan(user);

  if (!plan.companySuggestions) return res.json([]);

  const latestResume = await Resume.findOne({ userId: req.user.uid }).sort({ updatedAt: -1 });
  const skillText = [
    latestResume?.skills?.technical,
    latestResume?.skills?.tools,
    latestResume?.skills?.soft,
  ].filter(Boolean).join(' ').toLowerCase();

  const companies = [
    { name: 'TCS', role: 'Software Developer', match: 'JavaScript, React, SQL' },
    { name: 'Infosys', role: 'Full Stack Engineer', match: 'React, Node.js, MongoDB' },
    { name: 'Accenture', role: 'Cloud Associate', match: 'AWS, DevOps, Python' },
    { name: 'Deloitte', role: 'Technology Analyst', match: 'SQL, Analytics, Communication' },
    { name: 'Zoho', role: 'Product Engineer', match: 'Java, JavaScript, Problem Solving' },
  ];

  const ranked = companies
    .map((company) => {
      const score = company.match.toLowerCase().split(', ')
        .filter((skill) => skillText.includes(skill.toLowerCase())).length;
      return { ...company, score };
    })
    .sort((a, b) => b.score - a.score);

  res.json(ranked);
});

/** GET /api/plans/all — return all available plans. */
exports.getAllPlans = asyncHandler(async (_req, res) => {
  res.json(PLANS);
});
