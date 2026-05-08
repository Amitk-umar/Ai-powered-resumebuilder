const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { uploadMiddleware, screenResume } = require('../controllers/screeningController');

// POST /api/screen — upload resume + job description for AI analysis
router.post('/', authMiddleware, uploadMiddleware, screenResume);

module.exports = router;
