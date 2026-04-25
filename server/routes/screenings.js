const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Screening = require('../models/Screening');

// All routes require auth
router.use(authMiddleware);

// GET /api/screenings — list user's screening history
router.get('/', async (req, res) => {
  try {
    const screenings = await Screening.find({ userId: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v');
    res.json(screenings);
  } catch (error) {
    console.error('Get screenings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/screenings — save a screening result
router.post('/', async (req, res) => {
  try {
    const { fileName, score, matchedKeywords, missingKeywords,
            matchedCount, missingCount, suggestions, formatting } = req.body;

    const screening = await Screening.create({
      userId: req.user.uid,
      fileName,
      score,
      matchedKeywords: matchedKeywords || [],
      missingKeywords: missingKeywords || [],
      matchedCount: matchedCount || 0,
      missingCount: missingCount || 0,
      suggestions: suggestions || [],
      formatting: formatting || { score: 0, issues: [] }
    });

    res.status(201).json(screening);
  } catch (error) {
    console.error('Save screening error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/screenings/:id — delete a screening
router.delete('/:id', async (req, res) => {
  try {
    const screening = await Screening.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });
    if (!screening) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete screening error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
