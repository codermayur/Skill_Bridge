import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import testScoreRoutes from './routes/testScores.js';
import userRoutes from './routes/user.js';
import requestRoutes from './routes/requests.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

// Validate required environment variables at startup
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

connectDB();

const app = express();
const server = http.createServer(app);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
};

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new SocketServer(server, { cors: corsOptions });

// Socket.io auth middleware — verify JWT before any socket event
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  // Join personal room for targeted notifications
  socket.join(`user:${socket.userId}`);

  // Join request-specific room for chat
  socket.on('join_request', (requestId) => {
    socket.join(`request:${requestId}`);
  });

  socket.on('leave_request', (requestId) => {
    socket.leave(`request:${requestId}`);
  });

  socket.on('disconnect', () => {
    // rooms are cleaned up automatically
  });
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// ─── Express Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/testscores', testScoreRoutes);
app.use('/api/user', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', env: process.env.NODE_ENV });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  server
    .listen(port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`
      );
      console.log('Socket.io ready');
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${port} is already in use. Please stop the other process or set a different PORT environment variable.`
        );
      } else {
        console.error('Failed to start server:', err);
      }
      process.exit(1);
    });
};

startServer(PORT);
