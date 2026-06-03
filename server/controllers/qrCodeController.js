const qrCodeService = require('../services/qrCodeService');

const getQRCode = async (req, res, next) => {
  try {
    const url = await qrCodeService.findUrlByIdAndOwner(req.params.id, req.user.id);
    const shortUrl = qrCodeService.buildShortUrl(url.shortCode);

    let qrCode = url.qrCode;

    if (!qrCode) {
      qrCode = await qrCodeService.generateQRCode(shortUrl);
      url.qrCode = qrCode;
      await url.save();
    }

    res.status(200).json({
      success: true,
      data: {
        shortUrl,
        qrCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

const downloadQRCode = async (req, res, next) => {
  try {
    const url = await qrCodeService.findUrlByIdAndOwner(req.params.id, req.user.id);
    const shortUrl = qrCodeService.buildShortUrl(url.shortCode);
    const qrBuffer = await qrCodeService.generateQRCodeBuffer(shortUrl);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="qrcode-${url.shortCode}.png"`
    );

    return res.status(200).send(qrBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQRCode,
  downloadQRCode,
};