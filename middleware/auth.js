const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to req
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ApiError(404, 'No user found with this id'));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
};

module.exports = { protect };
