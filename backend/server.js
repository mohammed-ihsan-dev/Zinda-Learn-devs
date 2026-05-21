import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://zinda-learn.vercel.app', // update this to your actual Vercel/Netlify frontend URL if different
    'https://zindalearn.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
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
  res.json({ success: true, message: 'Zinda Learn API is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5005;

httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
});
