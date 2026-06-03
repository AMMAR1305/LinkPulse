const express = require('express');
const { protect } = require('../middleware/auth');
const { getQRCode, downloadQRCode } = require('../controllers/qrCodeController');

const router = express.Router();

router.get('/:id/qrcode', protect, getQRCode);
router.get('/:id/qrcode/download', protect, downloadQRCode);

module.exports = router;