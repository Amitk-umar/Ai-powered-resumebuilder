# 🎯 AI-Powered Resume Builder

## Project Introduction

### What is This Project?

**Imagine:** You're ready to apply for a job, but you're not sure if your resume is good enough. Will the company's computer system even read it? Will it understand your skills? This project solves that problem!

The **AI-Powered Resume Builder** is a complete web application that helps you:
- **Build beautiful resumes** using professional templates
- **Check if your resume passes ATS** (Applicant Tracking Systems - the computers that read resumes first)
- **Get AI suggestions** to improve your resume
- **Manage multiple resumes** for different job positions
- **Download resumes as PDF** to send to companies

### The Real Problem We're Solving

Did you know that **75% of resumes never reach a human recruiter**? They get rejected by computers (ATS systems) BEFORE anyone even looks at them!

Most job seekers don't know their resume is formatted wrong or missing important keywords. This app helps you:
1. See exactly what keywords the job needs
2. Check if your resume has those keywords
3. Get suggestions on what to fix
4. Download a polished PDF ready to send

### Who Can Use This?

✅ College students building first resumes  
✅ Job seekers applying for new positions  
✅ People changing careers  
✅ Anyone who wants to know if their resume will pass ATS checks

---

## ✨ Key Features (Explained Simply)

### 📝 Resume Creation
- **7 Professional Templates** - Choose from Modern, Professional, Minimal, Creative, Executive, ATS Focused, or Technical designs
- **Easy Form** - Just fill in your information in simple fields (name, email, job experience, etc.)
- **Live Preview** - See how your resume looks in real-time as you type
- **Auto-Save** - Your resume saves automatically to the cloud

### 🤖 AI-Powered ATS Checker
- **Upload Resume + Job Description** - Give it your resume and a job posting
- **Get Instant Score** - See a score from 0-100 showing how well your resume matches the job
- **See Matched Keywords** - Shows which keywords from the job are in your resume (good!)
- **See Missing Keywords** - Shows what keywords you're missing (need to add)
- **Get Suggestions** - AI gives you up to 6 specific tips to improve your resume
- **Formatting Check** - AI analyzes if your resume has proper sections, contact info, action verbs, and numbers

### 📊 Dashboard & History
- **See All Your Resumes** - One place to manage all your resume versions
- **Screening History** - Keep track of every time you checked a resume against a job
- **Compare Results** - Look back at past ATS checks to see improvements

### 💳 Subscription Plans
- **Free Plan (Basic)** - 1 resume, 3 ATS checks, 3 templates
- **Pro Plan** - 5 resumes, 50 ATS checks, 5 templates
- **Premium Plan** - Unlimited resumes, unlimited checks, all 7 templates

### 🔐 Security Features (Technical)
- **Firebase Authentication** - Your login is secure with Firebase (trusted by Google)
- **Token Verification** - Every request to the server is verified to make sure it's really you
- **Secure Data Storage** - All your resume data is encrypted and stored safely
- **Protected Endpoints** - Only you can see and edit your resumes

---

## 🛠 Technologies Used (Beginner Explanation)

### Frontend (What Users See) - React & JavaScript
| Technology | What It Does |
|---|---|
| **React 19** | JavaScript library that makes interactive pages (things happen without refreshing) |
| **Vite** | Fast tool that runs the development server on your computer |
| **React Router** | Allows clicking between pages (Dashboard, Resume Builder, etc.) |
| **Axios** | Makes requests to the backend server to send/get data |
| **Firebase** | Google's service for user login/authentication |
| **Framer Motion** | Creates smooth animations and transitions |
| **html2pdf.js** | Converts your resume HTML to a PDF file |
| **Lucide React Icons** | Beautiful icons for buttons and labels |

### Backend (The Brain) - Node.js & Express
| Technology | What It Does |
|---|---|
| **Node.js** | Allows JavaScript to run on a server (not just in browsers) |
| **Express** | Web framework for creating API endpoints (/api/resumes, /api/screen, etc.) |
| **MongoDB** | Database that stores all user data, resumes, screening results |
| **Mongoose** | Makes it easier to work with MongoDB data |
| **Firebase Admin SDK** | Server-side tool to verify user tokens and manage users |
| **OpenRouter API** | Connects to AI models (DeepSeek, Llama) for analysis |
| **pdf-parse** | Extracts text from PDF files users upload |
| **bcryptjs** | Hashes passwords securely (never stores plain passwords) |

