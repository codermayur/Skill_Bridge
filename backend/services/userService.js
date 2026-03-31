import * as userRepo from '../repositories/userRepository.js';

export const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    testScores: user.testScores,
    bio: user.bio,
    skills: user.skills,
    reputation: user.reputation,
    role: user.role,
  };
};

export const updateProfile = async (userId, { fullName, email, bio, skills }) => {
  if (email) {
    const taken = await userRepo.isEmailTaken(email, userId);
    if (taken) {
      const err = new Error('Email already in use');
      err.statusCode = 400;
      throw err;
    }
  }

  const updateData = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (email !== undefined) updateData.email = email;
  if (bio !== undefined) updateData.bio = bio;
  if (skills !== undefined) updateData.skills = skills;

  const user = await userRepo.updateById(userId, updateData);

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    skills: user.skills,
  };
};
