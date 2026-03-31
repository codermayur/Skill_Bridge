import express from 'express';
import { protect } from '../middleware/auth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

router.get('/stats', adminController.getPlatformStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/ban', adminController.banUser);

export default router;
