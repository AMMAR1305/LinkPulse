const mongoose = require('mongoose');

const connectDB = async () => {
  const connectionTargets = [
    {
      uri: process.env.MONGO_URI,
      label: 'MONGO_URI',
    },
  ];

  const allowFallback = process.env.MONGO_ALLOW_FALLBACK === 'true';
  const fallbackUri =
    process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017/url_shortener';

  if (allowFallback) {
    connectionTargets.push({
      uri: fallbackUri,
      label: 'MONGO_FALLBACK_URI',
    });
  }

  let lastError;

  for (const target of connectionTargets) {
    if (!target.uri) {
      continue;
    }

    try {
      const conn = await mongoose.connect(target.uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(
        `MongoDB Connected: host=${conn.connection.host} db=${conn.connection.name} source=${target.label}`
      );
      return conn;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection failed (${target.label}): ${error.message}`);
    }
  }

  if (!allowFallback) {
    console.warn(
      'MongoDB fallback is disabled. Set MONGO_ALLOW_FALLBACK=true only if you want local fallback behavior.'
    );
  }

  throw lastError;
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
