import User from '../models/User.js';

export const findByEmail = (email) =>
  User.findOne({ email });

export const findByEmailWithPassword = (email) =>
  User.findOne({ email }).select('+password');

export const findById = (id) =>
  User.findById(id);

export const createUser = (data) =>
  User.create(data);

export const updateById = (id, data, options = { new: true, runValidators: true }) =>
  User.findByIdAndUpdate(id, data, options);

export const findByResetToken = (hashedToken) =>
  User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

export const isEmailTaken = async (email, excludeId) => {
  const existing = await User.findOne({ email });
  return existing && existing._id.toString() !== excludeId?.toString();
};

export const findHelpers = () =>
  User.find({ isBanned: false, 'skills.0': { $exists: true } })
    .select('fullName email skills bio reputation')
    .limit(200);

export const findAllUsers = (page = 1, limit = 20) =>
  User.find()
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

export const countUsers = () => User.countDocuments();

export const banUser = (id, isBanned) =>
  User.findByIdAndUpdate(id, { isBanned }, { new: true }).select('-password');
