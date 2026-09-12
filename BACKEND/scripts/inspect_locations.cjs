const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const locs = await mongoose.connection.db.collection('virtuallocations').find({}).toArray();
  console.log('TOTAL CITIES IN DB:', locs.length);
  let totalAddresses = 0;
  for (const l of locs) {
    console.log(`\nCity: ${l.name} (slug: ${l.slug}, state: ${l.state}), total addresses: ${l.addresses ? l.addresses.length : 0}`);
    if (l.addresses) {
      totalAddresses += l.addresses.length;
      for (const a of l.addresses) {
        console.log(`  - Area Name: "${a.name}" | Area Slug: "${a.slug}" | Route: /virtual-office-${l.slug}/${a.slug}`);
        console.log(`    Full Address: ${a.address}`);
      }
    }
  }
  console.log(`\nTOTAL ADDRESSES ACROSS ALL CITIES: ${totalAddresses}`);
  process.exit(0);
}
check().catch(console.error);
