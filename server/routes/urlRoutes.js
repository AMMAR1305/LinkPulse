const express = require('express');
const { createUrl, getUrls, removeUrl, getUrlStats, updateStatus, getDeviceAnalytics, getUrlDetails } = require('../controllers/urlController');
const { validateUrl, validateStatus } = require('../validators/urlValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All URL routes are protected

router.post('/', validateUrl, createUrl);
router.get('/', getUrls);
router.get('/:id', getUrlDetails);
router.delete('/:id', removeUrl);
router.get('/:id/analytics', getUrlStats);
router.patch('/:id/status', validateStatus, updateStatus);
router.get('/:id/device-analytics', getDeviceAnalytics);

module.exports = router;
