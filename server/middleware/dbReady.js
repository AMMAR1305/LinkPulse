const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const requireDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(new ApiError(503, 'Database is not connected'));
  }

  next();
};

module.exports = requireDatabaseConnection;