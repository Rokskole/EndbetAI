// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { config } from '@packages/config';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/routes';
import { usersRouter } from './modules/users/routes';
import { journalRouter } from './modules/journal/routes';
import { financeRouter } from './modules/finance/routes';
import { tasksRouter } from './modules/tasks/routes';
import { sosRouter } from './modules/sos/routes';
import { chatRouter } from './modules/chat/routes';
import { contentRouter } from './modules/content/routes';
import { paymentsRouter } from './modules/payments/routes';


// Configuration loaded

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.api.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing and compression
app.use(compression());
// Note: Webhook route uses raw body - must be before JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.development.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/journal', journalRouter);
app.use('/api/finance', financeRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/sos', sosRouter);
app.use('/api/chat', chatRouter);
app.use('/api/content', contentRouter);
app.use('/api/payments', paymentsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.api.port;
const HOST = config.api.host;

app.listen(PORT, HOST, () => {
  console.log(`🚀 QuitBet AI API server running on ${HOST}:${PORT}`);
  console.log(`📊 Environment: ${config.development.isDev ? 'Development' : 'Production'}`);
  console.log(`🔒 Crisis detection: ${config.features.enableCrisisDetection ? 'Enabled' : 'Disabled'}`);
  console.log(`🤖 AI chat: ${config.features.enableAiChat ? 'Enabled' : 'Disabled'}`);
});

export default app;
