import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const reviews = await mongoose.connection.db.collection('reviews').find({}).toArray();
    console.log(`Remaining reviews in DB (${reviews.length}):\n`);
    for (const r of reviews) {
      console.log('--------------------------------------------------');
      console.log('ID:', r._id);
      console.log('NAME:', r.authorName);
      console.log('COMPANY/BUSINESS:', r.businessName);
      console.log('RATING:', r.rating);
      console.log('COMMENT:', r.comment || r.review || r.content);
      console.log('PAGE TYPE:', r.pageType);
      console.log('STATUS/VERIFIED:', r.status, r.isVerified, r.approved);
      console.log('CREATED AT:', r.createdAt);
      console.log('ALL KEYS:', Object.keys(r));
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
})();
