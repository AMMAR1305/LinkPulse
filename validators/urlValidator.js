const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validateUrl = [
  body('originalUrl').isURL().withMessage('Please provide a valid URL'),
  body('customAlias')
    .optional()
    .isAlphanumeric()
    .withMessage('Custom alias must be alphanumeric')
    .isLength({ min: 3, max: 20 })
    .withMessage('Custom alias must be between 3 and 20 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
  },
];

module.exports = {
  validateUrl,
};
