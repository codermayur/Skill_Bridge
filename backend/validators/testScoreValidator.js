import Joi from 'joi';

export const submitScoreSchema = Joi.object({
  language: Joi.string().trim().required().messages({
    'any.required': 'Language is required',
  }),
  score: Joi.number().min(0).required().messages({
    'any.required': 'Score is required',
    'number.min': 'Score cannot be negative',
  }),
  totalQuestions: Joi.number().min(1).required().messages({
    'any.required': 'Total questions is required',
    'number.min': 'Total questions must be at least 1',
  }),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number(),
        selectedAnswer: Joi.string().allow(''),
        correctAnswer: Joi.string().allow(''),
        isCorrect: Joi.boolean(),
      })
    )
    .default([]),
});
