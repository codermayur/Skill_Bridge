import Joi from 'joi';

export const createReviewSchema = Joi.object({
  requestId: Joi.string().required().messages({ 'any.required': 'Request ID is required' }),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow('').default(''),
});
