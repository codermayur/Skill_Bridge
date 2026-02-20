# Skill Bridge - Coding Practice Platform

A comprehensive coding practice platform with backend integration, user authentication, and support for multiple programming languages and topics.

## Features

### Backend
- **MongoDB** database for user data and test scores
- **JWT Authentication** for secure user sessions
- **NodeMailer** integration for:
  - Password reset emails
  - Test score emails
- RESTful API endpoints for:
  - User registration and login
  - Password reset functionality
  - Test score submission and retrieval
  - User profile management

### Frontend
- **React** with Vite for fast development
- User authentication (Login, Signup, Forgot Password, Reset Password)
- Practice pages for multiple languages:
  - JavaScript, Python, Java, C++, React, SQL
  - DSA in Java, Python, C++
  - Machine Learning
  - Data Analytics
- Real-time score tracking
- Email notifications for test results

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@skillbridge.com
FRONTEND_URL=http://localhost:5173
```

5. Make sure MongoDB is running on your system

6. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resetToken` - Reset password

### Test Scores
- `POST /api/testscores` - Submit test score (Protected)
- `GET /api/testscores` - Get user's test scores (Protected)
- `GET /api/testscores/:language` - Get scores for specific language (Protected)

### User Profile
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- CORS

### Frontend
- React 19
- React Router DOM
- Vite
- CSS3

## Project Structure

```
todolist/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── TestScore.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── testScores.js
│   │   └── user.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   └── emailTemplates.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Result.jsx
│   │   ├── questionsData.jsx
│   │   ├── JavaPractice.jsx
│   │   ├── DSAPractice.jsx
│   │   ├── MLPractice.jsx
│   │   └── DataAnalyticsPractice.jsx
│   ├── services/
│   │   └── api.js
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   └── App.jsx
└── package.json
```

## Usage

1. Start MongoDB service
2. Start the backend server (`cd backend && npm run dev`)
3. Start the frontend server (`npm run dev`)
4. Open `http://localhost:5173` in your browser
5. Sign up for a new account or login
6. Select a language/topic to practice
7. Complete the quiz and receive your score via email

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS` in `.env`

## License

ISC
