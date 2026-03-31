import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/userValidator.js';

const router = express.Router();

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, validate(updateProfileSchema), userController.updateProfile);

export default router;
