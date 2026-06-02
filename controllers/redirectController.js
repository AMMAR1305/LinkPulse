const urlService = require('../services/urlService');
const analyticsService = require('../services/analyticsService');

const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await urlService.getUrlByCode(shortCode);

    // Track analytics asynchronously to not delay redirection
    analyticsService.trackClick(url._id, req).catch(err => {
      console.error('Analytics tracking failed:', err);
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRedirect,
};
