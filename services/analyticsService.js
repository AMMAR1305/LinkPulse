const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const ApiError = require('../utils/ApiError');

const trackClick = async (urlId, req) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Basic parsing of user agent (in production you might use 'useragent' or 'ua-parser-js' package)
  let device = 'Desktop';
  if (/mobile/i.test(userAgent)) device = 'Mobile';
  if (/tablet/i.test(userAgent)) device = 'Tablet';

  let browser = 'Other';
  if (/chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent)) browser = 'Safari';
  else if (/edge/i.test(userAgent)) browser = 'Edge';

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

  const clicks = await Analytics.find({ urlId });
  
  // Basic aggregation logic
  const browserStats = clicks.reduce((acc, click) => {
    acc[click.browser] = (acc[click.browser] || 0) + 1;
    return acc;
  }, {});

  const deviceStats = clicks.reduce((acc, click) => {
    acc[click.device] = (acc[click.device] || 0) + 1;
    return acc;
  }, {});

  return {
    totalClicks: url.clicks,
    lastVisited: clicks.length > 0 ? clicks[clicks.length - 1].timestamp : null,
    browserDistribution: browserStats,
    deviceDistribution: deviceStats,
    recentVisits: clicks.slice(-10).reverse(),
  };
};

module.exports = {
  trackClick,
  getUrlAnalytics,
};
