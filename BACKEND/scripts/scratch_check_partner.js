import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import PartnerApplication from "../src/models/PartnerApplication.model.js";
import VirtualLocation from "../src/models/VirtualLocation.model.js";

dotenv.config();

const checkPartner = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database...");

    const app = await PartnerApplication.findOne({ ownerName: /Giacomo/i }).lean();
    if (!app) {
      console.log("No application found for owner 'Giacomo'");
    } else {
      console.log("\n--- PARTNER APPLICATION ---");
      console.log(`ID: ${app._id}`);
      console.log(`Owner: ${app.ownerName}`);
      console.log(`Space Name: ${app.spaceName}`);
      console.log(`City: "${app.city}"`);
      console.log(`Price: ${app.price}`);
      console.log(`Status: ${app.status}`);
      
      const citySlug = app.city.toLowerCase().trim().replace(/\s+/g, "-");
      console.log(`Expected City Slug: "${citySlug}"`);
      
      const loc = await VirtualLocation.findOne({ slug: citySlug }).lean();
      if (!loc) {
        console.log(`No VirtualLocation found matching slug: "${citySlug}"`);
        
        // Let's search for any location containing the space name
        const allLocs = await VirtualLocation.find().lean();
        console.log("\nSearching in all virtual locations...");
        let found = false;
        allLocs.forEach(l => {
          const addr = l.addresses.find(a => a.name === app.spaceName);
          if (addr) {
            console.log(`Found space in VirtualLocation: "${l.name}" (slug: "${l.slug}")`);
            found = true;
          }
        });
        if (!found) {
          console.log("Space name not found anywhere in VirtualLocation addresses.");
        }
      } else {
        console.log("\n--- VIRTUAL LOCATION FOUND ---");
        console.log(`ID: ${loc._id}`);
        console.log(`Name: ${loc.name}`);
        console.log(`Slug: ${loc.slug}`);
        console.log(`Addresses count: ${loc.addresses.length}`);
        loc.addresses.forEach((a, idx) => {
          console.log(`[${idx}] Name: "${a.name}" | Slug: "${a.slug}" | Address: "${a.address}"`);
        });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkPartner();
