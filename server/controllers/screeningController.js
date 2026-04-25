const multer = require('multer');
const AIScreener = require('../services/aiScreener');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// POST /api/screen — screen resume
exports.uploadMiddleware = upload.single('resume');

exports.screenResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Extract text from PDF
    let resumeText = '';
    if (req.file.mimetype === 'application/pdf') {
      resumeText = await AIScreener.extractText(req.file.buffer);
    } else {
      // For DOCX, use the raw text (simplified)
      resumeText = req.file.buffer.toString('utf-8');
    }

    if (!resumeText.trim()) {
      return res.status(400).json({
        error: 'Could not extract text from the resume. Please ensure it\'s a text-based PDF (not scanned image).'
      });
    }

    // Perform analysis
    const results = AIScreener.analyze(resumeText, jobDescription);

    res.json(results);
  } catch (error) {
    console.error('Screening error:', error);
    res.status(500).json({ error: 'Error analyzing resume. Please try again.' });
  }
};
