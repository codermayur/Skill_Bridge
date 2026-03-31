import * as authService from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', ...result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, message: 'Login successful', ...result });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    await authService.forgotPassword({ email: req.body.email, frontendUrl });
    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword({
      resetToken: req.params.resettoken,
      password: req.body.password,
    });
    res.status(200).json({ success: true, message: 'Password reset successful', ...result });
  } catch (err) {
    next(err);
  }
};