### Where It's Hosted
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud database (stores all data) |
| **Firebase** | Google's authentication service |
| **Vercel** | Frontend hosting (runs the website) |
| **AWS/Render/Heroku** | Backend hosting (runs the API server) |

---

## 🔄 How The Application Works (Step-by-Step)

### User Journey - What Happens When You Use This App

#### Step 1: Sign Up / Login
```
User goes to website
    ↓
Clicks "Sign Up" or "Login"
    ↓
Firebase authentication asks for email and password
    ↓
User account is created and stored in MongoDB
    ↓
User is logged in and can see dashboard
```

#### Step 2: Create a Resume
```
User clicks "Create New Resume"
    ↓
Selects a template (Modern, Professional, etc.)
    ↓
Fills in a form with:
  • Personal info (name, email, phone)
  • Education (school, degree, graduation year)
  • Experience (job title, company, what you did)
  • Skills (technical, soft, languages, tools)
  • Projects (what you built)
    ↓
Resume is saved to MongoDB database
    ↓
User can preview resume in real-time
```

#### Step 3: Check Resume Against Job Description (ATS Check)
```
User goes to "ATS Checker"
    ↓
Pastes a job description from a company
    ↓
Uploads their resume (PDF or text)
    ↓
Backend server receives the data
    ↓
AI reads both the resume and job description
    ↓
AI extracts keywords from the job (Python, React, Leadership, etc.)
    ↓
AI checks which keywords appear in the resume
    ↓
AI analyzes formatting:
  • Does resume have Contact Info section?
  • Does resume have Education section?
  • Does resume have Experience section?
  • Are there action verbs? (Led, Developed, Created)
  • Are there numbers? (Increased by 50%, Managed 10 people)
    ↓
AI calculates score:
  Score = (Keyword Match × 70%) + (Formatting Quality × 30%)
    ↓
Results returned to user:
  • Overall Score (0-100)
  • Matched Keywords (what you got right)
  • Missing Keywords (what you need to add)
  • Formatting Issues
  • 6 Suggestions for improvement
    ↓
User sees beautiful results with charts
```

#### Step 4: Download Resume
```
User clicks "Download PDF"
    ↓
Frontend converts resume HTML to PDF
    ↓
PDF file downloads to computer
    ↓
User can print or email to companies
```

---

## 💻 Frontend Explanation (The User Interface)

### What is the Frontend?

The **frontend** is what you see and click on - the entire website interface. It's built with **React**, which is a JavaScript library that makes websites interactive and fast.

### Main Pages Users See

1. **Home Page** - Welcome page with info about the app
2. **Login/Signup Page** - Where you create account or log in
3. **Dashboard** - Shows your resumes and screening history
4. **Resume Builder** - Form where you enter your resume information
5. **ATS Checker** - Upload resume and job description to get ATS score
6. **Pricing Page** - Shows subscription plans

### Key Technologies on Frontend

- **React** - Makes interactive components
- **Vite** - Fast development server (runs on port 5173)
- **Firebase** - Handles user login
- **Axios** - Sends requests to backend server
- **html2pdf.js** - Converts resume to PDF for download

### How Frontend Talks to Backend

Frontend uses REST API (like a waiter taking orders):

```
Frontend Request:
POST /api/resumes
Header: Authorization: Bearer [user_token]
Body: { name: "John", email: "john@example.com", ... }

↓ (sent over internet to backend server)

Backend Response:
{
  success: true,
  resume: { id: "123", title: "My Resume", ... }
}

↓ (frontend shows success message to user)
```

---

## 🗄️ Backend Explanation (The Brain)

### What is the Backend?

The **backend** is the "invisible engine" running on a server. It:
- Saves your resume to the database
- Runs the AI analysis
- Verifies you're logged in
- Processes payments (if you upgrade)

### Main Responsibilities

1. **Save Resume Data** - When you create/edit resume, backend saves to MongoDB
2. **Run ATS Analysis** - When you upload resume, backend:
   - Extracts text from PDF
   - Analyzes keywords
   - Checks formatting
   - Generates suggestions
3. **Verify User** - Every request checks if it's really you
4. **Return Results** - Sends analysis results back to frontend

### Backend Structure

- **Controllers** - Handle the logic (like a recipe)
- **Models** - Define what data looks like (schemas)
- **Routes** - Define API endpoints (/api/resumes, /api/screen, etc.)
- **Services** - Connect to external services (AI, PDF parsing)
- **Middleware** - Check things before processing (authentication)

---

## 🗃️ Database Explanation (The Storage)

### What is the Database?

