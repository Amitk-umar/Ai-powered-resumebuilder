const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { getDashboard, handlePlanRequest, markContactRead } = require('../controllers/adminController');

router.use(authMiddleware, adminOnly);

router.get('/dashboard', getDashboard);
router.patch('/plan-requests/:id', handlePlanRequest);
router.patch('/contacts/:id/read', markContactRead);

module.exports = router;
