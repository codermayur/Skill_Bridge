import * as notifRepo from '../repositories/notificationRepository.js';

export const getNotifications = (userId, page) =>
  notifRepo.findByUser(userId, page);

export const getUnreadCount = (userId) =>
  notifRepo.countUnread(userId);

export const markAsRead = (notificationId, userId) =>
  notifRepo.markAsRead(notificationId, userId);

export const markAllAsRead = (userId) =>
  notifRepo.markAllAsRead(userId);

export const deleteNotification = (notificationId, userId) =>
  notifRepo.deleteById(notificationId, userId);

/**
 * Emit a real-time notification via Socket.io if the target user is connected.
 * Called from services that create notifications.
 */
export const emitNotification = (io, userId, notification) => {
  if (io) {
    io.to(`user:${userId.toString()}`).emit('notification', notification);
  }
};
