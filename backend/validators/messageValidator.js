import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.min': 'Message cannot be empty',
    'any.required': 'Message content is required',
  }),
});
