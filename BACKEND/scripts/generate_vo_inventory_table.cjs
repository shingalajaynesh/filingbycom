const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const locs = await mongoose.connection.db.collection('virtuallocations').find({}).toArray();

  const inventory = [];

  // Main Hubs
  inventory.push({
    route: '/virtual-space',
    city: 'All / Pan-India',
    area: 'Hub Overview',
    dbRecord: 'N/A (Static Hub)',
    active: 'Yes',
    canonical: 'https://www.filingby.com/virtual-space',
    indexable: 'Yes'
  });

  inventory.push({
    route: '/locations',
    city: 'All / Pan-India',
    area: 'Locations Directory',
    dbRecord: 'Aggregates all DB records',
    active: 'Yes',
    canonical: 'https://www.filingby.com/locations',
    indexable: 'Yes'
  });

  inventory.push({
    route: '/ecommerce-office',
    city: 'Pan-India',
    area: 'E-commerce Operator Hub',
    dbRecord: 'Virtual Space Solution',
    active: 'Yes',
    canonical: 'https://www.filingby.com/ecommerce-office',
    indexable: 'Yes'
  });

  // Cities
  for (const l of locs) {
    inventory.push({
      route: `/virtual-office-${l.slug}`,
      city: l.name,
      area: 'City Level Hub',
      dbRecord: `Yes (ID: ${l._id})`,
      active: 'Yes',
      canonical: `https://www.filingby.com/virtual-office-${l.slug}`,
      indexable: 'Yes'
    });

    if (l.addresses) {
      for (const a of l.addresses) {
        inventory.push({
          route: `/virtual-office-${l.slug}/${a.slug}`,
          city: l.name,
          area: `${a.name} (${a.slug})`,
          dbRecord: `Yes (Subdoc ID: ${a._id})`,
          active: 'Yes',
          canonical: `https://www.filingby.com/virtual-office-${l.slug}/${a.slug}`,
          indexable: 'Yes'
        });
      }
    }
  }

  console.log(`Total Virtual Office Routes: ${inventory.length}`);
  console.log(`- Hubs & Landing: 3 (/virtual-space, /locations, /ecommerce-office)`);
  console.log(`- City Pages: ${locs.length}`);
  const totalAreas = inventory.filter(i => i.area.includes('(')).length;
  console.log(`- Genuine Area Pages: ${totalAreas}`);

  let table = '| # | Route | City | Area / Space Name | DB Location Record? | Active? | Canonical URL | Indexable? |\n';
  table += '| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: |\n';
  inventory.forEach((item, idx) => {
    table += `| ${idx + 1} | \`${item.route}\` | ${item.city} | ${item.area} | ${item.dbRecord} | ${item.active} | \`${item.canonical}\` | **${item.indexable}** |\n`;
  });

  fs.writeFileSync(path.join(__dirname, 'vo_inventory_table.md'), table, 'utf8');
  console.log('Saved table to vo_inventory_table.md');
  process.exit(0);
}

run().catch(console.error);
