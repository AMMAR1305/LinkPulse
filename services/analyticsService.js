const UAParser = require('ua-parser-js');
const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const ApiError = require('../utils/ApiError');

const parseUserAgent = (uaString) => {
  const parser = new UAParser(uaString || '');
  const res = parser.getResult();

  const deviceType = res.device && res.device.type ? res.device.type : 'Desktop';
  const browser = res.browser && res.browser.name ? res.browser.name : 'Other';

  return { device: deviceType.charAt(0).toUpperCase() + deviceType.slice(1), browser };
};

const trackClick = async (urlId, req) => {
  const userAgent = req.headers['user-agent'] || '';
  const { device, browser } = parseUserAgent(userAgent);

  await Analytics.create({
    urlId,
    browser,
    device,
    ipAddress: req.ip || req.headers['x-forwarded-for'],
    referrer: req.headers['referer'] || 'Direct',
  });

  // Increment clicks on URL model
  await Url.findByIdAndUpdate(urlId, { $inc: { clicks: 1 } });
};

const getUrlAnalytics = async (urlId, userId) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw new ApiError(404, 'URL not found');
  }

  if (url.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view analytics');
  }

  const clicks = await Analytics.find({ urlId }).sort({ timestamp: 1 });

  // Aggregation from documents
  const browserDistribution = clicks.reduce((acc, c) => {
    const key = c.browser || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const deviceDistribution = clicks.reduce((acc, c) => {
    const key = c.device || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const osDistribution = clicks.reduce((acc, c) => {
    const key = c.os || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    totalClicks: url.clicks,
    lastVisited: clicks.length > 0 ? clicks[clicks.length - 1].timestamp : null,
    browserDistribution,
    deviceDistribution,
    osDistribution,
    recentVisits: clicks.slice(-10).reverse(),
  };
};

const getDeviceAnalytics = async (urlId, userId) => {
  const url = await Url.findById(urlId);

  if (!url) throw new ApiError(404, 'URL not found');
  if (url.userId.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized to view analytics');

  const clicks = await Analytics.find({ urlId });

  const deviceStats = clicks.reduce((acc, c) => { const key = c.device || 'Unknown'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const browserStats = clicks.reduce((acc, c) => { const key = c.browser || 'Unknown'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const osStats = clicks.reduce((acc, c) => { const key = c.os || 'Unknown'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});

  return { deviceStats, browserStats, osStats };
};

module.exports = {
  trackClick,
  getUrlAnalytics,
  getDeviceAnalytics,
};
