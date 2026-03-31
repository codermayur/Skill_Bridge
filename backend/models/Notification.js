import mongoose from 'mongoose';

const NOTIFICATION_TYPES = [
  'request_accepted',
  'request_completed',
  'request_cancelled',
  'new_message',
  'review_received',
  'helper_assigned',
];

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export const VALID_NOTIFICATION_TYPES = NOTIFICATION_TYPES;

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
