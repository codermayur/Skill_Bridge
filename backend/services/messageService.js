import * as messageRepo from '../repositories/messageRepository.js';
import * as requestRepo from '../repositories/requestRepository.js';
import * as notifRepo from '../repositories/notificationRepository.js';

const assertParticipant = (request, userId) => {
  const requesterId = request.requester?._id?.toString() || request.requester?.toString();
  const helperId = request.helper?._id?.toString() || request.helper?.toString();
  if (userId.toString() !== requesterId && userId.toString() !== helperId) {
    const err = new Error('Not authorized to access this conversation');
    err.statusCode = 403;
    throw err;
  }
};

export const getMessages = async (requestId, userId) => {
  const request = await requestRepo.findById(requestId);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  assertParticipant(request, userId);
  await messageRepo.markAsRead(requestId, userId);
  return messageRepo.findByRequest(requestId);
};

export const sendMessage = async (requestId, senderId, content, io) => {
  const request = await requestRepo.findById(requestId);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  assertParticipant(request, senderId);

  if (!['accepted', 'in_progress'].includes(request.status)) {
    const err = new Error('Messaging is only available for accepted or in-progress requests');
    err.statusCode = 400;
    throw err;
  }

  const message = await messageRepo.create({ request: requestId, sender: senderId, content });
  const populated = await message.populate('sender', 'fullName email');

  // Real-time via socket
  if (io) {
    io.to(`request:${requestId}`).emit('new_message', populated);
  }

  // Notify the other participant
  const requesterId = request.requester?._id?.toString() || request.requester?.toString();
  const helperId = request.helper?._id?.toString() || request.helper?.toString();
  const recipientId = senderId.toString() === requesterId ? helperId : requesterId;

  if (recipientId) {
    notifRepo.create({
      user: recipientId,
      type: 'new_message',
      title: 'New Message',
      message: `New message in request: "${request.title}"`,
      relatedRequest: requestId,
    }).catch((e) => console.error('Notification failed:', e));

    if (io) {
      io.to(`user:${recipientId}`).emit('notification', {
        type: 'new_message',
        message: `New message in: "${request.title}"`,
      });
    }
  }

  return populated;
};
