/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 * On failure it passes a 400 error to the centralized error handler.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    const err = new Error(messages);
    err.statusCode = 400;
    return next(err);
  }

  req.body = value;
  next();
};

export default validate;
