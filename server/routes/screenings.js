const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getScreenings, saveScreening, deleteScreening } = require('../controllers/screeningsController');

router.use(authMiddleware);

router.get('/', getScreenings);
router.post('/', saveScreening);
router.delete('/:id', deleteScreening);

module.exports = router;
