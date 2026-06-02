const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const Url = require('../models/Url');
const ApiError = require('../utils/ApiError');
const qrCodeService = require('./qrCodeService');

const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[urlService]', ...args);
  }
};

const createShortUrl = async (urlData, userId) => {
  const { originalUrl, customAlias, expiresAt } = urlData;

  logDebug('createShortUrl payload received', {
    originalUrl,
    customAlias,
    hasExpiresAt: Boolean(expiresAt),
    userId,
  });

  // Check if custom alias is already taken
  if (customAlias) {
    const existingAlias = await Url.findOne({
      $or: [{ customAlias }, { shortCode: customAlias }],
    });
    if (existingAlias) {
      throw new ApiError(400, 'Custom alias already in use');
    }
  }

  const shortCode = customAlias || nanoid(8);
  const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
  const qrCode = await qrCodeService.generateQRCode(shortUrl);

  const url = await Url.create({
    originalUrl,
    shortCode,
    customAlias,
    expiresAt,
    userId,
    qrCode,
  });

  logDebug('url saved', {
    urlId: url._id,
    shortCode: url.shortCode,
    dbHost: mongoose.connection.host,
    dbName: mongoose.connection.name,
  });

  return url;
};

const getUserUrls = async (userId) => {
  return await Url.find({ userId }).sort({ createdAt: -1 });
};

const deleteUrl = async (urlId, userId) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  if (url.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this URL');
  }

  await url.deleteOne();
};

const getUrlByCode = async (shortCode) => {
  // Find by shortCode OR customAlias
  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }],
  });

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  if (url.status !== 'active') {
    throw new ApiError(400, 'This URL is no longer active');
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    url.status = 'expired';
    await url.save();
    throw new ApiError(400, 'This URL has expired');
  }

  return url;
};

module.exports = {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  getUrlByCode,
};
