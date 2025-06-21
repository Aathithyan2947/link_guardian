import express from 'express';
import { authenticateFirebase, authenticateApiToken, authorize, requireScope } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { createApiRateLimit } from '../config/rateLimit.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as linkController from '../controllers/linkController.js';

const router = express.Router();

// Apply API rate limiting
router.use(createApiRateLimit(1000));

/**
 * @swagger
 * /api/v1/links:
 *   get:
 *     summary: Get user's links
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: healthStatus
 *         schema:
 *           type: string
 *           enum: [HEALTHY, WARNING, ERROR, UNKNOWN]
 *     responses:
 *       200:
 *         description: Links retrieved successfully
 */
router.get('/', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, next);
    }
  },
  validate(schemas.pagination, 'query'),
  asyncHandler(linkController.getLinks)
);

/**
 * @swagger
 * /api/v1/links:
 *   post:
 *     summary: Create a new link
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *               shortCode:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               maxClicks:
 *                 type: integer
 *               password:
 *                 type: string
 *               enableTracking:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Link created successfully
 */
router.post('/', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, (err) => {
        if (err) return next(err);
        requireScope('write')(req, res, next);
      });
    }
  },
  validate(schemas.createLink, 'body'),
  asyncHandler(linkController.createLink)
);

/**
 * @swagger
 * /api/v1/links/{id}:
 *   get:
 *     summary: Get link by ID
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link retrieved successfully
 *       404:
 *         description: Link not found
 */
router.get('/:id', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, next);
    }
  },
  asyncHandler(linkController.getLinkById)
);

/**
 * @swagger
 * /api/v1/links/{id}:
 *   put:
 *     summary: Update link
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               maxClicks:
 *                 type: integer
 *               password:
 *                 type: string
 *               enableTracking:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Link updated successfully
 */
router.put('/:id', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, (err) => {
        if (err) return next(err);
        requireScope('write')(req, res, next);
      });
    }
  },
  validate(schemas.updateLink, 'body'),
  asyncHandler(linkController.updateLink)
);

/**
 * @swagger
 * /api/v1/links/{id}:
 *   delete:
 *     summary: Delete link
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link deleted successfully
 */
router.delete('/:id', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, (err) => {
        if (err) return next(err);
        requireScope('write')(req, res, next);
      });
    }
  },
  asyncHandler(linkController.deleteLink)
);

/**
 * @swagger
 * /api/v1/links/{id}/health:
 *   post:
 *     summary: Check link health
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Health check completed
 */
router.post('/:id/health', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, next);
    }
  },
  asyncHandler(linkController.checkLinkHealth)
);

/**
 * @swagger
 * /api/v1/links/bulk:
 *   post:
 *     summary: Create multiple links
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - links
 *             properties:
 *               links:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - originalUrl
 *                   properties:
 *                     originalUrl:
 *                       type: string
 *                       format: uri
 *                     shortCode:
 *                       type: string
 *                     title:
 *                       type: string
 *     responses:
 *       201:
 *         description: Links created successfully
 */
router.post('/bulk', 
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateFirebase(req, res, next);
    } else {
      authenticateApiToken(req, res, (err) => {
        if (err) return next(err);
        requireScope('write')(req, res, next);
      });
    }
  },
  asyncHandler(linkController.createBulkLinks)
);

export default router;