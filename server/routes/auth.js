const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { googleAuth, getMe } = require('../controllers/authController');

// POST /api/auth/google — sync Firebase user with MongoDB
router.post('/google', authMiddleware, googleAuth);

// GET /api/auth/me — get current user profile
router.get('/me', authMiddleware, getMe);

module.exports = router;
