const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const requireDatabaseConnection = require('./middleware/dbReady');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const indexRoutes = require('./routes/index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use(requireDatabaseConnection);
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/url', qrCodeRoutes);
app.use('/', indexRoutes); // Should be last as it has a generic parameter

// Error Handler
app.use(errorHandler);

module.exports = app;
