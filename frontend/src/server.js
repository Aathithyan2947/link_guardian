import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Import configurations and middleware
import { corsConfig } from './config/cors.js';
import { rateLimitConfig } from './config/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { securityHeaders } from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import analyticsRoutes from './routes/analytics.js';
import organizationRoutes from './routes/organizations.js';
import domainRoutes from './routes/domains.js';
import brandingRoutes from './routes/branding.js';
import apiTokenRoutes from './routes/apiTokens.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import webhookRoutes from './routes/webhooks.js';
import redirectRoutes from './routes/redirect.js';
import healthRoutes from './routes/health.js';
import docsRoutes from './routes/docs.js';

// Import services
import { initializeFirebase } from './config/firebase.js';
import { connectRedis } from './config/redis.js';
import { startHealthCheckCron } from './services/healthCheck.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Initialize external services
await initializeFirebase();
await connectRedis();

// Security middleware
app.use(helmet(securityHeaders));
app.use(cors(corsConfig));

// Request parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(requestLogger);

// Rate limiting
app.use(rateLimitConfig);

// Health check endpoint (before other routes)
app.use('/health', healthRoutes);

// API Documentation
app.use('/docs', docsRoutes);

// Redirect routes (should be before API routes to catch short links)
app.use('/', redirectRoutes);

// API routes
const apiRouter = express.Router();

// Mount API routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/links', linkRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/organizations', organizationRoutes);
apiRouter.use('/domains', domainRoutes);
apiRouter.use('/branding', brandingRoutes);
apiRouter.use('/api-tokens', apiTokenRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/webhooks', webhookRoutes);

// Mount API router
app.use(`/api/${API_VERSION}`, apiRouter);

// Serve static files for branding assets
app.use('/assets', express.static(join(__dirname, '../uploads')));

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 LinkGuardian API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV}`);
});

// Start background services
startHealthCheckCron();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;