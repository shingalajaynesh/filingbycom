import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Setting from "../src/models/Setting.model.js";
import { uploadToCloudinary } from "../src/utils/cloudinaryUtils.js";

dotenv.config();

const rawCALogos = [
  { name: "Swiggy", url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Flipkart", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Flipkart_logo_%282026%29.svg/500px-Flipkart_logo_%282026%29.svg.png" },
  { name: "Myntra", url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
  { name: "Meesho", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Meesho_logo.png/500px-Meesho_logo.png" },
  { name: "JioMart", url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/JioMart_logo.svg/500px-JioMart_logo.svg.png" },
  { name: "Blinkit", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Blinkit-yellow-rounded.svg/500px-Blinkit-yellow-rounded.svg.png" },
  { name: "Zepto", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Zepto_Logo.svg/500px-Zepto_Logo.svg.png" }
];

const rawVSLogos = [
  { name: "Swiggy", url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Flipkart", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Flipkart_logo_%282026%29.svg/500px-Flipkart_logo_%282026%29.svg.png" },
  { name: "Myntra", url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
  { name: "Meesho", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Meesho_logo.png/500px-Meesho_logo.png" },
  { name: "JioMart", url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/JioMart_logo.svg/500px-JioMart_logo.svg.png" },
  { name: "Blinkit", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Blinkit-yellow-rounded.svg/500px-Blinkit-yellow-rounded.svg.png" },
  { name: "Zepto", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Zepto_Logo.svg/500px-Zepto_Logo.svg.png" }
];

const defaultCAOfficePhotos = [
  { name: "Team Collaboration", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
  { name: "Compliance & Advisory Desks", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" },
  { name: "Expert Consultation Desk", url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Corporate Head Office", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { name: "Strategic Compliance Advisory", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" }
];

const defaultVSOfficePhotos = [
  { name: "Executive Suite Lobby", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { name: "Premium Hot Desks", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" },
  { name: "Corporate Meeting Boardroom", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
  { name: "Sleek Private Cabins", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
  { name: "Modern Co-Working Lounge", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" }
];

const uploadLogoFile = async (name, url, folder = "brand_logos") => {
  try {
    console.log(`Downloading ${name} from ${url}...`);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FilingByOnboardingLogoSeeder/1.0 (support@filingby.com)"
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Uploading ${name} to Cloudinary folder ${folder}...`);
    const result = await uploadToCloudinary(buffer, folder);
    console.log(`Successfully uploaded ${name} to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`Failed to upload ${name} to Cloudinary:`, err);
    return url;
  }
};

const seedSettings = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding settings...");

    // Upload CA brand logos to Cloudinary and format list
    const ca_client_logos = [];
    for (let i = 0; i < rawCALogos.length; i++) {
      const item = rawCALogos[i];
      const cloudinaryUrl = await uploadLogoFile(item.name, item.url, "brand_logos");
      ca_client_logos.push({
        id: (i + 1).toString(),
        name: item.name,
        imageUrl: cloudinaryUrl
      });
    }

    // Upload VS brand logos to Cloudinary and format list
    const vs_client_logos = [];
    for (let i = 0; i < rawVSLogos.length; i++) {
      const item = rawVSLogos[i];
      const cloudinaryUrl = await uploadLogoFile(item.name, item.url, "brand_logos");
      vs_client_logos.push({
        id: (i + 1).toString(),
        name: item.name,
        imageUrl: cloudinaryUrl
      });
    }

    // Upload CA office photos to Cloudinary and format list
    console.log("\n--- Seeding CA Office Photos ---");
    const ca_office_photos = [];
    for (let i = 0; i < defaultCAOfficePhotos.length; i++) {
      const item = defaultCAOfficePhotos[i];
      const cloudinaryUrl = await uploadLogoFile(item.name, item.url, "office_photos");
      ca_office_photos.push({
        id: (i + 1).toString(),
        name: item.name,
        imageUrl: cloudinaryUrl
      });
    }

    // Upload VS office photos to Cloudinary and format list
    console.log("\n--- Seeding VS Office Photos ---");
    const vs_office_photos = [];
    for (let i = 0; i < defaultVSOfficePhotos.length; i++) {
      const item = defaultVSOfficePhotos[i];
      const cloudinaryUrl = await uploadLogoFile(item.name, item.url, "office_photos");
      vs_office_photos.push({
        id: (i + 1).toString(),
        name: item.name,
        imageUrl: cloudinaryUrl
      });
    }

    const seedData = {
      ca_announcement_text: "🎉 Get 15% OFF | Code: FILING15",
      ca_contact_phone: "+91 75671 26945",
      ca_whatsapp_url: "https://wa.me/917567126945",
      ca_contact_email: "support@filingby.com",
      ca_contact_address: "3rd Floor, Business Center, New Delhi, India",
      vs_announcement_text: "🎉 Special Offer: Virtual Office starting at just ₹999/month — Limited slots!",
      vs_contact_phone: "+91 75671 26945",
      vs_whatsapp_url: "https://wa.me/917567126945",
      vs_contact_email: "support@filingby.com",
      vs_contact_address: "402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009",
      ca_client_logos,
      vs_client_logos,
      ca_office_photos,
      vs_office_photos
    };

    for (const [key, value] of Object.entries(seedData)) {
      await Setting.findOneAndUpdate(
        { key },
        { value, isPublic: true },
        { upsert: true, new: true }
      );
      console.log(`Seeded setting in database: ${key}`);
    }

    console.log("\nSettings, Brand Logos, and Cloudinary hosted Office Photos seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding settings failed:", error);
    process.exit(1);
  }
};

seedSettings();
