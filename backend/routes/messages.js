import express from 'express';
import * as messageController from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { sendMessageSchema } from '../validators/messageValidator.js';

const router = express.Router();

router.get('/:requestId', protect, messageController.getMessages);
router.post('/:requestId', protect, validate(sendMessageSchema), messageController.sendMessage);

export default router;
