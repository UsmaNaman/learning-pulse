# Learning Pulse — Claude Code Briefing Document

## 🎯 What This Project Is

Learning Pulse is a web-based Learning Management System (LMS) built specifically for KS3/KS4 Computer Science teachers and students in England. It is being developed as a commercial EdTech product with the goal of selling site licences to secondary schools (£500–£3,000/yr target).

The core problem it solves: CS teachers have no real-time visibility into which students are struggling and why. Learning Pulse closes the gap between "teaching a lesson" and "knowing who actually got it."

---

## 🏗️ Tech Stack

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB via Mongoose
- Module syntax: CommonJS (require/exports)
- Validation: express-validator
- Dev server: Nodemon (hot reload)

### Frontend
- Framework: React (functional components + hooks)
- UI Library: Material UI (MUI)
- Routing: React Router
- State: Context API
- Testing: Jest

---

## 🚀 Commands

| Task | Command |
|------|---------|
| Start everything | `npm start` |
| Backend only | `npm run backend` |
| Frontend only | `npm run frontend` |
| Install all packages | `npm run install-all` |
| Seed database | `npm run seed` |
| Run all frontend tests | `cd frontend && npm test` |
| Run single test | `cd frontend && npm test -- -t "test name"` |

**Ports: Backend → 5001 | Frontend → 3001**

> Note: Backend runs on 5001 (not 5000) — macOS AirPlay Receiver occupies port 5000.

### Local Setup Requirements
- **MongoDB**: Installed via Homebrew, runs as a background service
  - Start: `brew services start mongodb/brew/mongodb-community`
  - Stop: `brew services stop mongodb/brew/mongodb-community`
  - MongoDB auto-starts at login once enabled
- **Node.js**: Uses `npx` to invoke local binaries (nodemon, react-scripts) — do not rely on global installs

### Environment Files
- `backend/.env` — MongoDB URI, PORT (5001), JWT_SECRET, CORS_ORIGIN
- `frontend/.env` — REACT_APP_API_URL points to `http://localhost:5001/api`
- `frontend/.env.production` — REACT_APP_API_URL for cloud backend (update when deploying to Render)

### Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Instructor | `smith@school.edu` | `password123` |
| Instructor | `jones@school.edu` | `password123` |
| Student | `john.s@school.edu` | `student123` |
| Student | `emily.j@school.edu` | `student123` |

---

## 📚 Current Feature Set

### 👩‍🏫 Teacher / Instructor Dashboard
- Class overview: all students with skill level (Beginner → Expert), mastery %, points, activity count, weekly streak
- Risk flagging (killer feature): students auto-flagged Low / Medium / High risk based on performance + engagement
- Per-student drill-down: expand student card for topic-level detail
- Full student report: individual profile with topic-by-topic breakdown

### 🎓 Student Dashboard
- Personal mastery progress across KS3/KS4 CS topics
- Points & streaks (gamified engagement)
- Bloom's Taxonomy-aligned assessments (recall → evaluate)
- Learning resources: videos, documents, interactive activities per topic
- Embedded HTML worksheets/quizzes

### 📖 Topics Covered (OCR-aligned)
Algorithms · Programming Constructs · Data Representation · Computer Systems · Networks · E-Safety & Ethics · Problem Solving · Boolean Logic · Programming Languages · Data Handling

---

## 🗺️ Development Priorities (Ordered)

### 🔴 Phase 1 — Make it real & deployable
1. Replace all mock/seed data with persistent real user data
2. Implement proper auth (teacher login / student login, separate roles)
3. Safeguarding-compliant student accounts (no personal data exposure)
4. Deploy to a live URL (Render, Railway, or Vercel + Railway combo)

### 🟡 Phase 2 — Make it genuinely useful
1. Adaptive content — app responds when a student is struggling (hint system, easier scaffolding, re-routing)
2. Make low-ability content more accessible and engaging (animations, visual explainers, analogies)
3. Teacher resource generator — AI-powered differentiated worksheet creation
4. Parent/carer progress view (read-only)

### 🟢 Phase 3 — Make it commercial
1. Free tier vs paid tier logic (free: student self-study; paid: teacher dashboard + risk flagging + reporting)
2. School onboarding flow (invite codes, class setup, bulk student import)
3. SLT reporting — exportable progress reports, Ofsted-ready intervention evidence
4. Landing page and marketing site

---

## 💰 Commercial Model (Target)
- **Free tier**: Students self-register, access quizzes and resources
- **Paid tier (school licence)**: Teacher dashboard, risk flagging, class management, SLT reports
- **Target price**: £500–£3,000/yr per school site licence
- **Buying journey**: Teacher discovers free → shows HoD → SLT signs off budget

---

## 🎨 Design Principles
- Accessible and engaging for low-ability KS3 learners — avoid dense text, use visuals, analogies, gamification
- Teacher UX must be fast — they have 30 seconds between lessons, not 5 minutes
- Ofsted/SLT credibility — risk flagging and intervention tracking must look professional
- OCR and AQA curriculum alignment throughout

---

## 🧑‍💻 Code Style

### Backend
- ES6+ with CommonJS (require/exports)
- async/await throughout — no raw Promise chains
- try/catch on all async routes
- express-validator for all input validation
- Mongoose models: clear schema definitions with validation rules
- Controllers: route comment → validation → logic → response pattern

### Frontend
- Functional components only (no class components)
- Import order: React → libraries → contexts → components → utilities
- MUI styling system preferred over inline styles
- PropTypes for type documentation
- camelCase variables/functions, PascalCase components, snake_case env vars

---

## 🧠 Context for AI Sessions
- Developer is a secondary school CS teacher (KS3–KS4 + sixth form BTEC IT + Year 12 CS) in England
- Understands the curriculum deeply — OCR, AQA, Pearson BTEC
- Familiar with Bloom's Taxonomy, differentiation, low-ability engagement strategies
- Technical but not a full-time developer — keep explanations clear, flag gotchas
- Goal: get Learning Pulse to a point where schools are paying for it
- Prioritise working, deployable code over perfect architecture
- When in doubt, ask before refactoring large chunks

---

## ⚠️ Known Issues / To-Do
- [ ] All student data is currently seeded/mock — needs real persistence
- [ ] No authentication system yet
- [ ] Not deployed to a public URL
- [ ] Adaptive content not yet implemented
- [ ] Low-ability accessibility features still in vision stage
