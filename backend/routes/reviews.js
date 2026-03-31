import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createReviewSchema } from '../validators/reviewValidator.js';

const router = express.Router();

router.post('/', protect, validate(createReviewSchema), reviewController.createReview);
router.get('/helper/:helperId', reviewController.getHelperReviews);
router.get('/request/:requestId', reviewController.getRequestReview);

export default router;
