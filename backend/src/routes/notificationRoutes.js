/**
 * notificationRoutes.js
 * Express router for notification endpoints.
 */

const express = require('express');
const { getNotificationsHandler, markNotificationReadHandler } = require('../controllers/notificationController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all notification routes
router.use(authenticateJWT);

// GET /api/notifications
router.get('/', getNotificationsHandler);

// PUT /api/notifications/:id/read
router.put('/:id/read', markNotificationReadHandler);

module.exports = router;
