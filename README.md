<div align="center">

# ✦ ResumeAI

### _Build Smarter. Get Hired Faster._

**The open-source, AI-powered resume platform that helps you craft ATS-beating resumes and land your dream job.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/Amitk-umar/Ai-powered-resumebuilder/issues) · [Request Feature](https://github.com/Amitk-umar/Ai-powered-resumebuilder/issues)

</div>

---

## 🎯 The Problem

> **75% of resumes never reach a human recruiter.** They get rejected by Applicant Tracking Systems (ATS) before anyone even reads them.

Most job seekers don't realize their resume formatting, keyword gaps, and structure are silently killing their chances. Generic resume builders don't solve this — they just give you a pretty template without any intelligence behind it.

## 💡 The Solution

**ResumeAI** combines a beautiful resume builder with an AI-powered ATS screening engine. Instead of guessing whether your resume will pass the ATS, you can **test it before you apply**.

- 📝 Build your resume with 7 professional templates — each designed for different career levels
- 🤖 Upload any resume + paste a job description → get an instant ATS compatibility score
- 🎯 See exactly which keywords you're missing and get actionable suggestions
- 📊 Track all your screenings and resumes from a personal dashboard

**This isn't just another resume builder. It's your personal career intelligence platform.**

---

## ✨ Features

### 👤 User Features
| Feature | Description |
|---|---|
| **Google & Email Auth** | One-click Google sign-in or classic email/password registration |
| **Personal Dashboard** | Track resumes, screening history, plan status, and activity |
| **Multi-Resume Management** | Create, edit, delete, and organize multiple resumes |
| **PDF Export** | One-click download to print-ready PDF format |
| **Screening History** | Every ATS analysis saved and accessible anytime |
| **Plan Upgrades** | Request Pro/Premium upgrades directly from dashboard |

### 🤖 AI & Analysis Features
| Feature | Description |
|---|---|
| **ATS Resume Screening** | Upload PDF + job description → instant compatibility score |
| **80+ Keyword Patterns** | Matches against programming languages, frameworks, tools, soft skills |
| **Formatting Analysis** | Checks sections, contact info, action verbs, quantifiable achievements |
| **Smart Scoring** | Weighted algorithm: 70% keyword match + 30% formatting quality |
| **Actionable Suggestions** | Up to 6 tailored recommendations to improve your resume |
| **Company Matching** | Premium users get skill-matched company suggestions |

### 🎨 UI/UX Features
| Feature | Description |
|---|---|
| **Dark-First Design** | Premium glassmorphism with aurora gradients |
| **Framer Motion** | Smooth page transitions and micro-interactions |
| **Responsive Layout** | Pixel-perfect on mobile, tablet, and desktop |
| **7 Resume Templates** | Modern, Professional, Minimal, Creative, Executive, ATS Focused, Technical |
| **Live Preview** | Real-time resume preview as you type |
| **Floating Orbs** | Animated background particles for visual depth |

### 🔒 Security Features
| Feature | Description |
|---|---|
| **Firebase Token Verification** | Server-side ID token validation via Admin SDK |
| **Protected Routes** | Client-side guards + server middleware for every endpoint |
| **Role-Based Access** | User, Recruiter, Admin roles with granular permissions |
| **CORS Protection** | Whitelist-based origin validation |
| **Input Validation** | Server-side validation on all endpoints |
| **Secure File Upload** | Type-restricted (PDF/DOCX), size-limited (5MB) uploads |

### 🛠️ Developer Features
| Feature | Description |
|---|---|
| **Modular Architecture** | Clean MVC pattern with separated concerns |
| **Centralized API Client** | Auto-auth-injecting fetch wrapper |
| **Custom Error Handling** | `ApiError` class + `asyncHandler` pattern |
| **Hot Reload** | Vite HMR (frontend) + Nodemon (backend) |
| **Component Library** | 12 modular home page sections, reusable UI components |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Vite 8** | Lightning-fast build tool & dev server |
| **React Router 7** | Client-side routing with guards |
| **Framer Motion** | Animations & page transitions |
| **Lucide + React Icons** | Beautiful icon libraries |
| **Tailwind CSS** (CDN) | Utility-first styling |
| **html2pdf.js** | Client-side PDF generation |
| **pdfjs-dist** | PDF rendering in browser |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | Fast, minimalist web framework |
| **Mongoose 9** | Elegant MongoDB object modeling |
| **Firebase Admin 13** | Server-side token verification |
| **Multer 2** | Multipart file upload handling |
| **pdf-parse** | PDF text extraction for screening |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT utilities |

### Infrastructure
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted database |
| **Firebase** | Authentication provider |
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |

---

## 🏛️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                   │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │  Context   │  │  Services    │  │
│  │          │  │          │  │            │  │              │  │
│  │ Home     │  │ Navbar   │  │ AuthCtx    │  │ api.js       │  │
│  │ Dashboard│  │ Protected│  │ ThemeCtx   │  │ (auto-auth   │  │
│  │ Builder  │  │ Route    │  │            │  │  fetch)      │  │
│  │ Screener │  │ Orbs     │  │            │  │              │  │
│  │ Admin    │  │ 12 Home  │  │            │  │              │  │
│  │ Auth     │  │ Sections │  │            │  │              │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────┬───────┘  │
│                                                     │          │
└─────────────────────────────────────────────────────┼──────────┘
                                                      │ HTTPS
┌─────────────────────────────────────────────────────┼──────────┐
│                      SERVER (Express 5)             │          │
│                                                     ▼          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│  │ Middleware  │  │ Controllers │  │     Services         │    │
│  │            │  │             │  │                      │    │
│  │ auth.js    │──▶ authCtrl    │  │ aiScreener.js        │    │
│  │ (Firebase  │  │ resumeCtrl  │  │ (keyword matching,   │    │
│  │  verify)   │  │ screenCtrl  │  │  format analysis,    │    │
│  │            │  │ adminCtrl   │  │  scoring engine)     │    │
│  │            │  │ plansCtrl   │  │                      │    │
│  └────────────┘  └──────┬──────┘  └──────────────────────┘    │
│                         │                                      │
│                         ▼                                      │
│               ┌──────────────────┐                             │
│               │   MongoDB Atlas  │                             │
│               │                  │                             │
│               │ Users, Resumes,  │                             │
│               │ Screenings,      │                             │
│               │ Contacts, Plans  │                             │
│               └──────────────────┘                             │
└────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User clicks "Sign In" ──▶ Firebase Auth (Google/Email)
                                    │
                                    ▼
                          Get Firebase ID Token
                                    │
                                    ▼
                    POST /api/auth/google (Bearer token)
                                    │
                                    ▼
                      Firebase Admin verifies token
                                    │
                                    ▼
                    Upsert user in MongoDB (auto-admin if email matches)
                                    │
                                    ▼
                         Return user profile + plan info
```

### AI Screening Workflow

```
User uploads PDF + pastes Job Description
            │
            ▼
    pdf-parse extracts text from resume
            │
            ▼
    AIScreener.extractKeywords() scans JD for 80+ patterns
            │
            ▼
    Match keywords against resume text
            │
            ▼
    Analyze formatting (sections, contact, verbs, metrics)
            │
            ▼
    Score = (keywordMatch × 0.70) + (formatting × 0.30)
            │
            ▼
    Return: score, matched/missing keywords, suggestions, formatting issues
```

---

## 📁 Folder Structure

```
resumebuilder/
│
├── client/                              # ⚡ React Frontend (Vite)
│   ├── public/
│   │   ├── brand-images/                # Company logos for marquee strip
│   │   └── professional.png             # Hero section image
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/                    # 12 modular landing page sections
│   │   │   │   ├── HeroSection.jsx      #   ↳ Typewriter hero with floating cards
│   │   │   │   ├── BrandStrip.jsx       #   ↳ Scrolling company logo marquee
│   │   │   │   ├── FeatureGrid.jsx      #   ↳ Bento grid feature showcase
│   │   │   │   ├── StatsSection.jsx     #   ↳ Animated counter statistics
│   │   │   │   ├── HowItWorks.jsx       #   ↳ 3-step process explainer
│   │   │   │   ├── AtsDemoSection.jsx   #   ↳ Live ATS demo widget
│   │   │   │   ├── TestimonialsSection  #   ↳ User testimonial cards
│   │   │   │   ├── PricingSection.jsx   #   ↳ Tiered pricing cards
│   │   │   │   ├── FaqSection.jsx       #   ↳ Accordion FAQ
│   │   │   │   ├── ContactSection.jsx   #   ↳ Contact form
│   │   │   │   ├── CtaSection.jsx       #   ↳ Call-to-action banner
│   │   │   │   └── FooterSection.jsx    #   ↳ Site footer
│   │   │   ├── Navbar.jsx               # Global navigation with auth state
│   │   │   ├── ProtectedRoute.jsx       # Auth + role guard wrapper
│   │   │   ├── FloatingOrbs.jsx         # Animated background particles
│   │   │   └── ThemeToggle.jsx          # Dark/light mode switcher
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page (composes 12 sections)
│   │   │   ├── Login.jsx                # Google + email login
│   │   │   ├── Signup.jsx               # Registration with validation
│   │   │   ├── ForgotPassword.jsx       # Firebase password reset
│   │   │   ├── Dashboard.jsx            # User hub: resumes, screenings, plan
│   │   │   ├── ResumeBuilder.jsx        # 5-step wizard with live preview
│   │   │   ├── ResumeScreener.jsx       # Upload + analyze + results
│   │   │   └── AdminDashboard.jsx       # Admin panel (stats, users, requests)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Firebase auth state & API sync
│   │   │   └── ThemeContext.jsx         # Dark/light theme provider
│   │   ├── services/
│   │   │   └── api.js                   # Centralized fetch client (auto-auth)
│   │   ├── config/
│   │   │   └── firebase.js              # Firebase app + Google provider init
│   │   ├── constants/
│   │   │   └── homeData.jsx             # Landing page content & config data
│   │   ├── App.jsx                      # Root component with all routes
│   │   ├── main.jsx                     # React DOM entry point
│   │   └── index.css                    # Global design system & styles
│   ├── index.html                       # HTML shell with fonts + Tailwind CDN
│   ├── vite.config.js                   # Vite plugins & dev server config
│   └── package.json
│
├── server/                              # 🖥️ Express Backend
│   ├── config/
│   │   ├── db.js                        # MongoDB connection with graceful fallback
│   │   ├── firebase-admin.js            # Admin SDK init + token verifier
│   │   └── plans.js                     # Plan definitions + getActivePlan()
│   ├── middleware/
│   │   └── auth.js                      # Token verification + adminOnly guard
│   ├── models/
│   │   ├── User.js                      # Users with roles, plans, resume refs
│   │   ├── Resume.js                    # Full resume schema (7 templates)
│   │   ├── Screening.js                 # ATS screening results
│   │   ├── Contact.js                   # Contact form submissions
│   │   └── PlanRequest.js               # Plan upgrade requests
│   ├── controllers/
│   │   ├── authController.js            # Google sync + profile endpoint
│   │   ├── resumeController.js          # CRUD with plan-based limits
│   │   ├── screeningController.js       # File upload + AI analysis trigger
│   │   ├── screeningsController.js      # Screening history CRUD
│   │   ├── plansController.js           # Plan info, upgrades, companies
│   │   └── adminController.js           # Dashboard stats + request handling
│   ├── routes/
│   │   ├── auth.js                      # POST /google, GET /me
│   │   ├── resume.js                    # Full CRUD /api/resumes
│   │   ├── screening.js                 # POST /api/screen
│   │   ├── screenings.js               # CRUD /api/screenings
│   │   ├── plans.js                     # GET/POST /api/plans
│   │   ├── contact.js                   # POST /api/contact
│   │   └── admin.js                     # Admin-only endpoints
│   ├── services/
│   │   └── aiScreener.js               # 🧠 Core AI screening engine
│   ├── utils/
│   │   ├── ApiError.js                  # Custom HTTP error class
│   │   └── asyncHandler.js              # Async route error wrapper
│   ├── server.js                        # Express app entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MongoDB | Atlas cluster or local instance |
| Firebase | Project with Auth enabled |

### 1. Clone the Repository

```bash
git clone https://github.com/Amitk-umar/Ai-powered-resumebuilder.git
cd Ai-powered-resumebuilder
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — get your URI from https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resumebuilder

# Firebase Admin — download service account from Firebase Console
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin — this email gets auto-assigned admin role on login
ADMIN_EMAIL=your-admin@email.com
```

```bash
npm run dev    # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `client/.env`:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Firebase Client — from Firebase Console > Project Settings
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000:web:000
```

```bash
npm run dev    # Starts on http://localhost:5173
```

> ⚠️ **Important:** Never commit `.env` files. They're already in `.gitignore`.

### 4. Production Build

```bash
cd client && npm run build    # Outputs to client/dist/
cd ../server && npm start     # Production mode (no auto-restart)
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`
All protected routes require: `Authorization: Bearer <firebase-id-token>`

### Authentication
```
POST   /api/auth/google          # Sync Firebase user → MongoDB
GET    /api/auth/me              # Get current user profile
```

### Resumes (all protected)
```
GET    /api/resumes              # List user's resumes
GET    /api/resumes/:id          # Get single resume
POST   /api/resumes              # Create (plan limits enforced)
PUT    /api/resumes/:id          # Update resume
DELETE /api/resumes/:id          # Delete resume
```

### ATS Screening
```
POST   /api/screen               # Upload resume PDF + job description
       Body: multipart/form-data
       Fields: resume (file), jobDescription (text)
       
       Response: {
         score: 78,
         matchedKeywords: ["react", "javascript", "mongodb"],
         missingKeywords: ["kubernetes", "aws"],
         suggestions: ["Add missing keywords...", ...],
         formatting: { score: 85, issues: [...] }
       }
```

### Screening History (all protected)
```
GET    /api/screenings           # List screening history (max 50)
POST   /api/screenings           # Save screening result
DELETE /api/screenings/:id       # Delete screening
```

### Plans (all protected)
```
GET    /api/plans/me             # Get active plan + pending requests
GET    /api/plans/all            # Get all available plans
POST   /api/plans/request        # Submit upgrade request
GET    /api/plans/companies      # Skill-matched companies (Premium)
```

### Contact (public)
```
POST   /api/contact              # Submit contact form
       Body: { name, email, subject?, message }
```

### Admin (admin role required)
```
GET    /api/admin/dashboard            # Aggregated stats
PATCH  /api/admin/plan-requests/:id    # Approve/reject upgrade
PATCH  /api/admin/contacts/:id/read    # Mark message as read
```

### Health Check
```
GET    /api/health               # { status: "ok", timestamp: "..." }
```

---

## 📸 Screenshots

> 💡 **Add your screenshots here!** Place them in a `docs/screenshots/` folder.

```markdown
### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Resume Builder
![Resume Builder](docs/screenshots/builder.png)

### ATS Screener Results
![ATS Screener](docs/screenshots/screener.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Admin Panel
![Admin Panel](docs/screenshots/admin.png)
```

---

## 📖 Usage Guide

### Creating a Resume
1. Sign in with Google or Email
2. Navigate to **Dashboard** → click **Create Resume**
3. Walk through 5 steps: Personal → Education → Experience → Skills → Projects
4. Choose a template (availability depends on your plan)
5. Toggle **Preview** to see real-time rendering
6. Click **Save** (cloud) or **Export PDF** (download)

### Screening a Resume
1. Go to **Dashboard** → click **Screen Resume**
2. Upload your resume as a PDF
3. Paste the target job description
4. Click **Analyze** — get instant results:
   - Overall ATS compatibility score
   - Matched vs. missing keywords
   - Formatting analysis with deductions
   - Up to 6 improvement suggestions
5. Results auto-save to your screening history

### Subscription Plans

| | Basic (Free) | Pro | Premium |
|---|---|---|---|
| **Templates** | 3 | 5 | All 7 |
| **Resume Limit** | 3 total | 3/week | 20/month |
| **PDF Export** | ✅ | ✅ | ✅ |
| **Screening History** | ✅ | ✅ | ✅ |
| **Company Suggestions** | ❌ | ❌ | ✅ |

---

## 🎨 Design Philosophy

### Visual Identity
ResumeAI follows a **dark-first SaaS aesthetic** inspired by platforms like Linear, Vercel, and Raycast. The design system is built around:

- **Aurora Gradients** — Cyan, indigo, and purple gradients for depth
- **Glassmorphism** — Frosted-glass cards with backdrop blur
- **Micro-animations** — Framer Motion for fade-ins, hover effects, and transitions
- **Typography** — Inter (body) + Space Grotesk (headings) via Google Fonts

### Responsive Strategy
- Mobile-first CSS with progressive enhancement
- Collapsible navigation for mobile viewports
- Builder switches between form/preview modes on small screens
- Dashboard cards reflow to single column on mobile

---

## ⚡ Performance

| Technique | Implementation |
|---|---|
| **Code Splitting** | Dynamic `import()` for html2pdf.js (loaded only on PDF export) |
| **Parallel Data Fetching** | Dashboard loads resumes, screenings, plans, companies via `Promise.all()` |
| **Memory Uploads** | Multer stores files in memory — no disk I/O |
| **Selective Projection** | MongoDB queries exclude `__v`, use `.select()` and `.limit()` |
| **Font Preconnect** | Google Fonts loaded with `preconnect` hints |
| **Graceful Degradation** | App continues without DB connection; localStorage fallback for resumes |

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **Authentication** | Firebase ID tokens verified server-side via Admin SDK |
| **Authorization** | Role-based middleware (`authMiddleware`, `adminOnly`) |
| **Token Fallback** | JWT payload decode as dev fallback when Admin SDK unavailable |
| **CORS** | Whitelist-based origin validation + Vercel preview support |
| **File Upload** | MIME type whitelist (PDF/DOCX only), 5MB size limit |
| **Error Handling** | Custom `ApiError` class prevents stack trace leaks in production |
| **Input Validation** | Required field checks on all mutation endpoints |
| **Env Security** | `.env` files in `.gitignore`, no secrets in client bundle |

---

## 🌐 Deployment

### Frontend → Vercel
1. Import repo to [vercel.com](https://vercel.com)
2. Root directory: `client`
3. Build command: `npm run build`
4. Output: `dist`
5. Add all `VITE_*` env variables in Vercel settings

### Backend → Render
1. Create Web Service on [render.com](https://render.com)
2. Root directory: `server`
3. Build: `npm install` · Start: `npm start`
4. Add all server env variables

### Database → MongoDB Atlas
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` for cloud deployments
3. Copy connection string to `MONGODB_URI`

> 💡 **Tip:** Update `ALLOWED_ORIGINS` in `server.js` if deploying to a custom domain.

---

## 🗺️ Roadmap

- [ ] 🤖 AI Interview Practice — Role-specific mock interviews with AI feedback
- [ ] 📊 Advanced Resume Scoring — Section-by-section breakdown with letter grades
- [ ] 🎨 Portfolio Builder — Auto-generate a portfolio site from your resume data
- [ ] 👥 Team Collaboration — Share resumes with mentors for review
- [ ] 💳 Stripe Integration — Automated subscription billing
- [ ] 📧 Email Notifications — Plan approval alerts and screening reminders
- [ ] 🔍 Job Board Integration — Pull job descriptions directly from LinkedIn/Indeed
- [ ] 📱 Mobile App — React Native companion app
- [ ] 🌍 Multi-language Support — Resume templates in 10+ languages

---

## 🤝 Contributing

Contributions are what make open source amazing. Here's how you can help:

### Getting Started
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Branch Naming
```
feature/   → New features          (feature/ai-interview-prep)
fix/       → Bug fixes             (fix/pdf-export-crash)
refactor/  → Code improvements     (refactor/api-service-layer)
docs/      → Documentation         (docs/update-readme)
```

### Code Style
- Use **functional components** with hooks (no class components)
- Follow the existing **MVC pattern** on the backend
- Use the centralized `api.js` service for all HTTP calls
- Wrap async route handlers with `asyncHandler()`
- Throw `ApiError` for expected errors (not generic Error)

### Component Guidelines
```
✅ One component per file
✅ Props destructured in function signature
✅ CSS module or co-located .css file per page
✅ Constants extracted to /constants
✅ Reusable components in /components
```

---

## 👏 Acknowledgements

- [Firebase](https://firebase.google.com) — Authentication infrastructure
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Vercel](https://vercel.com) — Frontend hosting
- [Render](https://render.com) — Backend hosting
- [Lucide Icons](https://lucide.dev) — Beautiful icon library
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF generation

---

## 📄 License

Distributed under the **ISC License**. See [`LICENSE`](LICENSE) for details.

---

## 📬 Contact

**Amit Kumar** — Project Creator & Maintainer

[![GitHub](https://img.shields.io/badge/GitHub-Amitk--umar-181717?style=flat-square&logo=github)](https://github.com/Amitk-umar)

> ⭐ **If this project helped you, consider giving it a star!** It helps others discover it.

---

<div align="center">

**Built with ❤️ and mass amounts of ☕ by Amit Kumar**

_From resume rejection to interview selection — ResumeAI has your back._

</div>
