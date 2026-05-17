const { getActivePlan } = require('../config/plans');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Middleware to check if user has reached their resume limit
const checkResumeLimit = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return next(new ApiError(404, 'User not found'));
    const plan = getActivePlan(user);
    const Resume = require('../models/Resume');
    const currentResumes = await Resume.countDocuments({ userId: req.user.uid });
    
    if (currentResumes >= plan.maxResumes) {
      return next(new ApiError(403, `Resume limit reached. Upgrade to ${plan.name === 'basic' ? 'Pro' : 'Premium'} to create more resumes.`));
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to check if user has reached their ATS scan limit
const checkAtsLimit = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return next(new ApiError(404, 'User not found'));
    const plan = getActivePlan(user);
    const currentScans = user.screeningsCount || 0;
    
    if (currentScans >= plan.maxAtsScans) {
      return next(new ApiError(403, `ATS Scan limit reached. Upgrade to ${plan.name === 'basic' ? 'Pro' : 'Premium'} to scan more resumes.`));
    }
    next();
  } catch (err) {
    next(err);
  }
};

// General middleware to require at least a Pro plan
const requireProPlan = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return next(new ApiError(404, 'User not found'));
    const plan = getActivePlan(user);
    if (plan.name === 'basic') {
      return next(new ApiError(403, 'This feature requires a Pro or Premium plan.'));
    }
    next();
  } catch (err) {
    next(err);
  }
};

// General middleware to require a Premium plan
const requirePremiumPlan = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return next(new ApiError(404, 'User not found'));
    const plan = getActivePlan(user);
    if (plan.name !== 'premium') {
      return next(new ApiError(403, 'This feature requires the Premium plan.'));
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkResumeLimit,
  checkAtsLimit,
  requireProPlan,
  requirePremiumPlan
};
