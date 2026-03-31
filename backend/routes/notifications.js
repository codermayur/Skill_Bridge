import express from 'express';
import * as notifController from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, notifController.getNotifications);
router.patch('/read-all', protect, notifController.markAllAsRead);
router.patch('/:id/read', protect, notifController.markAsRead);
router.delete('/:id', protect, notifController.deleteNotification);

export default router;
