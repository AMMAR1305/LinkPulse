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

const updateUrlStatus = async (urlId, userId, status) => {
  if (!['active', 'disabled'].includes(status)) {
    throw new ApiError(400, 'Invalid status. Use "active" or "disabled"');
  }

  const url = await Url.findById(urlId);

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  if (url.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to update this URL');
  }

  url.status = status;
  await url.save();

  return url;
};

const getUrlByCode = async (shortCode) => {
  logDebug('getUrlByCode requested', { shortCode });

  // Find by shortCode OR customAlias
  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }],
  });

  logDebug('getUrlByCode query result', url
    ? {
        urlId: url._id,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        status: url.status,
        expiresAt: url.expiresAt,
        originalUrl: url.originalUrl,
      }
    : null
  );

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  const currentStatus = url.status || 'active';

  if (currentStatus === 'disabled') {
    throw new ApiError(400, 'This URL is no longer active');
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    if (currentStatus !== 'expired') {
      url.status = 'expired';
      await url.save();
    }

    url.status = 'expired';
    throw new ApiError(400, 'This URL has expired');
  }

  return url;
};

module.exports = {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  getUrlByCode,
  updateUrlStatus,
};
