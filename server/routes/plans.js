const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getMyPlan, requestUpgrade, getCompanySuggestions, getAllPlans } = require('../controllers/plansController');

router.use(authMiddleware);

router.get('/me', getMyPlan);
router.post('/request', requestUpgrade);
router.get('/companies', getCompanySuggestions);
router.get('/all', getAllPlans);

module.exports = router;
