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

const twoFactor = require('../utils/twoFactor');

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password +twoFactorEnabled');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.twoFactorEnabled) {
    const tempToken = jwt.sign({ tempId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    return {
      twoFactorRequired: true,
      tempToken,
    };
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

const setup2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const secret = twoFactor.generateSecret();
  user.twoFactorTempSecret = secret;
  await user.save();

  const otpauthUrl = `otpauth://totp/LinkNova:${user.email}?secret=${secret}&issuer=LinkNova`;

  return {
    secret,
    otpauthUrl,
  };
};

const verify2FA = async (userId, token) => {
  const user = await User.findById(userId).select('+twoFactorTempSecret');
  if (!user) throw new ApiError(404, 'User not found');
  if (!user.twoFactorTempSecret) throw new ApiError(400, '2FA setup not initiated');

  const isValid = twoFactor.verifyTOTP(token, user.twoFactorTempSecret);
  if (!isValid) {
    throw new ApiError(400, 'Invalid verification code');
  }

  user.twoFactorSecret = user.twoFactorTempSecret;
  user.twoFactorEnabled = true;
  user.twoFactorTempSecret = undefined;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    twoFactorEnabled: true,
  };
};

const disable2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.twoFactorTempSecret = undefined;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    twoFactorEnabled: false,
  };
};

const verify2FALogin = async (tempToken, token) => {
  let decoded;
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired temporary session');
  }

  const user = await User.findById(decoded.tempId).select('+twoFactorSecret');
  if (!user || !user.twoFactorSecret) {
    throw new ApiError(400, 'User or 2FA secret not found');
  }

  const isValid = twoFactor.verifyTOTP(token, user.twoFactorSecret);
  if (!isValid) {
    throw new ApiError(401, 'Invalid 2FA verification code');
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
  setup2FA,
  verify2FA,
  disable2FA,
  verify2FALogin,
};
