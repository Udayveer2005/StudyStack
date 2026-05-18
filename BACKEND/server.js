/**
 * StudyStack Backend - Express Server (Entry Point)
 * =================================================
 * This file is the main entry point for our Node.js backend.
 * It sets up the Express application, configures middleware,
 * mounts all API routes, and starts the HTTP server.
 *
 * Architecture: Client-Server
 * - React frontend (client) runs on port 3000
 * - This Node + Express server (backend) runs on port 5000
 * - Data is stored in JSON files (simulating a database) using fs module
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ConnectMongo = require('connect-mongo');
const MongoStore = ConnectMongo.MongoStore || ConnectMongo.default || ConnectMongo;
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import error-handling middleware (runs when no route matches or when next(err) is called)
const { notFound, errorHandler } = require('./middleware/errorHandler');
// Import route modules - each handles a group of related endpoints
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const enrollmentController = require('./controllers/enrollmentController');
const itemRoutes = require('./routes/items');
const testimonialRoutes = require('./routes/testimonials');
const userController = require('./controllers/userController');
const progressRoutes = require('./routes/progress');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const testRoutes = require('./routes/tests');
const { connectDb } = require('./config/db');
const { setupSocket } = require('./socket/setupSocket');
const { seedIfEmpty } = require('./config/seed');
// ── PostgreSQL (evaluation only — does NOT affect MongoDB or existing routes) ──
const { connectPg } = require('./config/pg');
const { setupPgTables, seedPgData } = require('./config/pgSetup');
const pgEvalRoutes = require('./routes/pgEval');

// ========== Express Application Setup ==========
// Create the Express app object. This object is used to configure middleware and routes.
const app = express();
const PORT = process.env.PORT || 5000;

// Enable EJS (SSR) template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ========== Middleware (Order matters! These run for every request) ==========
// 1. CORS (Cross-Origin Resource Sharing): Allows our React app (different port) to call this API.
//    Without CORS, the browser would block requests from localhost:3000 to localhost:5000.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(morgan('dev'));

// Cookie parsing (required for refresh-token cookie + normal cookie demo)
app.use(cookieParser());

// 2. Body parsing (JSON + URL-encoded) with size limits + graceful parse errors
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '1mb' }));

// Handle body-parser JSON errors (e.g., invalid JSON)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  return next(err);
});

// Session management (Mongo-backed when MONGO_URI exists; otherwise in-memory for development)
const sessionOptions = {
  name: 'studystack.sid',
  secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

if (process.env.MONGO_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  });
}

app.use(session(sessionOptions));

// 3. Static files: Serves files from the 'public' folder (e.g. images, videos).
//    Example: A request to /images/logo.png would serve backend/public/images/logo.png
app.use(express.static(path.join(__dirname, 'public')));

// ========== Route Mounting (Modular Routing) ==========
// Each app.use(path, router) mounts a group of routes under a base path.
// When a request comes in, Express matches the URL to these routes in order.

// Courses: GET /courses, GET /courses/:id, POST /courses
app.use('/courses', courseRoutes);

// Dashboard items: GET/POST/PUT/DELETE /items
app.use('/items', itemRoutes);

// Testimonials: GET /testimonials (used by Home page)
app.use('/testimonials', testimonialRoutes);

// Users: GET /users, POST /users (register via /users)
app.use('/users', userRoutes);

// Auth routes
app.use('/auth', authRoutes);

// Keep compatibility with existing frontend calling root /login and /register
app.post('/login', userController.login);
app.post('/register', userController.register);

// Enrollments: POST /enroll (enroll user in course), GET /enrollments (list enrollments)
app.post('/enroll', (req, res, next) => enrollmentController.enrollUser(req, res, next));
app.get('/enrollments', (req, res, next) => enrollmentController.getEnrollments(req, res, next));

// Progress: GET/POST /progress (per-user course lecture progress)
app.use('/progress', progressRoutes);

// Tests: teacher creates, students attempt, teacher grades
app.use('/tests', testRoutes);

// PostgreSQL Evaluation routes (independent of MongoDB)
app.use('/pg', pgEvalRoutes);

// SSR pages (EJS)
app.use('/', pageRoutes);

// Health check (useful to confirm Atlas connection / blocking)
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const stateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][state] || 'unknown';
  res.json({
    ok: true,
    server: 'studystack-backend',
    mongo: { state, stateText, hasMongoUri: Boolean(process.env.MONGO_URI) }
  });
});

// ========== Exception Handling Middleware ==========
// These run only if no previous route sent a response.
// notFound: handles 404 when no route matches the request URL
app.use(notFound);
// errorHandler: catches errors passed via next(err) from any route/controller
app.use(errorHandler);

// ========== Start the HTTP Server ==========
// app.listen() binds the server to the given port and starts listening for incoming requests.
// The callback runs once the server is ready. From now on, requests to http://localhost:5000/* hit this app.
(async () => {
  const hasMongo = Boolean(process.env.MONGO_URI);
  if (hasMongo) {
    try {
      await connectDb();
      if (process.env.SEED_DB === 'true') {
        await seedIfEmpty();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message || err);
      // eslint-disable-next-line no-console
      console.error('Continuing without MongoDB. Set MONGO_URI and start MongoDB to enable DB-backed routes/sessions.');
    }
  }

  // ── PostgreSQL (evaluation only) ─────────────────────────────────────────
  if (process.env.PG_CONNECTION_STRING) {
    try {
      connectPg();
      await setupPgTables();
      await seedPgData();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PostgreSQL] Init error:', err.message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('[PostgreSQL] PG_CONNECTION_STRING not set — skipping PostgreSQL init.');
  }
  // ─────────────────────────────────────────────────────────────────────────

  const server = http.createServer(app);
  setupSocket(server);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.error(`Port ${PORT} is already in use. Stop the process using this port or change PORT in .env.`);
    } else {
      // eslint-disable-next-line no-console
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`StudyStack backend running at http://localhost:${PORT}`);
  });
})();
