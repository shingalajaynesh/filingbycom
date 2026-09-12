import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { CORE_SERVICES_CONTENT } from '../../FRONTEND/src/shared/data/coreServicesContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const ServiceSchema = new mongoose.Schema({}, { strict: false, collection: 'services' });
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const slugs = Object.keys(CORE_SERVICES_CONTENT);
    console.log(`Syncing ${slugs.length} core services to MongoDB...`);

    for (const slug of slugs) {
      const data = CORE_SERVICES_CONTENT[slug];
      const updatePayload = {
        name: data.name,
        category: data.category,
        basePrice: data.basePrice,
        description: data.overview.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        overviewHtml: data.overview.trim(),
        seoTitle: data.metaTitle,
        seoDescription: data.metaDescription,
        seoKeywords: data.metaKeywords,
        documentsRequired: data.documentsRequired,
        processSteps: data.processSteps,
        benefits: data.benefits,
        faqs: data.faqs,
        statutoryInfo: data.statutoryInfo,
        updatedAt: new Date()
      };

      const res = await Service.updateOne(
        { slug },
        { $set: updatePayload },
        { upsert: false }
      );

      console.log(`Updated [${slug}]: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    console.log('\nAll 14 core services synced successfully in MongoDB.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error syncing core services:', err);
    process.exit(1);
  }
})();
