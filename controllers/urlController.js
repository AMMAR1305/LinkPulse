const urlService = require('../services/urlService');
const analyticsService = require('../services/analyticsService');

const createUrl = async (req, res, next) => {
  try {
    const url = await urlService.createShortUrl(req.body, req.user._id);
    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        ...url.toObject(),
        shortUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUrls = async (req, res, next) => {
  try {
    const urls = await urlService.getUserUrls(req.user._id);
    const formattedUrls = urls.map(url => ({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
    }));

    res.status(200).json({
      success: true,
      data: formattedUrls,
    });
  } catch (error) {
    next(error);
  }
};

const removeUrl = async (req, res, next) => {
  try {
    await urlService.deleteUrl(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getUrlStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getUrlAnalytics(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await urlService.updateUrlStatus(req.params.id, req.user._id, status);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const getDeviceAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getDeviceAnalytics(req.params.id, req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUrl,
  getUrls,
  removeUrl,
  getUrlStats,
  updateStatus,
  getDeviceAnalytics,
};
