import express from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgotpassword', validate(forgotPasswordSchema), authController.forgotPassword);
router.put('/resetpassword/:resettoken', validate(resetPasswordSchema), authController.resetPassword);

export default router;
