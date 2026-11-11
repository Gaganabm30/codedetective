# CodeDetective 🕵️‍♂️
### AI-Powered Interactive Developer Debugging & Learning Platform

> **"Think Like a Developer. Debug Like a Pro."**

CodeDetective is a modern full-stack web application designed for developers and computer science students to master the art of reading existing codebases, reproducing real-world defects, diagnosing root causes, and implementing surgical fixes verified by automated test suites.

Unlike traditional platforms where users write functions from scratch, CodeDetective simulates practical software engineering assessment environments and production incident response.

---

## 🌟 Key Platform Features

### 1. Multi-File Project Debugging Playground
- **VS Code Inspired Interface**: A dark charcoal IDE environment (`.ide-theme`) equipped with Monaco Code Editor (`@monaco-editor/react`).
- **File Explorer**: Expandable project folder tree with multi-file architectures (routes, controllers, models, middleware, utils).
- **Tabbed Editor**: Syntax highlighting, line numbers, active tab switching, close tabs, and live code editing.
- **Interactive Terminal & Test Results**: Bottom drawer displaying real-time execution logs, stdout/stderr, and assertion suite breakdowns with error traces.

### 2. Dedicated Single-Snippet Debug Lab
- Quick-fire isolated debugging for runtime nuances: closures, event loop microtasks, array mutations, and algorithmic edge cases.
- Select by language and difficulty track.
- Instant assertion evaluation and deep-dive technical explanations.

### 3. Socratic AI Debugging Mentor (Gemini API)
- Designed to build independent problem-solving skills rather than giving away solutions.
- **4-Tier Progressive Hints**:
  - **Level 1**: Conceptual guidance & architectural overview
  - **Level 2**: Targeted file & code section pointer
  - **Level 3**: Underlying root-cause technical breakdown
  - **Level 4**: Surgical implementation guide
- Interactive quick prompts: *Explain Error*, *Point to Bug*, *Review My Fix*.

### 4. Sandboxed Code Execution Engine
- Pure JavaScript isolated execution using Node's `node:vm` memory sandboxes.
- Strict CPU execution timeouts (preventing infinite loops).
- Prohibited access to host environment (`process`, `fs`, `child_process`).
- Dual evaluation mode: client-side test evaluation and server-side sandboxed validation.

### 5. Developer SaaS Interface & Design System
- **Two Distinct Environments**:
  - **Main Platform**: Crisp white and light lavender backgrounds with deep purple accents (`#5420C9`, `#7C4DFF`).
  - **Workspace**: Dark charcoal developer IDE interface.
- **Light & Dark Theme Toggle**: Stored in `localStorage` and applied across all views.
- **Full Navigation**: Top navigation bar, authenticated dashboard sidebar, global leaderboard, audit history, and user profiles.

---

## 🛠️ Technology Stack (Strictly JavaScript)

### Frontend
- **Framework**: React.js 18 (pure JavaScript & JSX, no TypeScript)
- **Bundler**: Vite
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS custom properties (design tokens, no Tailwind, no Bootstrap)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose (with automatic in-memory fallback mode)
- **Execution Engine**: `node:vm` isolated context sandbox
- **AI Integration**: Google Gemini 2.5 Flash API
- **Authentication**: JWT & Bcrypt.js

---

## 📁 Project Architecture

```
codedetective/
├── client/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── data/
│   │   │   ├── challengesData.js
│   │   │   └── userData.js
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ChallengesPage.jsx
│   │   │   ├── PlaygroundPage.jsx
│   │   │   ├── DebugLabPage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── MyAttemptsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DocumentationPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── codeRunner.js
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── sidebar.css
│   │   │   ├── footer.css
│   │   │   ├── landing.css
│   │   │   ├── dashboard.css
│   │   │   ├── challenges.css
│   │   │   ├── playground.css
│   │   │   ├── debug-lab.css
│   │   │   ├── leaderboard.css
│   │   │   ├── attempts.css
│   │   │   ├── profile.css
│   │   │   ├── auth.css
│   │   │   └── docs.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── challengeController.js
│   │   ├── aiController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Challenge.js
│   │   └── Attempt.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── challengeRoutes.js
│   │   ├── aiRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── services/
│   │   ├── executionService.js
│   │   └── geminiService.js
│   ├── utils/
│   │   ├── seed.js
│   │   └── seedData.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or newer)
- npm (v9.0 or newer)
- (Optional) MongoDB installed locally or MongoDB Atlas connection string.

### 1. Installation

From the root directory:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

In `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/codedetective
JWT_SECRET=your_jwt_secret_key

# Optional: Set your Gemini API Key for live AI mentor integration
GEMINI_API_KEY=your_gemini_api_key
```

*Note: If MongoDB is not running locally, CodeDetective seamlessly operates in resilient In-Memory Mode with zero crashes!*

### 3. Launching the Application

Run the backend server:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

In another terminal, run the frontend client:
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

Open your browser to `http://localhost:3000`.

---

## 🎯 Debugging Challenges Catalog

| Challenge | Track | Difficulty | Type | Defect Description |
|---|---|---|---|---|
| **Auth API — Debug Login** | Full Stack / Node | Medium | Multi-file | Bearer token string splitting defect & un-awaited bcrypt promise |
| **React Todo App — State Mutation** | React | Easy | Multi-file | In-place array mutation (`.push`) & unstable array index keys |
| **DSA: Two Sum & Duplicates** | DSA / JavaScript | Easy | Snippet | Falsy check on index `0` and duplicate element hash map overwrite |
| **MongoDB Query — Aggregation** | Database | Medium | Multi-file | Uncast string `ObjectId` in `$match` & missing `$unwind` on items |
| **Node.js Middleware — Async Exceptions** | Backend | Medium | Multi-file | Unhandled promise rejection causing process crash |
| **Full Stack Registration — CORS** | Full Stack | Hard | Multi-file | Premature route mounting before CORS & payload casing mismatch |
| **JavaScript Event Loop — Async Queue** | JavaScript | Medium | Snippet | Parallel execution in `.forEach` instead of serial `for...of` |

---

## 🛡️ Security & Sandboxing Architecture

Code execution safety is enforced by:
1. **VM Isolation**: User scripts run in isolated Node `vm.createContext()` scopes without access to the host `process`, `fs`, `child_process`, or internal network sockets.
2. **Execution Timeouts**: Script evaluations are capped at 3000ms to safeguard against deliberate or accidental infinite loops.
3. **Output Interception**: The sandbox captures `console.log`, `console.error`, and `console.warn` streams and formats them safely for frontend display.

---

## 📜 License
MIT License. Built for software engineers who value deep code comprehension and precision debugging.

