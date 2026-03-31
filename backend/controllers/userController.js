import * as userService from '../services/userService.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data });
  } catch (err) {
    next(err);
  }
};
