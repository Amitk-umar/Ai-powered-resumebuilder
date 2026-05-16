const multer = require('multer');
const aiServiceInstance = require('../services/aiService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Multer config — accept PDF and DOCX up to 5 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  },
});

exports.uploadMiddleware = upload.single('resume');

/** POST /api/screen — analyse a resume against a job description. */
exports.screenResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No resume file uploaded');

  const { jobDescription } = req.body;
  if (!jobDescription?.trim()) throw new ApiError(400, 'Job description is required');

  // Prefer the pre-extracted text sent by the client (already extracted via pdfjs-dist)
  let resumeText = req.body.resumeText || '';

  // Fall back to server-side extraction only if client didn't send text
  if (!resumeText.trim()) {
    try {
      if (req.file.mimetype === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const parse = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default || pdfParse.PDFParse);
        const data = await parse(req.file.buffer);
        resumeText = data.text || '';
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    } catch (extractErr) {
      console.error('Server-side PDF extraction failed:', extractErr.message);
    }
  }

  if (!resumeText.trim()) {
    throw new ApiError(400,
      "Could not extract text from the resume. Please ensure it's a text-based PDF (not scanned image)."
    );
  }

  try {
    const results = await aiServiceInstance.analyzeResumeVsJD(resumeText, jobDescription);
    res.json(results);
  } catch (aiErr) {
    console.error('AI analysis failed:', aiErr.message);
    throw new ApiError(500, 'AI analysis failed: ' + aiErr.message);
  }
});
