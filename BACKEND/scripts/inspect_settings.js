import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const s = await mongoose.connection.db.collection('settings').findOne({});
    console.log('SETTINGS IN MONGO:');
    console.log(JSON.stringify(s, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
})();
