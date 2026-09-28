import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';

import authRoutes from './routes/auth.routes';
import templateRoutes from './routes/templates.routes';
import aiRoutes from './routes/ai.routes';
import exportRoutes from './routes/export.routes';
import healthRoutes from './routes/health.routes';

const app = express();

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

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, mobile, and same-origin requests without Origin header
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes('*') ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    // Reject other origins in strict mode
    return callback(new Error(`Origin ${origin} not permitted by CORS policy`));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/health', healthRoutes);

app.get('/api', (_req, res) => {
  res.json({
    name: 'AI Resume Builder API',
    status: 'online',
    version: '1.0.0'
  });
});

export default app;
