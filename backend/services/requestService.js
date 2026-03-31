import * as requestRepo from '../repositories/requestRepository.js';
import * as notificationRepo from '../repositories/notificationRepository.js';
import { categorize } from './categorizationService.js';

const ALLOWED_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export const createRequest = async ({ title, description, skills, category, requesterId }) => {
  // AI: auto-categorize and extract skills if not provided
  const ai = categorize(title, description);
  const finalCategory = category !== 'Other' ? category : ai.category;
  const finalSkills = skills && skills.length > 0 ? skills : ai.skills;

  const request = await requestRepo.create({
    title,
    description,
    skills: finalSkills,
    category: finalCategory,
    requester: requesterId,
    aiCategory: ai.category,
    aiSkills: ai.skills,
  });

  return request;
};

export const getRequests = async (filters) => {
  const [data, total] = await Promise.all([
    requestRepo.findAll(filters),
    requestRepo.countAll(filters),
  ]);
  return { data, total, page: filters.page || 1, limit: filters.limit || 20 };
};

export const getRequestById = async (id) => {
  const request = await requestRepo.findById(id);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  return request;
};

export const updateRequest = async (id, userId, updates) => {
  const request = await requestRepo.findById(id);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  if (request.requester._id.toString() !== userId.toString()) {
    const err = new Error('Not authorized to update this request');
    err.statusCode = 403;
    throw err;
  }
  if (request.status !== 'pending') {
    const err = new Error('Only pending requests can be edited');
    err.statusCode = 400;
    throw err;
  }
  return requestRepo.updateById(id, updates);
};

export const updateStatus = async (id, newStatus, userId, userRole) => {
  const request = await requestRepo.findById(id);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }

  const currentStatus = request.status;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition from "${currentStatus}" to "${newStatus}"`);
    err.statusCode = 400;
    throw err;
  }

  const requesterId = request.requester._id?.toString() || request.requester.toString();
  const helperId = request.helper?._id?.toString() || request.helper?.toString();

  // Access control per transition
  if (newStatus === 'accepted' && helperId !== userId.toString() && userRole !== 'admin') {
    const err = new Error('Only the assigned helper can accept this request');
    err.statusCode = 403;
    throw err;
  }
  if (['in_progress', 'completed'].includes(newStatus) && helperId !== userId.toString() && userRole !== 'admin') {
    const err = new Error('Only the assigned helper can update this request status');
    err.statusCode = 403;
    throw err;
  }
  if (newStatus === 'cancelled' && requesterId !== userId.toString() && userRole !== 'admin') {
    const err = new Error('Only the requester or admin can cancel this request');
    err.statusCode = 403;
    throw err;
  }

  const updated = await requestRepo.updateById(id, { status: newStatus });

  // Fire notifications
  const notifMap = {
    accepted: {
      userId: request.requester._id || request.requester,
      type: 'request_accepted',
      title: 'Request Accepted',
      message: `Your request "${request.title}" has been accepted by a helper.`,
    },
    in_progress: {
      userId: request.requester._id || request.requester,
      type: 'helper_assigned',
      title: 'Work Started',
      message: `Your request "${request.title}" is now in progress.`,
    },
    completed: {
      userId: request.requester._id || request.requester,
      type: 'request_completed',
      title: 'Request Completed',
      message: `Your request "${request.title}" has been marked as completed. Please leave a review!`,
    },
    cancelled: null,
  };

  const notif = notifMap[newStatus];
  if (notif) {
    notificationRepo.create({
      user: notif.userId,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      relatedRequest: id,
    }).catch((e) => console.error('Notification creation failed:', e));
  }

  return updated;
};

export const acceptRequest = async (requestId, helperId) => {
  const request = await requestRepo.findById(requestId);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  if (request.status !== 'pending') {
    const err = new Error('Request is no longer available');
    err.statusCode = 400;
    throw err;
  }
  if (request.requester._id.toString() === helperId.toString()) {
    const err = new Error('You cannot accept your own request');
    err.statusCode = 400;
    throw err;
  }

  const updated = await requestRepo.updateById(requestId, {
    helper: helperId,
    status: 'accepted',
  });

  // Notify requester
  notificationRepo.create({
    user: request.requester._id || request.requester,
    type: 'request_accepted',
    title: 'Request Accepted!',
    message: `A helper has accepted your request: "${request.title}"`,
    relatedRequest: requestId,
  }).catch((e) => console.error('Notification failed:', e));

  return updated;
};

export const searchRequests = (query) => requestRepo.textSearch(query);

export const getMyRequests = (userId, page) => requestRepo.findByRequester(userId, page);
export const getMyHelping = (userId, page) => requestRepo.findByHelper(userId, page);
