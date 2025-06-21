import Joi from 'joi';
import { AppError } from '../utils/errors.js';

// Generic validation middleware
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(`Validation error: ${errorMessage}`, 400));
    }

    req[property] = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  createUser: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(100),
    plan: Joi.string().valid('FREE', 'STARTER', 'PRO', 'ENTERPRISE').default('FREE')
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100),
    avatar: Joi.string().uri()
  }),

  // Link schemas
  createLink: Joi.object({
    originalUrl: Joi.string().uri().required(),
    shortCode: Joi.string().alphanum().min(3).max(20),
    title: Joi.string().max(200),
    description: Joi.string().max(500),
    tags: Joi.array().items(Joi.string().max(50)).max(10),
    expiresAt: Joi.date().greater('now'),
    maxClicks: Joi.number().integer().positive(),
    password: Joi.string().min(4).max(100),
    enableTracking: Joi.boolean().default(true),
    organizationId: Joi.string().uuid()
  }),

  updateLink: Joi.object({
    originalUrl: Joi.string().uri(),
    title: Joi.string().max(200),
    description: Joi.string().max(500),
    tags: Joi.array().items(Joi.string().max(50)).max(10),
    expiresAt: Joi.date().greater('now').allow(null),
    maxClicks: Joi.number().integer().positive().allow(null),
    password: Joi.string().min(4).max(100).allow(null),
    enableTracking: Joi.boolean(),
    isActive: Joi.boolean()
  }),

  // Organization schemas
  createOrganization: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().alphanum().min(3).max(50).required(),
    description: Joi.string().max(500),
    avatar: Joi.string().uri()
  }),

  updateOrganization: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    avatar: Joi.string().uri()
  }),

  inviteMember: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('ADMIN', 'MEMBER', 'VIEWER').default('MEMBER')
  }),

  updateMemberRole: Joi.object({
    role: Joi.string().valid('ADMIN', 'MEMBER', 'VIEWER').required()
  }),

  // Domain schemas
  createDomain: Joi.object({
    domain: Joi.string().domain().required(),
    organizationId: Joi.string().uuid()
  }),

  // Branding schemas
  updateBranding: Joi.object({
    logo: Joi.string().uri(),
    favicon: Joi.string().uri(),
    primaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
    secondaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
    customCss: Joi.string().max(10000),
    redirectTitle: Joi.string().max(100),
    redirectMessage: Joi.string().max(500)
  }),

  // API Token schemas
  createApiToken: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    scopes: Joi.array().items(Joi.string().valid('read', 'write', 'admin')).min(1).required(),
    expiresAt: Joi.date().greater('now'),
    organizationId: Joi.string().uuid()
  }),

  // Query parameter schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  dateRange: Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate'))
  }),

  // Analytics schemas
  analyticsQuery: Joi.object({
    startDate: Joi.date().default(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    endDate: Joi.date().default(() => new Date()),
    groupBy: Joi.string().valid('hour', 'day', 'week', 'month').default('day'),
    timezone: Joi.string().default('UTC')
  })
};

// Sanitization middleware
export const sanitize = (req, res, next) => {
  // Basic XSS protection for string fields
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
        // Remove potential XSS patterns
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        obj[key] = obj[key].replace(/javascript:/gi, '');
        obj[key] = obj[key].replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};