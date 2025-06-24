import { verifyFirebaseToken, getFirebaseUser } from '../config/firebase.js';
import prisma from '../config/database.js';
import { AppError } from '../utils/errors.js';
import { generateApiToken } from '../utils/helpers.js';

export const register = async (req, res) => {
  const { idToken, userData = {} } = req.body;

  // Verify Firebase token
  const decodedToken = await verifyFirebaseToken(idToken);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { firebaseUid: decodedToken.uid }
  });

  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  // Create user in database
  const user = await prisma.user.create({
    data: {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      name: userData.name || decodedToken.name,
      emailVerified: decodedToken.email_verified || false,
      plan: userData.plan || 'FREE',
      lastLoginAt: new Date()
    }
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    }
  });
};

export const login = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new AppError('Firebase ID token is required', 400);
  }

  // Verify Firebase token
  const decodedToken = await verifyFirebaseToken(idToken);
  
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
    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
      include: {
        organizations: {
          include: {
            organization: true
          }
        }
      }
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        emailVerified: user.emailVerified,
        organizations: user.organizations.map(om => ({
          id: om.organization.id,
          name: om.organization.name,
          slug: om.organization.slug,
          role: om.role
        })),
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    }
  });
};

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      organizations: {
        include: {
          organization: true
        }
      },
      _count: {
        select: {
          links: true,
          apiTokens: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        planExpiresAt: user.planExpiresAt,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        organizations: user.organizations.map(om => ({
          id: om.organization.id,
          name: om.organization.name,
          slug: om.organization.slug,
          role: om.role,
          joinedAt: om.joinedAt
        })),
        stats: {
          totalLinks: user._count.links,
          totalApiTokens: user._count.apiTokens
        },
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
};

export const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(avatar && { avatar })
    }
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        updatedAt: user.updatedAt
      }
    }
  });
};

export const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the logout event or invalidate refresh tokens if used
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  // Delete user and all related data (cascade delete)
  await prisma.user.delete({
    where: { id: userId }
  });

  // TODO: Also delete from Firebase Auth
  // await admin.auth().deleteUser(req.user.firebaseUid);

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
};