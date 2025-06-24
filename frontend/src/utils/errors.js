export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

// Common error types
export const errors = {
  VALIDATION_ERROR: (message) => new AppError(message, 400),
  UNAUTHORIZED: (message = 'Unauthorized') => new AppError(message, 401),
  FORBIDDEN: (message = 'Forbidden') => new AppError(message, 403),
  NOT_FOUND: (message = 'Resource not found') => new AppError(message, 404),
  CONFLICT: (message = 'Resource already exists') => new AppError(message, 409),
  RATE_LIMITED: (message = 'Rate limit exceeded') => new AppError(message, 429),
  INTERNAL_ERROR: (message = 'Internal server error') => new AppError(message, 500),
  SERVICE_UNAVAILABLE: (message = 'Service unavailable') => new AppError(message, 503)
};