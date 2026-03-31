# Skill Bridge 🚀

A **full-stack SaaS platform** connecting people who need help with people who have skills — combining a coding quiz practice engine with a real-time help-request marketplace.

---

## Features

### Core Platform
- **Help Request Marketplace** — Post requests, get matched with helpers, track progress from Pending → Accepted → In Progress → Completed
- **Real-time Chat** — Socket.io powered messaging between requester and helper
- **Rating & Review System** — Leave reviews after completed requests; helper reputation scores update automatically
- **Real-time Notifications** — Bell icon with live updates for request acceptance, messages, completions, and reviews

### Coding Practice Engine
- **12+ Programming Languages** — JavaScript, Python, Java, C++, React, SQL, DSA, ML, Data Analytics
- **Quiz Engine** — 10 randomized questions per session, difficulty tagging, instant feedback
- **Score Tracking** — Scores saved per user with language breakdown; results emailed automatically

### AI Features
- **Smart Skill Matching** — TF-IDF + cosine similarity ranks top 5 helpers per request
- **Auto-Categorization** — Keyword-dictionary NLP auto-tags requests (Programming, Design, Writing, etc.)
- **AI Writing Assistant** — Tips panel on the Create Request page

### Security & Architecture
- JWT authentication with environment validation
- Helmet security headers + rate limiting (global + auth-specific)
- MongoDB operator injection protection (express-mongo-sanitize)
- CORS origin whitelist
- Clean 4-layer backend: Routes → Controllers → Services → Repositories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, TailwindCSS |
| State | React Context (AuthContext), custom hooks |
| Backend | Node.js, Express 4, Socket.io |
| Database | MongoDB 7 + Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | Joi schemas per route |
| Email | Nodemailer |
| Testing | Jest + @jest/globals (ES modules) |
| DevOps | Docker, docker-compose, GitHub Actions CI |

---

## Project Structure

```
Skill_Bridge/
├── backend/
│   ├── controllers/        # Thin HTTP handlers
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   ├── requestService.js
│   │   ├── matchingService.js   ← AI skill matching
│   │   ├── categorizationService.js  ← AI auto-categorization
│   │   ├── messageService.js
│   │   ├── notificationService.js
│   │   └── reviewService.js
│   ├── repositories/       # All DB queries
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Request.js
│   │   ├── Message.js
│   │   ├── Review.js
│   │   └── Notification.js
│   ├── routes/             # Express routers
│   ├── middleware/         # auth, errorHandler, validate
│   ├── validators/         # Joi schemas
│   ├── utils/              # generateToken, sendEmail, emailTemplates
│   ├── __tests__/          # Jest unit tests
│   └── server.js           # Express + Socket.io entry point
│
├── front/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state
│       ├── hooks/
│       │   ├── useQuiz.js          # Shared quiz logic
│       │   └── useSocket.js        # Socket.io connection
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ErrorBoundary/
│       │   └── notifications/
│       │       └── NotificationBell.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── requests/
│       │   │   ├── RequestsPage.jsx
│       │   │   ├── CreateRequestPage.jsx
│       │   │   └── RequestDetailPage.jsx
│       │   └── admin/
│       │       └── AdminPage.jsx
│       └── services/
│           └── api.js              # All API client functions
│
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone <repo-url>
cd Skill_Bridge

# Backend
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev

# Frontend (new terminal)
cd ../front
cp .env.example .env
npm install
npm run dev
```

### 2. Environment Variables

#### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (32+ chars) |
| `JWT_EXPIRE` | | Token expiry (default: `7d`) |
| `FRONTEND_URL` | | Used in password reset emails |
| `ALLOWED_ORIGINS` | | Comma-separated CORS origins for production |
| `EMAIL_HOST` | | SMTP host |
| `EMAIL_PORT` | | SMTP port (default: 587) |
| `EMAIL_USER` | | SMTP username |
| `EMAIL_PASS` | | SMTP password or app password |

#### Frontend (`front/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |

---

## Docker (Production)

```bash
# Copy and fill the root .env with JWT_SECRET etc.
cp backend/.env.example .env

docker-compose up --build
```

App is served at `http://localhost` (nginx), API at `http://localhost:5000`.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/forgotpassword` | No | Send reset email |
| PUT | `/api/auth/resetpassword/:token` | No | Reset password |

### Requests
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/requests` | No | List requests (filter by status, category, skill, q) |
| POST | `/api/requests` | ✅ | Create request (AI auto-categorizes) |
| GET | `/api/requests/:id` | No | Get single request |
| PUT | `/api/requests/:id` | ✅ | Edit request (requester only, pending) |
| PATCH | `/api/requests/:id/status` | ✅ | Update status |
| POST | `/api/requests/:id/accept` | ✅ | Accept request as helper |
| GET | `/api/requests/:id/matches` | ✅ | Get AI-matched helpers |
| GET | `/api/requests/me/requests` | ✅ | My posted requests |
| GET | `/api/requests/me/helping` | ✅ | Requests I'm helping with |

### Messages, Reviews, Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/messages/:requestId` | ✅ | Get chat messages |
| POST | `/api/messages/:requestId` | ✅ | Send message |
| POST | `/api/reviews` | ✅ | Submit review (requester, completed only) |
| GET | `/api/reviews/helper/:helperId` | No | Helper reviews |
| GET | `/api/notifications` | ✅ | My notifications |
| PATCH | `/api/notifications/read-all` | ✅ | Mark all read |
| PATCH | `/api/notifications/:id/read` | ✅ | Mark one read |

### User & Scores
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/profile` | ✅ | My profile |
| PUT | `/api/user/profile` | ✅ | Update profile |
| POST | `/api/testscores` | ✅ | Submit quiz score |
| GET | `/api/testscores` | ✅ | My scores |
| GET | `/api/testscores/:language` | ✅ | Scores by language |

---

## Testing

```bash
cd backend
npm test
```

**14 passing tests** across:
- `categorizationService` — category detection, skill extraction
- `matchingService` — cosine similarity ranking, result shape
- `authService` — signup/login business logic with mocked repositories

---

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join_request` | Client → Server | Join a request's chat room |
| `leave_request` | Client → Server | Leave a request's chat room |
| `new_message` | Server → Client | Real-time chat message |
| `notification` | Server → Client | Real-time notification |

Authentication: pass the JWT token in `socket.handshake.auth.token`.

---

## License

MIT
