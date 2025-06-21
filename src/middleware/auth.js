import jwt from 'jsonwebtoken';
import { verifyFirebaseToken } from '../config/firebase.js';
import prisma from '../config/database.js';
import { AppError } from '../utils/errors.js';

// Firebase authentication middleware
export const authenticateFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyFirebaseToken(token);
    
    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: {
        organizations: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          emailVerified: decodedToken.email_verified || false,
          lastLoginAt: new Date()
        },
        include: {
          organizations: {
            include: {
              organization: true
            }
          }
        }
      });
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

// API token authentication middleware
export const authenticateApiToken = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      throw new AppError('API key required', 401);
    }

    const apiToken = await prisma.apiToken.findUnique({
      where: { 
        token: apiKey,
        isActive: true
      },
      include: {
        user: true,
        organization: true
      }
    });

    if (!apiToken) {
      throw new AppError('Invalid API key', 401);
    }

    if (apiToken.expiresAt && apiToken.expiresAt < new Date()) {
      throw new AppError('API key expired', 401);
    }

    // Update last used timestamp
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() }
    });

    req.apiToken = apiToken;
    req.user = apiToken.user;
    req.organization = apiToken.organization;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      await authenticateFirebase(req, res, next);
    } else if (apiKey) {
      await authenticateApiToken(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const organizationId = req.headers['x-organization-id'] || req.params.organizationId;
      
      if (organizationId) {
        const membership = await prisma.organizationMember.findFirst({
          where: {
            userId: req.user.id,
            organizationId: organizationId,
            isActive: true
          },
          include: {
            organization: true
          }
        });

        if (!membership) {
          throw new AppError('Access denied to organization', 403);
        }

        if (!roles.includes(membership.role)) {
          throw new AppError('Insufficient permissions', 403);
        }

        req.organization = membership.organization;
        req.userRole = membership.role;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Admin authorization middleware
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Check if user is system admin (you can implement this logic)
    const isAdmin = req.user.email === process.env.ADMIN_EMAIL || 
                   req.user.plan === 'ENTERPRISE'; // or any other admin logic

    if (!isAdmin) {
      throw new AppError('Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Scope-based authorization for API tokens
export const requireScope = (...scopes) => {
  return (req, res, next) => {
    try {
      if (!req.apiToken) {
        throw new AppError('API token required', 401);
      }

      const hasRequiredScope = scopes.some(scope => 
        req.apiToken.scopes.includes(scope) || req.apiToken.scopes.includes('admin')
      );

      if (!hasRequiredScope) {
        throw new AppError('Insufficient API permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};