import './config/env.js';

import express from 'express';
import cors from 'cors';

import morgan from 'morgan';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initSocket } from './sockets/index.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';
import messageRoutes from './routes/messages.js';
import instructorRoutes from './routes/instructor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import videoRoutes from './routes/video.routes.js';
import liveClassRoutes from './modules/liveClasses/routes/liveClass.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import studentProgressRoutes from './routes/studentProgress.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import studentSettingsRoutes from './routes/studentSettings.routes.js';
import publicRoutes from './routes/public.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import supportRoutes from './routes/support.routes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { startLiveClassScheduler } from './services/liveClassScheduler.js';

// ─── Global error handlers — prevent PM2/Node process from dying on unhandled errors ──
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message);
  console.error(err.stack);
  // Give in-flight requests a moment to complete, then exit so PM2 can restart cleanly
  setTimeout(() => process.exit(1), 500);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Promise Rejection at:', promise);
  console.error('Reason:', reason);
  // Do NOT exit on unhandledRejection in production — log and continue
  // PM2 will restart only if the process actually crashes
});

// Connect to database
connectDB();

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// CORS — allow Vercel frontend + local dev origins
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.APP_URL,
      // Local dev only — excluded in production
      ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
      ] : [])
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl, Postman, same-origin SSR)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Compact production log: IP, method, URL, status, response time
  app.use(morgan('combined'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/student/progress', studentProgressRoutes);
app.use('/api/student/certificates', certificateRoutes);
app.use('/api/student/settings', studentSettingsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/support', supportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zinda Learn API is running',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be after routes)
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5005;

// Bind to '0.0.0.0' so EC2 accepts external connections (not just 127.0.0.1)
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(` Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  startLiveClassScheduler();
});
