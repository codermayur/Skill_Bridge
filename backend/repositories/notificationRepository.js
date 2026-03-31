import Notification from '../models/Notification.js';

export const create = (data) => Notification.create(data);

export const findByUser = (userId, page = 1, limit = 20) =>
  Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

export const countUnread = (userId) =>
  Notification.countDocuments({ user: userId, read: false });

export const markAsRead = (notificationId, userId) =>
  Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );

export const markAllAsRead = (userId) =>
  Notification.updateMany({ user: userId, read: false }, { read: true });

export const deleteById = (notificationId, userId) =>
  Notification.findOneAndDelete({ _id: notificationId, user: userId });
