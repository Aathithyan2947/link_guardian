import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);
  
  // Log request details
  const startTime = Date.now();
  
  // Override res.end to log response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    // Log request/response details
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      organizationId: req.organization?.id
    }));
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Request context middleware
export const requestContext = (req, res, next) => {
  req.context = {
    requestId: req.requestId,
    timestamp: new Date(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    method: req.method,
    url: req.url
  };
  
  next();
};