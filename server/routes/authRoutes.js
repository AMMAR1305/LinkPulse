const express = require('express');
const { registerUser, loginUser, getMe, setupTwoFactor, verifyTwoFactor, disableTwoFactor, verifyTwoFactorLogin } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);

// 2FA Routes
router.post('/2fa/setup', protect, setupTwoFactor);
router.post('/2fa/verify', protect, verifyTwoFactor);
router.post('/2fa/disable', protect, disableTwoFactor);
router.post('/2fa/login-verify', verifyTwoFactorLogin);

module.exports = router;
