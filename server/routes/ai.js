const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { authMiddleware } = require('../middleware/auth');
const { requireProPlan } = require('../middleware/planLimits');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Rewrite Text (Pro/Premium only)
router.post('/rewrite', authMiddleware, requireProPlan, asyncHandler(async (req, res) => {
  const { text, tone } = req.body;
  if (!text) {
    throw new ApiError(400, 'Text is required for rewriting');
  }

  const rewrittenText = await aiService.rewriteText(text, tone);
  res.json({ success: true, text: rewrittenText });
}));

module.exports = router;
