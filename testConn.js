require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('connected to', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('connect failed:', err.message);
    process.exit(1);
  }
})();