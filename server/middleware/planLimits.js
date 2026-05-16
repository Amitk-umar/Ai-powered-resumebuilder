const { getActivePlan } = require('../config/plans');
const ApiError = require('../utils/ApiError');

// Middleware to check if user has reached their resume limit
const checkResumeLimit = (req, res, next) => {
  const plan = getActivePlan(req.user);
  const currentResumes = req.user.resumes ? req.user.resumes.length : 0;
  
  if (currentResumes >= plan.maxResumes) {
    return next(new ApiError(403, `Resume limit reached. Upgrade to ${plan.name === 'basic' ? 'Pro' : 'Premium'} to create more resumes.`));
  }
  next();
};

// Middleware to check if user has reached their ATS scan limit
const checkAtsLimit = (req, res, next) => {
  const plan = getActivePlan(req.user);
  const currentScans = req.user.screeningsCount || 0;
  
  if (currentScans >= plan.maxAtsScans) {
    return next(new ApiError(403, `ATS Scan limit reached. Upgrade to ${plan.name === 'basic' ? 'Pro' : 'Premium'} to scan more resumes.`));
  }
  next();
};

// General middleware to require at least a Pro plan
const requireProPlan = (req, res, next) => {
  const plan = getActivePlan(req.user);
  if (plan.name === 'basic') {
    return next(new ApiError(403, 'This feature requires a Pro or Premium plan.'));
  }
  next();
};

// General middleware to require a Premium plan
const requirePremiumPlan = (req, res, next) => {
  const plan = getActivePlan(req.user);
  if (plan.name !== 'premium') {
    return next(new ApiError(403, 'This feature requires the Premium plan.'));
  }
  next();
};

module.exports = {
  checkResumeLimit,
  checkAtsLimit,
  requireProPlan,
  requirePremiumPlan
};
