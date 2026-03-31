import * as notifService from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const [data, unreadCount] = await Promise.all([
      notifService.getNotifications(req.user._id, page),
      notifService.getUnreadCount(req.user._id),
    ]);
    res.status(200).json({ success: true, unreadCount, count: data.length, data });
  } catch (err) { next(err); }
};

export const markAsRead = async (req, res, next) => {
  try {
    const data = await notifService.markAsRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await notifService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

export const deleteNotification = async (req, res, next) => {
  try {
    await notifService.deleteNotification(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) { next(err); }
};
