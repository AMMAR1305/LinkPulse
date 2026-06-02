const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[authService]', ...args);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (userData) => {
  const { name, email, password } = userData;

  logDebug('register payload received', {
    nameLength: name?.length || 0,
    email,
    hasPassword: Boolean(password),
  });

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  logDebug('user saved', {
    userId: user._id,
    dbHost: mongoose.connection.host,
    dbName: mongoose.connection.name,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

module.exports = {
  register,
  login,
  generateToken,
};
