import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as redirectController from '../controllers/redirectController.js';

const router = express.Router();

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Short code of the link
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         description: Password for protected links
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: Link not found
 *       410:
 *         description: Link expired
 *       403:
 *         description: Password required or incorrect
 */
router.get('/:shortCode', asyncHandler(redirectController.redirect));

/**
 * @swagger
 * /{shortCode}/preview:
 *   get:
 *     summary: Preview link information
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link preview information
 *       404:
 *         description: Link not found
 */
router.get('/:shortCode/preview', asyncHandler(redirectController.preview));

export default router;