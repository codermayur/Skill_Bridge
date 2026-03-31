import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'Full name must be at least 2 characters',
  }),
  email: Joi.string().email().lowercase().optional().messages({
    'string.email': 'Please provide a valid email',
  }),
  bio: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Bio cannot exceed 500 characters',
  }),
  skills: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(15)
    .optional()
    .messages({
      'array.max': 'You can add up to 15 skills',
    }),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update',
});
