import * as reviewRepo from '../repositories/reviewRepository.js';
import * as requestRepo from '../repositories/requestRepository.js';
import * as notifRepo from '../repositories/notificationRepository.js';

export const createReview = async ({ reviewerId, requestId, rating, comment }) => {
  const request = await requestRepo.findById(requestId);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  if (request.status !== 'completed') {
    const err = new Error('You can only review completed requests');
    err.statusCode = 400;
    throw err;
  }

  const requesterId = request.requester?._id?.toString() || request.requester?.toString();
  if (requesterId !== reviewerId.toString()) {
    const err = new Error('Only the requester can leave a review');
    err.statusCode = 403;
    throw err;
  }

  const already = await reviewRepo.existsForRequest(requestId);
  if (already) {
    const err = new Error('A review already exists for this request');
    err.statusCode = 400;
    throw err;
  }

  const helperId = request.helper?._id || request.helper;
  const review = await reviewRepo.create({
    reviewer: reviewerId,
    helper: helperId,
    request: requestId,
    rating,
    comment,
  });

  // Notify the helper
  notifRepo.create({
    user: helperId,
    type: 'review_received',
    title: 'New Review Received',
    message: `You received a ${rating}-star review for "${request.title}"`,
    relatedRequest: requestId,
  }).catch((e) => console.error('Notification failed:', e));

  return review;
};

export const getHelperReviews = (helperId, page) =>
  reviewRepo.findByHelper(helperId, page);

export const getRequestReview = (requestId) =>
  reviewRepo.findByRequest(requestId);
