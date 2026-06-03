require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const os = require('os');

const PORT = process.env.PORT || 5000;

// Resolve local IPv4 address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const localIp = getLocalIp();

// Automatically replace localhost/127.0.0.1 in BASE_URL with the machine's local IP address
// to allow mobile devices on the same network to scan QR codes and load short links.
if (process.env.BASE_URL) {
  if (process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('127.0.0.1')) {
    process.env.BASE_URL = process.env.BASE_URL.replace(/localhost|127\.0\.0\.1/, localIp);
  }
} else {
  process.env.BASE_URL = `http://${localIp}:${PORT}`;
}

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`Local network access at http://${localIp}:${PORT}/api`);
      console.log(`Short URL Base configured as: ${process.env.BASE_URL}`);
    });
  } catch (error) {
    console.error(`Database connection unavailable: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  if (server) {
    server.close(() => process.exit(1));
    return;
  }

  process.exit(1);
});
