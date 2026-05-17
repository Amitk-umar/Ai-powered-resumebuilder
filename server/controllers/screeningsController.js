const Screening = require('../models/Screening');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/** GET /api/screenings — list the user's screening history. */
exports.getScreenings = asyncHandler(async (req, res) => {
  const screenings = await Screening.find({ userId: req.user.uid })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('-__v');
  res.json(screenings);
});

/** POST /api/screenings — persist a new screening result. */
exports.saveScreening = asyncHandler(async (req, res) => {
  const {
    fileName, score,
    matchedKeywords, missingKeywords,
    matchedCount, missingCount,
    analysis, careerGuidance, jobRecommendations, formatting
  } = req.body;

  const screening = await Screening.create({
    userId: req.user.uid,
    fileName,
    score,
    matchedKeywords: matchedKeywords || [],
    missingKeywords: missingKeywords || [],
    matchedCount: matchedCount || 0,
    missingCount: missingCount || 0,
    analysis: analysis || {},
    careerGuidance: careerGuidance || {},
    jobRecommendations: jobRecommendations || [],
    formatting: formatting || { score: 0, issues: [] },
  });

  // Increment user's screenings count
  const User = require('../models/User');
  await User.findOneAndUpdate(
    { firebaseUid: req.user.uid },
    { $inc: { screeningsCount: 1 } }
  );

  res.status(201).json(screening);
});

/** DELETE /api/screenings/:id — remove a single screening. */
exports.deleteScreening = asyncHandler(async (req, res) => {
  const screening = await Screening.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.uid,
  });
  if (!screening) throw new ApiError(404, 'Not found');

  res.json({ success: true });
});