A **database** is like a digital filing cabinet. We use **MongoDB**, which stores data as JSON documents (like JavaScript objects).

### Collections (Tables) Explained Simply

#### 1. Users Collection
Stores information about registered users
```
{
  firebaseUid: "unique_user_id",
  email: "john@example.com",
  name: "John Doe",
  plan: "basic"  // or "pro" or "premium"
}
```

#### 2. Resumes Collection
Stores all resumes users create
```
{
  userId: "unique_user_id",
  title: "Software Engineer Resume",
  template: "Modern",
  personalInfo: { name, email, phone, ... },
  education: [ { school, degree, ... } ],
  experience: [ { company, job title, ... } ],
  skills: { technical, soft, languages, ... }
}
```

#### 3. Screenings Collection
Stores results of every ATS check
```
{
  userId: "unique_user_id",
  resumeId: "resume_id",
  jobDescription: "Full job posting text",
  score: 78,
  matchedKeywords: ["React", "JavaScript", ...],
  missingKeywords: ["Docker", "Kubernetes", ...],
  suggestions: ["Add Docker to skills", ...]
}
```

---

## 📁 Folder Structure (Where Everything Lives)

```
resumebuilder/
│
├── client/                              # React Frontend
│   └── src/
│       ├── pages/                       # Full page components
│       │   ├── Home.jsx                 # Landing page
│       │   ├── Login.jsx                # Login page
│       │   ├── Dashboard.jsx            # User dashboard
│       │   ├── ResumeBuilder.jsx        # Resume editor
│       │   └── ResumeScreener.jsx       # ATS checker
│       ├── components/                  # Reusable UI components
│       ├── services/
│       │   └── api.js                   # Makes requests to backend
│       ├── config/
│       │   └── firebase.js              # Firebase setup
│       └── App.jsx                      # Main app file
│
├── server/                              # Express Backend
│   ├── controllers/                     # Logic for handling requests
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   └── screeningController.js
│   ├── models/                          # Database schemas
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── Screening.js
│   ├── routes/                          # API endpoints
│   │   ├── auth.js
│   │   ├── resume.js
│   │   └── screening.js
│   ├── services/
│   │   └── aiScreener.js                # AI analysis logic
│   ├── middleware/
│   │   └── auth.js                      # Checks if user is logged in
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   │   └── firebase-admin.js            # Firebase setup
│   └── server.js                        # Main server file
│
└── README.md                            # This file
```

---

## 🔗 API Flow (Data Communication)

### What is an API?

An **API** is like a waiter in a restaurant:
- **Frontend** = Customer ordering food
- **Backend** = Kitchen making the food
- **API** = Waiter taking order and bringing food

### Example: Creating a Resume

```
STEP 1: User fills form and clicks "Save"
            ↓
STEP 2: Frontend prepares data and sends to backend:
        POST /api/resumes
        Headers: { Authorization: "Bearer firebase_token" }
        Body: { title, template, personalInfo, education, ... }
            ↓
STEP 3: Backend receives request and checks:
        - Is the user really logged in? (checks token)
        - Is this user allowed to create more resumes? (checks plan)
        - Is the template allowed for this plan?
            ↓
STEP 4: Backend saves to MongoDB:
        - Creates new Resume document
        - Links to user ID
        - Sets timestamps
            ↓
STEP 5: Backend sends response back:
        { success: true, resume: { _id: "123", title: "..." } }
            ↓
STEP 6: Frontend receives response and updates UI:
        - Shows success message
        - Adds new resume to list
        - User can now edit it
```

### Main API Endpoints

| Endpoint | Purpose | What You Send | What You Get Back |
|---|---|---|---|
| `POST /api/auth/register` | Create account | email, password | user info |
| `POST /api/auth/login` | Login | email, password | user token |
| `GET /api/resumes` | Get all your resumes | (nothing) | list of resumes |
| `POST /api/resumes` | Create new resume | resume data | new resume with ID |
| `PUT /api/resumes/:id` | Update resume | updated data | updated resume |
| `DELETE /api/resumes/:id` | Delete resume | (nothing) | success message |
| `POST /api/screen` | Check ATS score | resume + job description | score + suggestions |
| `GET /api/screenings` | Get screening history | (nothing) | list of past checks |

---

## 📥 Installation Steps (How to Set Up)

### What You Need First

