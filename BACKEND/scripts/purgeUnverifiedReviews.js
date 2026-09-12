import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Unverified reviews identified during audit:
    // 6a37a4dbebedd6f2b355d7d7 (Jaimin Patel), 6a37a4dbebedd6f2b355d7d5 (Abhishek Tewari), 6a37a4dbebedd6f2b355d7d6 (Anson Antony)
    // Deactivate them so isActive is false and delete from public visibility
    const res = await mongoose.connection.db.collection('reviews').deleteMany({
      _id: {
        $in: [
          new mongoose.Types.ObjectId('6a37a4dbebedd6f2b355d7d7'),
          new mongoose.Types.ObjectId('6a37a4dbebedd6f2b355d7d5'),
          new mongoose.Types.ObjectId('6a37a4dbebedd6f2b355d7d6')
        ]
      }
    });

    console.log(`Deleted unverified reviews from MongoDB: ${res.deletedCount}`);

    const remaining = await mongoose.connection.db.collection('reviews').countDocuments();
    console.log(`Total remaining reviews in database: ${remaining}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error purging reviews:', err);
    process.exit(1);
  }
})();
