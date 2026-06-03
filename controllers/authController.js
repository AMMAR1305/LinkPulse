const authService = require('../services/authService');

const registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        twoFactorEnabled: req.user.twoFactorEnabled || false,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const setupTwoFactor = async (req, res, next) => {
  try {
    const result = await authService.setup2FA(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const verifyTwoFactor = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verify2FA(req.user._id, token);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const disableTwoFactor = async (req, res, next) => {
  try {
    const result = await authService.disable2FA(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const verifyTwoFactorLogin = async (req, res, next) => {
  try {
    const { tempToken, token } = req.body;
    const result = await authService.verify2FALogin(tempToken, token);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  verifyTwoFactorLogin,
};
