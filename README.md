# ResumeAI — AI Resume Screening & Building Platform

A full-stack MERN application for AI-powered resume screening and building with a premium glassmorphism UI.

## Features

- 🤖 **AI Resume Screening** — Upload resumes and get instant ATS compatibility scores
- 📝 **Smart Resume Builder** — Multi-step form with live preview and 3 ATS-friendly templates
- 📊 **Score Analysis** — Keyword matching, missing skills, and improvement suggestions
- 🎨 **Premium UI** — Glassmorphism, radial gradients, animated orbs, smooth transitions
- 🌓 **Dark/Light Mode** — Theme toggle with localStorage persistence
- 🔐 **Google Auth** — Firebase Authentication with Google Sign-In
- 📄 **PDF Export** — Download resumes as professionally formatted PDFs
- 👤 **Role-Based Access** — Screening for admin/recruiters, builder for all users

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, React Router |
| Styling | Vanilla CSS with glassmorphism & gradients |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | Firebase Authentication (Google) |
| AI | Custom keyword matching & ATS scoring engine |
| PDF | html2pdf.js (client-side export) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Firebase Project with Google Auth enabled

### 1. Clone & Install

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 2. Configure Environment

**Client** — Create `client/.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
```

**Server** — Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumebuilder
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open http://localhost:5173

## Project Structure

```
resumebuilder/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Navbar, ThemeToggle, FloatingOrbs, ProtectedRoute
│   │   ├── config/          # Firebase configuration
│   │   ├── context/         # ThemeContext, AuthContext
│   │   ├── pages/           # Home, Login, Signup, Dashboard, ResumeBuilder, ResumeScreener
│   │   ├── App.jsx          # Main app with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Design system (tokens, glassmorphism, animations)
│   └── package.json
│
└── server/                  # Express Backend
    ├── config/              # DB connection, Firebase Admin
    ├── controllers/         # Auth, Resume, Screening handlers
    ├── middleware/           # JWT auth, role checking
    ├── models/              # User, Resume schemas
    ├── routes/              # API endpoints
    ├── services/            # AI Screener engine
    ├── server.js            # Entry point
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/google` | Sync Firebase user | Yes |
| GET | `/api/auth/me` | Get user profile | Yes |
| GET | `/api/resumes` | List user's resumes | Yes |
| POST | `/api/resumes` | Create resume | Yes |
| PUT | `/api/resumes/:id` | Update resume | Yes |
| DELETE | `/api/resumes/:id` | Delete resume | Yes |
| POST | `/api/screen` | Screen resume (file upload) | Admin |
| GET | `/api/health` | Health check | No |
