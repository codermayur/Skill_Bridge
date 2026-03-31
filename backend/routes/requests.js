import express from 'express';
import * as requestController from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createRequestSchema,
  updateRequestSchema,
  updateStatusSchema,
} from '../validators/requestValidator.js';

const router = express.Router();

// Public — browsing requests
router.get('/', requestController.getRequests);
router.get('/:id', requestController.getRequestById);
router.get('/:id/matches', protect, requestController.getMatchingHelpers);

// Authenticated
router.post('/', protect, validate(createRequestSchema), requestController.createRequest);
router.put('/:id', protect, validate(updateRequestSchema), requestController.updateRequest);
router.patch('/:id/status', protect, validate(updateStatusSchema), requestController.updateStatus);
router.post('/:id/accept', protect, requestController.acceptRequest);

// My requests / my helping
router.get('/me/requests', protect, requestController.getMyRequests);
router.get('/me/helping', protect, requestController.getMyHelping);

export default router;
