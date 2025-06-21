import express from 'express';
import { authenticateFirebase } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { authRateLimit } from '../config/rateLimit.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Apply auth rate limiting to all routes
router.use(authRateLimit);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase ID token
 *               userData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   plan:
 *                     type: string
 *                     enum: [FREE, STARTER, PRO, ENTERPRISE]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', 
  validate(schemas.createUser, 'body'),
  asyncHandler(authController.register)
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase ID token
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateFirebase, asyncHandler(authController.getProfile));

/**
 * @swagger
 * /api/v1/auth/me:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/me', 
  authenticateFirebase,
  validate(schemas.updateUser, 'body'),
  asyncHandler(authController.updateProfile)
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticateFirebase, asyncHandler(authController.logout));

/**
 * @swagger
 * /api/v1/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete-account', 
  authenticateFirebase, 
  asyncHandler(authController.deleteAccount)
);

export default router;