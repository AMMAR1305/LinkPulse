const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Url = require('../models/Url');
const ApiError = require('../utils/ApiError');

const QR_OPTIONS = {
  errorCorrectionLevel: 'H',
  width: 512,
  margin: 2,
};

const buildShortUrl = (shortCode) => {
  return `${process.env.BASE_URL || 'http://localhost:5000'}/${shortCode}`;
};

const generateQRCode = async (shortUrl) => {
  try {
    return await QRCode.toDataURL(shortUrl, QR_OPTIONS);
  } catch (error) {
    throw new ApiError(500, `QR generation failed: ${error.message}`);
  }
};

const generateQRCodeBuffer = async (shortUrl) => {
  try {
    return await QRCode.toBuffer(shortUrl, QR_OPTIONS);
  } catch (error) {
    throw new ApiError(500, `QR generation failed: ${error.message}`);
  }
};

const verifyOwnership = (url, userId) => {
  if (url.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to access this URL');
  }

  return url;
};

const findUrlByIdAndOwner = async (urlId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new ApiError(400, 'Invalid URL id');
  }

  const url = await Url.findById(urlId);

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  return verifyOwnership(url, userId);
};

module.exports = {
  buildShortUrl,
  generateQRCode,
  generateQRCodeBuffer,
  findUrlByIdAndOwner,
  verifyOwnership,
};