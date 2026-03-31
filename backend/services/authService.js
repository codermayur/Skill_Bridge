import crypto from 'crypto';
import * as userRepo from '../repositories/userRepository.js';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { forgotPasswordEmail } from '../utils/emailTemplates.js';

export const signup = async ({ fullName, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error('User already exists with this email');
    err.statusCode = 400;
    throw err;
  }

  const user = await userRepo.createUser({ fullName, email, password });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};

export const login = async ({ email, password }) => {
  const user = await userRepo.findByEmailWithPassword(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      lastLogin: user.lastLogin,
    },
  };
};

export const forgotPassword = async ({ email, frontendUrl }) => {
  const user = await userRepo.findByEmail(email);

  // Always respond the same way — no user enumeration
  if (!user) return;

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Skill Bridge',
      html: forgotPasswordEmail(resetToken, resetUrl),
    });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    const err = new Error('Email could not be sent');
    err.statusCode = 500;
    throw err;
  }
};

export const resetPassword = async ({ resetToken, password }) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await userRepo.findByResetToken(hashedToken);
  if (!user) {
    const err = new Error('Invalid or expired reset token');
    err.statusCode = 400;
    throw err;
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  };
};
