import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import documentRoutes from './routes/documents.routes';
import feedbackRoutes from './routes/feedback.routes';
import adminRoutes from './routes/admin.routes';
import templateRoutes from './routes/templates.routes';
import aiRoutes from './routes/ai.routes';
import exportRoutes from './routes/export.routes';
import healthRoutes from './routes/health.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

// Trust reverse proxy (Render / Cloud load balancer single hop) for accurate client IP in express-rate-limit
app.set('trust proxy', 1);

const rawFrontendUrls = process.env.FRONTEND_URL || 'http://localhost:5173';
const configuredOrigins = rawFrontendUrls
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];
const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Robust CORS supporting custom domains (e.g. dpdns.org), Vercel previews, and localhost
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin that accesses the API (reflects the origin for credential support)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

app.get('/api', (_req, res) => {
  res.json({
    name: 'AI Resume Builder API',
    status: 'online',
    version: '1.0.0'
  });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'AI Resume Builder API',
    status: 'online',
    version: '1.0.0'
  });
});

export default app;
