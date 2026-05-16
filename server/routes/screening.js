const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { checkAtsLimit } = require('../middleware/planLimits');
const { uploadMiddleware, screenResume } = require('../controllers/screeningController');

// POST /api/screen — upload resume + job description for AI analysis
router.post('/', authMiddleware, checkAtsLimit, uploadMiddleware, screenResume);

module.exports = router;
