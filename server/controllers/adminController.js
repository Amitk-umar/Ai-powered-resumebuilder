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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const timeSeriesPipeline = [
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];

  const [
    users,
    contacts,
    planRequests,
    resumesThisMonth,
    totalScreenings,
    topSkillsAggregation,
    usersTimeSeries,
    resumesTimeSeries,
    screeningsTimeSeries
  ] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select('-__v'),
    Contact.find().sort({ createdAt: -1 }).limit(50),
    PlanRequest.find().sort({ createdAt: -1 }).limit(50),
    Resume.countDocuments({ createdAt: { $gte: monthStart } }),
    Screening.countDocuments(),
    Screening.aggregate([
      { $project: { allKeywords: { $concatArrays: [{ $ifNull: ["$matchedKeywords", []] }, { $ifNull: ["$missingKeywords", []] }] } } },
      { $unwind: "$allKeywords" },
      { $group: { _id: "$allKeywords", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    User.aggregate(timeSeriesPipeline),
    Resume.aggregate(timeSeriesPipeline),
    Screening.aggregate(timeSeriesPipeline)
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

  const timeSeriesData = [];
  for (let offsetDays = 0; offsetDays <= 30; offsetDays++) {
    const currentDate = new Date(thirtyDaysAgo);
    currentDate.setDate(currentDate.getDate() + offsetDays);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    timeSeriesData.push({
      date: dateStr,
      users: usersTimeSeries.find(series => series._id === dateStr)?.count || 0,
      resumes: resumesTimeSeries.find(series => series._id === dateStr)?.count || 0,
      screenings: screeningsTimeSeries.find(series => series._id === dateStr)?.count || 0,
    });
  }

  res.json({
    stats: {
      users: users.length,
      activeUsers,
      resumesThisMonth,
      screeningsCount: totalScreenings,
      contacts: contacts.length,
      pendingRequests: planRequests.filter((req) => req.status === 'pending').length,
    },
    planCounts,
    topSkills: topSkillsAggregation.map(skillGroup => ({ skill: skillGroup._id, count: skillGroup.count })),
    timeSeriesData,
    users,
    contacts,
    requests: planRequests,
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
