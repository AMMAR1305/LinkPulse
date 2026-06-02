const express = require('express');
const { handleRedirect } = require('../controllers/redirectController');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// API dashboard routes
router.use('/api/dashboard', dashboardRoutes);

// Redirect route
router.get('/:shortCode', handleRedirect);

module.exports = router;
