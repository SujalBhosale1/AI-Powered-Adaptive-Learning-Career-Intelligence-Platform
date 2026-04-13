# 🧠 Pragyantra — AI-Powered Adaptive Learning & Career Intelligence Platform

> A fully local AI-driven, personalized education platform for engineering students — powered by **Ollama (qwen2.5-coder:7b)**. No cloud AI APIs required.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [AI Engine (Ollama)](#ai-engine-ollama)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Frontend Pages](#frontend-pages)
- [Gamification System](#gamification-system)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

---

## Overview

**Pragyantra** (OneStop) is a MERN-stack adaptive learning platform designed specifically for engineering students. It is 100% powered by a locally running **Ollama** language model (`qwen2.5-coder:7b`), meaning all AI generation — quizzes, career guidance, study notes, chatbot, and assessments — happens completely offline without sending data to any external cloud.

Every user starts from zero and the system builds a personalized profile, learning path, and career roadmap based purely on their behaviour, quiz performance, and interest responses.

---

## Key Features

### 🤖 AI-Powered (Ollama - 100% Local)
| Feature | Description |
|---|---|
| **Adaptive Quiz Generation** | Generates MCQs dynamically for any topic at any difficulty level (1–5) |
| **Interest Assessment** | 10 scenario-based personalised questions generated per user based on their declared interests |
| **Career Analysis** | Analyses quiz + interest responses to recommend engineering career branches with percentage match |
| **Career Flowchart** | Generates a step-by-step learning roadmap for any chosen engineering path |
| **Study Notes** | Generates HTML-formatted study notes tailored to user's level and weak areas |
| **Custom Notes** | Free-text input for users to request notes on any concept |
| **AI Mentor Chatbot** | Floating chatbot (OneStop AI Mentor) powered by Ollama, context-aware |

### 🎓 Adaptive Learning Engine
- Topics are auto-prioritised — weakest first
- Difficulty self-adjusts after every quiz question (correct → harder, wrong → easier)
- Confusion detection: if user takes too long, AI simplifies next question
- Revision queue: spaced repetition system to re-surface weak topics

### 🏆 Gamification System
- XP earned per quiz completion and correct answers
- Level progression (Novice → Titan)
- Badge system (8 unlockable achievements)
- Daily streak tracking
- Live leaderboard vs. simulated peers
- Profile XP and Level displayed on profile page

### 👤 User Personalisation
- Every new user starts with completely zeroed stats
- Profile strength, streak, XP, skills, views all start at 0
- Weekly Progress graph starts as flatline and grows as user engages
- Profile setup captures interests, location, academic scores, target role

### 📊 Dashboard & Progress
- Personalized roadmap based on declared engineering branch
- Activity feed, skill gap analysis
- Weekly XP progress graph (zero-based for new users)
- Calendar streak heatmap
- Confusion alerts when AI detects struggling topics

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | UI framework and build tool |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualisation (bar charts, area charts) |
| **Lucide React** | Icon library |
| **Context API** | Global auth state management |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database and ODM |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Helmet + CORS** | Security headers and cross-origin policy |
| **express-rate-limit** | API rate limiting |
| **nodemon** | Development hot-reload |

### AI Engine
| Technology | Purpose |
|---|---|
| **Ollama** | Local LLM runtime |
| **qwen2.5-coder:7b** | Primary model for all AI tasks |

### ML Engine (Python microservice)
| Technology | Purpose |
|---|---|
| **FastAPI** | Python REST API |
| **scikit-learn / pandas** | Skill classification from quiz scores |

---

## System Architecture

```
┌────────────────────────────────────────────────┐
│              Browser (React/Vite)              │
│           http://localhost:5173                │
└──────────────────┬─────────────────────────────┘
                   │ REST API calls
                   ▼
┌────────────────────────────────────────────────┐
│         Node.js / Express Backend              │
│           http://localhost:5000                │
│                                                │
│  ┌──────────────┐   ┌──────────────────────┐  │
│  │  Auth/User   │   │   AI Service Layer   │  │
│  │  Routes      │   │  (geminiService.js)  │  │
│  └──────────────┘   └──────────┬───────────┘  │
│                                │              │
│  ┌──────────────┐              │              │
│  │   MongoDB    │              │ HTTP POST    │
│  │   Database   │              ▼              │
│  └──────────────┘   ┌──────────────────────┐  │
│                     │  Ollama Local Server  │  │
│                     │  http://127.0.0.1    │  │
│                     │  :11434/api/generate │  │
│                     │  Model: qwen2.5-     │  │
│                     │         coder:7b     │  │
│                     └──────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Python ML Engine (FastAPI)              │  │
│  │  http://localhost:8000                   │  │
│  │  Classifies skill level from scores      │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

---

## Project Structure

```
adaptive Learning/
├── backend/                    # Node.js/Express REST API
│   ├── controllers/
│   │   ├── authController.js        # Register, login, get current user
│   │   ├── userController.js        # Profile setup & update
│   │   ├── assessmentController.js  # Quiz generation & analysis
│   │   ├── chatController.js        # AI Mentor chatbot endpoint
│   │   ├── learningController.js    # Learning path & notes generation
│   │   ├── careerController.js      # Career path prediction
│   │   └── analyticsController.js  # Usage analytics
│   ├── middleware/
│   │   ├── auth.js                  # JWT token verification
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema (XP, streak, interests, etc.)
│   │   ├── Assessment.js            # Quiz session storage
│   │   ├── ChatHistory.js          # Chatbot conversation history
│   │   ├── CareerRecommendation.js # Saved career analysis results
│   │   └── LearningPath.js        # Generated learning paths
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── assessment.js
│   │   ├── chat.js
│   │   ├── learning.js
│   │   └── career.js
│   ├── services/
│   │   ├── geminiService.js    # ⭐ PRIMARY: All Ollama AI functions
│   │   ├── mlService.js        # Python ML engine integration
│   │   ├── ollamaService.js    # Lower-level Ollama utilities
│   │   └── openaiService.js    # (Legacy, unused)
│   ├── server.js               # Express app entry point
│   └── .env                    # Environment variables
│
├── one-stop-frontend/          # React/Vite SPA
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx          # Public landing/marketing page
│       │   ├── LoginPage.jsx            # Authentication
│       │   ├── RegisterPage.jsx         # New user registration
│       │   ├── ProfileSetupPage.jsx     # Post-register onboarding
│       │   ├── DashboardPage.jsx        # Main user dashboard
│       │   ├── LearnPage.jsx            # Learning path + notes generator
│       │   ├── AdaptiveQuizPage.jsx     # AI-generated quiz interface
│       │   ├── InitialAssessmentPage.jsx # Interest assessment flow
│       │   ├── AIAnalysisPage.jsx       # Career analysis results
│       │   ├── CareerPathPage.jsx       # Career exploration
│       │   ├── ProgressPage.jsx         # Skill progress tracking
│       │   ├── ProfilePage.jsx          # User profile + XP display
│       │   ├── LeaderboardPage.jsx      # XP leaderboard
│       │   ├── PeerMatchPage.jsx        # Study partner matching
│       │   └── ProjectsPage.jsx         # AI-recommended projects
│       ├── components/
│       │   ├── ChatbotWidget.jsx        # Floating AI mentor chatbot
│       │   ├── Navbar.jsx               # Navigation (auth-aware)
│       │   ├── LearningCard.jsx         # Topic card with Begin Quiz + Notes
│       │   ├── ProgressGraph.jsx        # Weekly XP area chart
│       │   ├── CareerFlowchart.jsx      # AI-generated career roadmap
│       │   ├── StatsOverview.jsx        # Dashboard stat cards
│       │   ├── ActivityFeed.jsx         # Personalised activity feed
│       │   ├── XPBadge.jsx             # XP/level display badge
│       │   ├── CalendarStreakTracker.jsx# Streak heatmap calendar
│       │   ├── ResumeBuilder.jsx        # AI-assisted resume builder
│       │   └── ProjectIdeaGenerator.jsx # AI project idea generator
│       ├── contexts/
│       │   └── AuthContext.jsx          # Global auth state (token: onestop_token)
│       ├── data/
│       │   ├── skillEngine.js           # localStorage skill scoring logic
│       │   ├── gamificationEngine.js   # XP, levels, badges, streaks
│       │   ├── revisionEngine.js       # Spaced repetition queue
│       │   └── dummyData.js            # Branch-specific engineered data
│       └── hooks/
│           └── useStudentData.js        # Unified data hook for all components
│
└── ml-engine/                  # Python FastAPI skill classifier
    ├── main.py                  # FastAPI app entry
    ├── routers/                 # API route handlers
    ├── models/                  # ML model files
    └── requirements.txt
```

---

## AI Engine (Ollama)

All AI calls flow through `backend/services/geminiService.js`. This service is the **single source of truth** for AI generation.

### Setup
```bash
# Install Ollama from https://ollama.com/
ollama pull qwen2.5-coder:7b
ollama serve   # Runs at http://127.0.0.1:11434
```

### AI Functions

| Function | Endpoint Called By | What it Does |
|---|---|---|
| `generateTopicQuestion(topic, difficulty)` | `POST /api/assessment/generate` | Generates 1 MCQ with correct answer index for the Adaptive Quiz |
| `generateInterestQuestions(interests, name)` | `GET /api/assessment/interest-questions` | Generates 10 scenario-based interest questions (no right/wrong) |
| `analyzeStudentPerformance(profile, responses)` | `POST /api/assessment/analyze` | Returns branch recommendations with match percentages |
| `generateCareerFlowchart(branch)` | `GET /api/career/flowchart` | Step-by-step career roadmap for a given engineering branch |
| `predictCareers(profile, analytics)` | `GET /api/career/predict` | Top 3 career roles with salary and skill gap |
| `chatWithMentor(message, history)` | `POST /api/chat/message` | Context-aware AI mentor chat response |
| `generateStudyNotes(topic, level, weakAreas)` | `GET /api/learning/notes` | HTML-formatted personalised study notes |
| `generateDiagnosticQuestions()` | `GET /api/assessment/diagnostic` | 15-question diagnostic across 5 subjects |

### Prompt Engineering Strategy
- All JSON responses use `format: "json"` in the Ollama API body
- A two-pass extraction strategy handles responses: `extractJSON()` strips any accidental markdown fences
- Difficulty strings are mapped: `1-2 = Beginner`, `3-4 = Intermediate`, `5 = Advanced`
- System prompts enforce strict JSON-only output to prevent hallucinated prose contaminating structured data

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login, get JWT token | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### User
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/user/setup` | Complete profile setup after registration | ✅ |
| `PUT` | `/api/user/profile` | Update user profile | ✅ |

### Assessment & Quiz
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/assessment/interest-questions` | Get 10 AI-generated interest questions | ✅ |
| `POST` | `/api/assessment/generate` | Generate quiz question for given topic + difficulty | ✅ |
| `POST` | `/api/assessment/analyze` | Analyze interest responses, return career matches | ✅ |
| `POST` | `/api/assessment/submit` | Submit full diagnostic assessment | ✅ |
| `GET` | `/api/assessment/diagnostic` | Get diagnostic MCQ set | ✅ |

### Learning
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/learning/path` | Get/generate personalised learning path | ✅ |
| `GET` | `/api/learning/notes?topic=...` | Get AI-generated study notes for any topic | ✅ |

### Career
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/career/predict` | Predict top 3 career matches | ✅ |
| `GET` | `/api/career/flowchart?branch=...` | Generate learning roadmap for branch | ✅ |

### Chat
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/chat/message` | Send message to AI Mentor, get response | ✅ |
| `GET` | `/api/chat/history` | Retrieve conversation history | ✅ |

---

## Database Models

### User
```js
{
  name, email, password (hashed),
  interests: [String],          // e.g. ['coding', 'ai_ml']
  branch: String,               // e.g. 'Computer Science'
  targetRole: String,
  city, state, board,
  marks10, marks12, cetScore, jeeScore,
  profilePhoto: String,         // Base64 or URL
  profileStrength: Number,      // 0-100, starts at 0
  profileViews: Number,         // starts at 0
  learningStreak: Number,       // days, starts at 0
  totalXP: Number,              // starts at 0
  level: Number,                // starts at 1
  skills: [String],
  weeklyProgress: [{ week, xpEarned, quizzesCompleted }]
}
```

### Assessment
```js
{
  userId, questions: [...], answers: [...],
  scores: { dsa, webdev, ml, db, systemDesign },
  level: String, mlConfidence: Number,
  mlRecommendations: [String], createdAt
}
```

### ChatHistory
```js
{
  userId,
  messages: [{ role: 'user'|'assistant', content, timestamp }]
}
```

### LearningPath
```js
{
  userId, generatedFor: String,
  topics: [{ id, title, subject, difficulty, status, resources: [...] }]
}
```

---

## Frontend Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Marketing page for non-logged-in users |
| Login | `/login` | Email + password authentication |
| Register | `/register` | New user creation |
| Profile Setup | `/profile-setup` | Post-registration onboarding (branch, interests, scores) |
| Dashboard | `/dashboard` | Main hub: stats, roadmap, quick actions, progress graph |
| Learn | `/learn` | Adaptive topic cards, AI notes, custom notes generator |
| Adaptive Quiz | `/quiz` | Ollama-generated MCQs with adaptive difficulty |
| Initial Assessment | `/initial-assessment` | 10-question interest survey |
| AI Analysis | `/ai-analysis` | Career intelligence report |
| Career Path | `/career` | Career role explorer + AI flowchart |
| Progress | `/progress` | Skill tracking, revision queue, XP history |
| Profile | `/profile` | User info + live XP/Level display |
| Leaderboard | `/leaderboard` | XP rankings vs. peers |
| Peer Match | `/peers` | Study partner suggestions |
| Projects | `/projects` | AI-recommended project ideas |

---

## Gamification System

All gamification data is stored in browser `localStorage` and does not require a server round-trip.

### XP Sources
| Action | XP Earned |
|---|---|
| Complete a quiz | +50 XP |
| Each correct answer | +10 XP |
| Daily login | +25 XP |

### Levels
| XP Threshold | Level | Title |
|---|---|---|
| 0 | 1 | Novice |
| 100 | 2 | Apprentice |
| 300 | 3 | Explorer |
| 600 | 4 | Learner |
| 1000 | 5 | Scholar |
| 1500 | 6 | Expert |
| 2200 | 7 | Master |
| 3000 | 8 | Champion |
| 4000 | 9 | Legend |
| 5500 | 10 | Grandmaster |
| 7500+ | 11 | Titan |

### Badges
| Badge | Condition |
|---|---|
| 🎯 First Steps | Complete first quiz |
| ⭐ Perfect Score | 100% on any quiz |
| 🔥 On Fire | 3-day streak |
| 💎 Diamond Streak | 7-day streak |
| 🏆 Topic Master | 80%+ accuracy on any topic |
| 🌟 Polymath | Attempt all 8 topics |
| 📚 Knowledge Seeker | Complete 10 quizzes |
| 🚀 Rising Star | Reach Level 5 |

---

## Getting Started

### Prerequisites
- **Node.js** v18+  
- **MongoDB** (local or Atlas)  
- **Ollama** installed and running  
- **Python 3.10+** (for ML engine)

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend
cd one-stop-frontend
npm install

# ML Engine
cd ml-engine
pip install -r requirements.txt
```

### 2. Pull the AI Model

```bash
ollama pull qwen2.5-coder:7b
```

### 3. Configure Environment

```bash
# backend/.env
cp backend/.env.example backend/.env
# Edit the file with your MongoDB URI and JWT secret
```

---

## Environment Variables

Create `backend/.env` with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onestop_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
ML_API_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> ⚠️ The `GEMINI_API_KEY` and `OPENAI_API_KEY` fields in `.env` are **not used** by the platform. All AI is handled by Ollama locally.

---

## Running the Project

### Terminal 1 — Ollama
```bash
ollama serve
# Ollama runs at http://127.0.0.1:11434
```

### Terminal 2 — Backend
```bash
cd backend
npm run dev
# Express API runs at http://localhost:5000
```

### Terminal 3 — Frontend
```bash
cd one-stop-frontend
npm run dev
# Vite dev server runs at http://localhost:5173
```

### Terminal 4 — ML Engine (Optional)
```bash
cd ml-engine
uvicorn main:app --reload --port 8000
# FastAPI skill classifier at http://localhost:8000
```

### Access the App
Open [http://localhost:5173](http://localhost:5173) in your browser.

1. Register a new account (all stats start at zero)
2. Complete profile setup to declare your branch and interests
3. Take the Initial Assessment — Ollama generates personalised questions
4. View your Career Intelligence Report
5. Explore the Dashboard, start quizzes, generate notes, and chat with the AI Mentor

---

## Important Notes

- **Token key**: The auth token is stored in `localStorage` as `onestop_token`
- **Model name**: Ollama model must be referenced exactly as `qwen2.5-coder:7b` (with colon)
- **New users**: All stats (XP, streak, profile strength, weekly progress) begin at zero and grow organically
- **Ollama must be running** before starting the backend — all AI calls will fail otherwise
- The chatbot requires the user to be logged in (token required)

---

*Built with ❤️ for engineering students. Powered by local AI — your data never leaves your machine.*
