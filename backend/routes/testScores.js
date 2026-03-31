import express from 'express';
import * as testScoreController from '../controllers/testScoreController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { submitScoreSchema } from '../validators/testScoreValidator.js';

const router = express.Router();

router.post('/', protect, validate(submitScoreSchema), testScoreController.submitScore);
router.get('/', protect, testScoreController.getScores);
router.get('/:language', protect, testScoreController.getScoresByLanguage);

export default router;
