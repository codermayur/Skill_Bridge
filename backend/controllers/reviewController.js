import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const data = await reviewService.createReview({
      reviewerId: req.user._id,
      requestId: req.body.requestId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    res.status(201).json({ success: true, message: 'Review submitted', data });
  } catch (err) { next(err); }
};

export const getHelperReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await reviewService.getHelperReviews(req.params.helperId, page);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

export const getRequestReview = async (req, res, next) => {
  try {
    const data = await reviewService.getRequestReview(req.params.requestId);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
