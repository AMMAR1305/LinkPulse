const express = require('express');
const { createUrl, getUrls, removeUrl, getUrlStats } = require('../controllers/urlController');
const { validateUrl } = require('../validators/urlValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All URL routes are protected

router.post('/', validateUrl, createUrl);
router.get('/', getUrls);
router.delete('/:id', removeUrl);
router.get('/:id/analytics', getUrlStats);

module.exports = router;
