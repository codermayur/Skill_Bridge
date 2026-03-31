import Review from '../models/Review.js';

export const create = (data) => Review.create(data);

export const findByHelper = (helperId, page = 1, limit = 20) =>
  Review.find({ helper: helperId })
    .populate('reviewer', 'fullName email')
    .populate('request', 'title')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

export const findByRequest = (requestId) =>
  Review.findOne({ request: requestId })
    .populate('reviewer', 'fullName email')
    .populate('helper', 'fullName email');

export const existsForRequest = (requestId) =>
  Review.exists({ request: requestId });

export const getHelperStats = async (helperId) => {
  const result = await Review.aggregate([
    { $match: { helper: helperId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
  ]);
  return result[0] || { avgRating: 0, totalReviews: 0, ratingDistribution: [] };
};
