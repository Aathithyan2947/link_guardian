import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from './redis.js';

// Create rate limit store
const createStore = () => {
  const redisClient = getRedisClient();
  if (redisClient) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
  }
  return undefined; // Use memory store as fallback
};

// General rate limiting
export const rateLimitConfig = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 'Check the Retry-After header for when to retry.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Strict rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
});

// API rate limiting based on plan
export const createApiRateLimit = (maxRequests = 1000) => {
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: maxRequests,
    message: {
      error: 'API rate limit exceeded for your plan.',
      upgrade: 'Consider upgrading your plan for higher limits.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    }
  });
};

// Slow down middleware for suspicious activity
export const slowDownConfig = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  store: createStore(),
});

// Plan-based rate limits
export const PLAN_LIMITS = {
  FREE: {
    requests: 100,
    links: 10,
    clicks: 1000
  },
  STARTER: {
    requests: 1000,
    links: 100,
    clicks: 10000
  },
  PRO: {
    requests: 10000,
    links: 1000,
    clicks: 100000
  },
  ENTERPRISE: {
    requests: 100000,
    links: -1, // unlimited
    clicks: -1 // unlimited
  }
};