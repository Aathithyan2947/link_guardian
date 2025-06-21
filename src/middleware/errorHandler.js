import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2014') {
    const message = 'Invalid ID';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2003') {
    const message = 'Invalid input data';
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400);
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    error = new AppError('CORS policy violation', 403);
  }

  // Rate limit errors
  if (err.message && err.message.includes('Too many requests')) {
    error = new AppError('Rate limit exceeded', 429);
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error = new AppError('Internal server error', 500);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};