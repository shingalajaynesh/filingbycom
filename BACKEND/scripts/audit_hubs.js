import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const VirtualLocation = mongoose.model('VirtualLocation', new mongoose.Schema({}, { strict: false, collection: 'virtuallocations' }));
    const locations = await VirtualLocation.find().lean();
    
    console.log(`Fetched ${locations.length} virtual office cities/hubs:\n`);
    for (const loc of locations) {
      console.log('==================================================');
      console.log(`SLUG: ${loc.slug}`);
      console.log(`NAME: ${loc.name}`);
      console.log(`STATE: ${loc.state}`);
      console.log(`RATE: ₹${loc.rate}/mo`);
      console.log(`ADDRESSES COUNT: ${loc.addresses?.length || 0}`);
      if (loc.addresses?.length) {
        loc.addresses.forEach((a, i) => {
          console.log(`   Address ${i+1}: [${a.slug}] ${a.name} | ${a.address} | Active: ${a.active !== false}`);
        });
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
})();
