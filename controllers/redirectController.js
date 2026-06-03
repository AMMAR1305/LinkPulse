const urlService = require('../services/urlService');
const analyticsService = require('../services/analyticsService');

const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    if (process.env.NODE_ENV === 'development') {
      console.log('[redirectController] requested shortCode:', shortCode);
    }

    const url = await urlService.getUrlByCode(shortCode);

    if (process.env.NODE_ENV === 'development') {
      console.log('[redirectController] redirect destination:', url.originalUrl);
      console.log('[redirectController] status:', url.status || 'active');
      console.log('[redirectController] expiresAt:', url.expiresAt || null);
    }

    // Track analytics, but never let analytics stop the redirect.
    try {
      await analyticsService.trackClick(url._id, req);
    } catch (err) {
      console.error('Analytics tracking failed:', err);
    }

    res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRedirect,
};
