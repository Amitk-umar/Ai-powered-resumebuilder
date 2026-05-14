require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initFirebaseAdmin } = require('./config/firebase-admin');
const ApiError = require('./utils/ApiError');

// ── Bootstrap ──────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
initFirebaseAdmin();

// ── Middleware ──────────────────────────────────────────

// CORS — allow known origins + Vercel preview deploys
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server / Postman (no origin) and known origins
    if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    console.warn(`CORS blocked request from: ${origin}`);
    callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resume'));
app.use('/api/screen', require('./routes/screening'));
app.use('/api/screenings', require('./routes/screenings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handling ─────────────────────────────────────

// Global error handler — catches both ApiError and unexpected errors
app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
