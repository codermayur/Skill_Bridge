import Joi from 'joi';
import { VALID_CATEGORIES, VALID_STATUSES } from '../models/Request.js';

export const createRequestSchema = Joi.object({
  title: Joi.string().trim().min(5).max(150).required(),
  description: Joi.string().trim().min(20).max(2000).required(),
  skills: Joi.array().items(Joi.string().trim()).max(10).default([]),
  category: Joi.string().valid(...VALID_CATEGORIES).default('Other'),
});

export const updateRequestSchema = Joi.object({
  title: Joi.string().trim().min(5).max(150).optional(),
  description: Joi.string().trim().min(20).max(2000).optional(),
  skills: Joi.array().items(Joi.string().trim()).max(10).optional(),
  category: Joi.string().valid(...VALID_CATEGORIES).optional(),
}).min(1);

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required(),
});
