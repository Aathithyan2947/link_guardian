import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';
import { getRedisClient } from '../config/redis.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    services: {}
  };

  let isHealthy = true;

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = { status: 'healthy' };
  } catch (error) {
    health.services.database = { status: 'unhealthy', error: error.message };
    isHealthy = false;
  }

  // Check Redis connection
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.ping();
      health.services.redis = { status: 'healthy' };
    } else {
      health.services.redis = { status: 'not_configured' };
    }
  } catch (error) {
    health.services.redis = { status: 'unhealthy', error: error.message };
    // Redis is optional, don't mark as unhealthy
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
  };

  if (!isHealthy) {
    health.status = 'unhealthy';
    return res.status(503).json(health);
  }

  res.json(health);
}));

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', asyncHandler(async (req, res) => {
  try {
    // Check if database is ready
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}));

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;