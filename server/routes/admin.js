const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Contact = require('../models/Contact');
const Screening = require('../models/Screening');
const PlanRequest = require('../models/PlanRequest');

router.use(authMiddleware, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [users, contacts, requests, resumesThisMonth, screeningsCount] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select('-__v'),
      Contact.find().sort({ createdAt: -1 }).limit(50),
      PlanRequest.find().sort({ createdAt: -1 }).limit(50),
      Resume.countDocuments({ createdAt: { $gte: monthStart } }),
      Screening.countDocuments()
    ]);

    const planCounts = users.reduce((acc, user) => {
      const planName = user.plan?.name || 'basic';
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {});

    const activeUsers = users.filter(user => {
      const date = user.updatedAt || user.createdAt;
      return date && new Date(date) >= monthStart;
    }).length;

    res.json({
      stats: {
        users: users.length,
        activeUsers,
        resumesThisMonth,
        screeningsCount,
        contacts: contacts.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length
      },
      planCounts,
      users,
      contacts,
      requests
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/plan-requests/:id', async (req, res) => {
  try {
    const { action } = req.body;
    const request = await PlanRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    request.status = action;
    request.approvedAt = action === 'approved' ? new Date() : null;
    await request.save();

    if (action === 'approved') {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      await User.findOneAndUpdate(
        { firebaseUid: request.userId },
        {
          $set: {
            plan: {
              name: request.requestedPlan,
              status: 'active',
              startedAt: new Date(),
              expiresAt
            }
          }
        }
      );
    }

    res.json(request);
  } catch (error) {
    console.error('Plan approval error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/contacts/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    console.error('Contact update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
