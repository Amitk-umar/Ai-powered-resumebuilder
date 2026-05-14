const User = require('../models/User');
const Resume = require('../models/Resume');
const Contact = require('../models/Contact');
const Screening = require('../models/Screening');
const PlanRequest = require('../models/PlanRequest');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/** GET /api/admin/dashboard — aggregated stats for the admin panel. */
exports.getDashboard = asyncHandler(async (_req, res) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [users, contacts, requests, resumesThisMonth, screeningsCount] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select('-__v'),
    Contact.find().sort({ createdAt: -1 }).limit(50),
    PlanRequest.find().sort({ createdAt: -1 }).limit(50),
    Resume.countDocuments({ createdAt: { $gte: monthStart } }),
    Screening.countDocuments(),
  ]);

  const planCounts = users.reduce((acc, user) => {
    const planName = user.plan?.name || 'basic';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {});

  const activeUsers = users.filter((user) => {
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
      pendingRequests: requests.filter((r) => r.status === 'pending').length,
    },
    planCounts,
    users,
    contacts,
    requests,
  });
});

/** PATCH /api/admin/plan-requests/:id — approve or reject a plan upgrade. */
exports.handlePlanRequest = asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!['approved', 'rejected'].includes(action)) {
    throw new ApiError(400, 'Invalid action');
  }

  const request = await PlanRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Request not found');

  request.status = action;
  request.approvedAt = action === 'approved' ? new Date() : null;
  await request.save();

  // If approved, activate the plan on the user record
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
            expiresAt,
          },
        },
      },
    );
  }

  res.json(request);
});

/** PATCH /api/admin/contacts/:id/read — mark a contact message as read. */
exports.markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: 'read' },
    { new: true },
  );
  if (!contact) throw new ApiError(404, 'Contact not found');

  res.json(contact);
});
