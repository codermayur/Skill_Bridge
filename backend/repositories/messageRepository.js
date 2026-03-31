import Message from '../models/Message.js';

export const create = (data) => Message.create(data);

export const findByRequest = (requestId) =>
  Message.find({ request: requestId })
    .populate('sender', 'fullName email')
    .sort({ createdAt: 1 });

export const markAsRead = (requestId, userId) =>
  Message.updateMany(
    { request: requestId, sender: { $ne: userId }, read: false },
    { read: true }
  );

export const countUnread = (userId) =>
  Message.countDocuments({ 'request.helper': userId, read: false });
