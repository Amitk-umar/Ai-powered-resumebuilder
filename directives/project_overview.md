# Directive: Project Overview — AI-Powered Resume Builder

## Goal
Provide all agents and scripts with a shared understanding of the project's architecture, stack, and conventions.

## Project Summary
A full-stack MERN application that lets users build, manage, and AI-enhance resumes, and run job-screening workflows.

## Tech Stack
| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React + TypeScript (Vite), client/src/  |
| Backend  | Node.js + Express, server/              |
| Database | MongoDB (local dev) / MongoDB Atlas     |
| Auth     | Firebase Authentication + Admin SDK     |
| AI       | Google Gemini API (via server services) |

## Directory Layout
```
resumebuilder/
├── client/          # Vite + React + TS frontend (port 5173)
│   └── src/
├── server/          # Express API backend (port 5000)
│   ├── config/      # DB + Firebase Admin init
│   ├── controllers/ # Route handler logic
│   ├── middleware/  # Auth middleware
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express route definitions
│   └── services/    # AI / external-service integrations
├── directives/      # SOPs (this folder)
├── execution/       # Deterministic Python/JS scripts
└── .tmp/            # Ephemeral intermediates — never commit
```

## API Routes (server)
- `POST /api/auth/*`      — Firebase-backed auth
- `GET|POST /api/resumes` — Resume CRUD
- `POST /api/screen`      — AI screening (single)
- `GET  /api/screenings`  — Screening history
- `GET  /api/health`      — Health check

## Environment Variables
| File              | Key variables                                              |
|-------------------|------------------------------------------------------------|
| server/.env       | PORT, MONGODB_URI, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, GEMINI_API_KEY |
| client/.env       | VITE_API_URL, VITE_FIREBASE_* keys                        |

## Dev Commands
```bash
# Backend
cd server && npm run dev     # nodemon, port 5000

# Frontend
cd client && npm run dev     # vite, port 5173
```

## Conventions
- All new server features: controller → route → register in server.js
- All AI calls go through `server/services/`
- Never commit `.env`, `.tmp/`, `credentials.json`, `token.json`
- Script outputs land in `.tmp/`; deliverables go to cloud (MongoDB Atlas, etc.)

## Edge Cases / Known Issues
- Firebase private key must use `\n` literals in .env string (already done)
- CORS allows all origins in dev — tighten in production
- MongoDB URI must be updated when switching to Atlas
- **Windows console encoding**: Python scripts must set `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')` at the top — Windows cp1252 cannot encode emoji otherwise
- **datetime.utcnow() deprecated** in Python 3.12+: use `datetime.now(timezone.utc)` instead