1. **Node.js** (≥ version 18) - [Download](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **MongoDB Account** - [Free account](https://www.mongodb.com/cloud/atlas)
4. **Firebase Project** - [Create free project](https://firebase.google.com/)
5. **Text Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)
6. **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Project

```bash
# Open terminal/command prompt and run:
git clone https://github.com/Amitk-umar/Ai-powered-resumebuilder.git

# Go into project directory
cd Ai-powered-resumebuilder
```

### Step 2: Install Backend Dependencies

```bash
# Go to server folder
cd server

# Install all packages needed for backend
npm install

# This downloads: Express, MongoDB, Firebase, AI tools, etc.
```

### Step 3: Install Frontend Dependencies

```bash
# Go to client folder (from project root)
cd ../client

# Install all packages needed for frontend
npm install

# This downloads: React, Vite, Firebase, Icons, etc.
```

### Step 4: Set Up Environment Variables

#### Backend Setup (server/.env)

Create a file called `.env` in the `server` folder:

```env
PORT=5000
NODE_ENV=development

# MongoDB — Get this from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumebuilder

# Firebase — Get these from Firebase Console
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OpenRouter API for AI (get free key at openrouter.ai)
OPENROUTER_API_KEY=your-openrouter-key
```

#### Frontend Setup (client/.env)

Create a file called `.env` in the `client` folder:

```env
VITE_API_URL=http://localhost:5000

# Firebase settings — get from Firebase Console
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:000:web:000
```

---

## 🚀 How to Run the Project

### Start Backend Server

```bash
# Open terminal 1
cd server
npm run dev

# You should see: "Server running on http://localhost:5000"
```

### Start Frontend Server

```bash
# Open NEW terminal (terminal 2)
cd client
npm run dev

# You should see: "VITE v8.x.x ready in port 5173"
```

### Open in Browser

1. Open browser (Chrome, Firefox, Safari, etc.)
2. Go to `http://localhost:5173`
3. Click "Sign Up" to create account
4. Test the app!

---

## 🔮 Future Improvements

### Features We Could Add

- 📧 Email notifications when jobs match your skills
- 📱 Mobile app with React Native
- 🤝 Share resumes with friends for feedback
- 📈 Analytics dashboard showing resume view stats
- 🎤 Interview preparation with mock questions
- 🔗 LinkedIn profile optimization
- 💬 Live chat support for users
- 🌍 Support for multiple languages
- 🤖 AI cover letter generator
- ✅ Skills verification and badges

---

## 🚧 Challenges Faced

### 1. AI Response Parsing

**Problem:** AI sometimes returns responses wrapped in markdown code blocks instead of pure JSON.

**Solution:** Extract the JSON by finding first `{` and last `}` in the response.

### 2. PDF Text Extraction

**Problem:** Different PDFs extract text differently; scanned image PDFs don't work well.

**Solution:** Add error handling and validate extracted text.

### 3. Firebase Private Key in Environment Variables

**Problem:** Private keys contain newlines that break .env files.

**Solution:** Use literal `\n` characters in the string.

### 4. CORS (Cross-Origin Resource Sharing)

**Problem:** Frontend (port 5173) and backend (port 5000) run on different ports; browsers block requests.

**Solution:** Configure Express to allow requests from frontend origin.

### 5. Plan Limits Enforcement

**Problem:** Need to enforce that free users can only create 1 resume.

**Solution:** Check resume count before allowing creation using middleware.

---

## 🎓 Conclusion

### What This Project Teaches

✅ **Full-Stack Web Development** - Frontend, backend, and database working together

✅ **AI Integration** - Using AI APIs to power real features

✅ **User Authentication** - Secure login with Firebase

✅ **Database Design** - Storing and querying data with MongoDB

✅ **REST API Design** - Building endpoints that frontend and other apps can use

✅ **Real-World Problems** - Solving actual challenges like ATS systems

### Key Takeaways

1. **Modern web apps have three parts:** Frontend (UI), Backend (logic), Database (storage)
2. **AI is now accessible** - You don't need to build AI from scratch; use APIs
3. **Security matters** - Always verify users, validate data, protect passwords
4. **Users first** - Design features that solve real problems
5. **Full-stack development is powerful** - One person can build complete applications

### Next Steps to Learn More

- Try deploying this app to the internet (Vercel for frontend, Render for backend)
- Add more features (notifications, analytics, etc.)
- Learn about payment processing with Stripe
- Build your own API from scratch
- Read the code and understand how each part works

---

## 📞 Support

- **Questions?** Check the issues on GitHub
- **Want to contribute?** Submit a pull request
- **Found a bug?** Report it on GitHub

---

**Created for learning full-stack web development.**  
**Last updated: January 2025**

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
