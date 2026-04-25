const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getResumes);
router.get('/:id', getResume);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
