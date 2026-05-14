const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/google
 * Syncs a Firebase-authenticated user with the MongoDB user record.
 */
exports.googleAuth = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const firebaseUid = req.user?.uid;

  if (!firebaseUid || !email) {
    throw new ApiError(400, 'Missing required fields');
  }

  const updateData = {
    firebaseUid,
    name: name || email.split('@')[0],
    email,
    avatar: avatar || '',
  };

  // Auto-assign admin role if the email matches the configured admin
  if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    updateData.role = 'admin';
  }

  const user = await User.findOneAndUpdate(
    { $or: [{ firebaseUid }, { email }] },
    { $set: updateData },
    { upsert: true, new: true, runValidators: true },
  );

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      plan: user.plan,
    },
  });
});

/**
 * GET /api/auth/me
 * Returns the current user's profile from MongoDB.
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) throw new ApiError(404, 'User not found');

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    plan: user.plan,
    screeningsCount: user.screeningsCount,
    createdAt: user.createdAt,
  });
});
