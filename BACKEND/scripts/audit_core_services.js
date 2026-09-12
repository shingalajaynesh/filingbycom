import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const coreSlugs = [
  'gst-registration',
  'gst-return-filing',
  'private-limited-company',
  'llp-registration',
  'one-person-company',
  'trademark-registration',
  'itr-1-filing',
  'fssai-basic-registration',
  'udyam-registration',
  'iec-registration',
  'startup-india',
  'roc-annual-filing-pvt',
  'roc-annual-filing-llp',
  'trust-registration'
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false, collection: 'services' }));
    const services = await Service.find({ slug: { $in: coreSlugs } }).lean();
    
    console.log(`Fetched ${services.length} core services from DB.\n`);
    for (const s of services) {
      console.log('==================================================');
      console.log(`SLUG: ${s.slug}`);
      console.log(`NAME: ${s.name}`);
      console.log(`CATEGORY: ${s.category}`);
      console.log(`BASE PRICE: ₹${s.basePrice}`);
      console.log(`DESCRIPTION: ${s.description}`);
      console.log(`DOCUMENTS (${s.documentsRequired?.length || 0}):`, s.documentsRequired);
      console.log(`PROCESS STEPS (${s.processSteps?.length || 0}):`, s.processSteps);
      console.log(`BENEFITS (${s.benefits?.length || 0}):`, s.benefits);
      console.log(`FAQS COUNT: ${s.faqs?.length || 0}`);
      if (s.faqs?.length) {
        s.faqs.forEach((f, idx) => console.log(`   FAQ ${idx+1}: Q: ${f.q} | A: ${f.a}`));
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
})();
