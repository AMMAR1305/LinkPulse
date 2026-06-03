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
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('expiresAt must be a valid ISO 8601 date')
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return false;
      if (date <= new Date()) throw new Error('expiresAt must be a future date');
      return true;
    }),
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
  validateStatus: [
    body('status').isIn(['active', 'disabled']).withMessage('Status must be "active" or "disabled"'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(new ApiError(400, errors.array()[0].msg));
      next();
    },
  ],
};
