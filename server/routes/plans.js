const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const PlanRequest = require('../models/PlanRequest');
const Resume = require('../models/Resume');
const { PLANS, getActivePlan } = require('../config/plans');

router.use(authMiddleware);

router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const plan = getActivePlan(user);
    const pendingRequest = await PlanRequest.findOne({
      userId: req.user.uid,
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.json({
      plan,
      userPlan: user?.plan,
      pendingRequest
    });
  } catch (error) {
    console.error('Plan profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/request', async (req, res) => {
  try {
    const { requestedPlan } = req.body;
    if (!['pro', 'premium'].includes(requestedPlan)) {
      return res.status(400).json({ error: 'Choose Pro or Premium plan' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    const existing = await PlanRequest.findOne({
      userId: req.user.uid,
      status: 'pending'
    });

    if (existing) {
      return res.status(409).json({ error: 'You already have a pending upgrade request' });
    }

    const planRequest = await PlanRequest.create({
      userId: req.user.uid,
      userName: user?.name || req.user.name,
      userEmail: user?.email || req.user.email,
      requestedPlan
    });

    res.status(201).json(planRequest);
  } catch (error) {
    console.error('Plan request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/companies', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const plan = getActivePlan(user);

    if (!plan.companySuggestions) {
      return res.json([]);
    }

    const latestResume = await Resume.findOne({ userId: req.user.uid }).sort({ updatedAt: -1 });
    const skillText = [
      latestResume?.skills?.technical,
      latestResume?.skills?.tools,
      latestResume?.skills?.soft
    ].filter(Boolean).join(' ').toLowerCase();

    const companies = [
      { name: 'TCS', role: 'Software Developer', match: 'JavaScript, React, SQL' },
      { name: 'Infosys', role: 'Full Stack Engineer', match: 'React, Node.js, MongoDB' },
      { name: 'Accenture', role: 'Cloud Associate', match: 'AWS, DevOps, Python' },
      { name: 'Deloitte', role: 'Technology Analyst', match: 'SQL, Analytics, Communication' },
      { name: 'Zoho', role: 'Product Engineer', match: 'Java, JavaScript, Problem Solving' }
    ];

    const ranked = companies
      .map(company => {
        const score = company.match.toLowerCase().split(', ')
          .filter(skill => skillText.includes(skill.toLowerCase())).length;
        return { ...company, score };
      })
      .sort((a, b) => b.score - a.score);

    res.json(ranked);
  } catch (error) {
    console.error('Company suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', (req, res) => {
  res.json(PLANS);
});

module.exports = router;
