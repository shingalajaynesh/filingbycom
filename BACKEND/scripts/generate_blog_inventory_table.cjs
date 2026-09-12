const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const mdDir = path.join(__dirname, '../content/blogs');
const distDir = path.join(__dirname, '../../FRONTEND/dist/blog');

const TEMPLATE_PHRASES = [
  "only relevant when a deadline arrives",
  "A simple internal checklist showing what is being filed",
  "simple internal checklist showing what is being filed"
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const dbPosts = await mongoose.connection.db.collection('blogposts').find({}).toArray();
  const dbMap = new Map(dbPosts.map(p => [p.slug, p]));

  const mdFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md')).sort();

  const inventory = [];

  for (const file of mdFiles) {
    const slug = file.replace('.md', '');
    const mdContent = fs.readFileSync(path.join(mdDir, file), 'utf8');
    const dbPost = dbMap.get(slug);
    const dbContent = dbPost ? (dbPost.content || '') : '';
    const distPath = path.join(distDir, slug, 'index.html');
    const distContent = fs.existsSync(distPath) ? fs.readFileSync(distPath, 'utf8') : '';

    const mdHits = TEMPLATE_PHRASES.filter(p => mdContent.includes(p));
    const dbHits = TEMPLATE_PHRASES.filter(p => dbContent.includes(p));
    const distHits = TEMPLATE_PHRASES.filter(p => distContent.includes(p));

    let decision = "Clean";
    if (mdHits.length > 0 || dbHits.length > 0 || distHits.length > 0) {
      decision = "Strong template duplication (Phase 2 rewrite)";
    } else if (slug.includes('tax') || slug.includes('gst') || slug.includes('tds') || slug.includes('itr')) {
      decision = "YMYL update needed (Phase 2 statutory review)";
    } else {
      decision = "Minor template issue / Review in Phase 2";
    }

    inventory.push({
      slug,
      mdCount: mdHits.length,
      dbCount: dbHits.length,
      distCount: distHits.length,
      decision
    });
  }

  console.log(`Audited ${inventory.length} articles.`);
  const grouped = {
    clean: inventory.filter(i => i.decision === 'Clean'),
    strong: inventory.filter(i => i.decision.startsWith('Strong')),
    ymyl: inventory.filter(i => i.decision.startsWith('YMYL')),
    minor: inventory.filter(i => i.decision.startsWith('Minor'))
  };

  console.log(`Strong template duplication: ${grouped.strong.length}`);
  console.log(`YMYL update needed: ${grouped.ymyl.length}`);
  console.log(`Minor template issue / Review: ${grouped.minor.length}`);
  console.log(`Clean: ${grouped.clean.length}`);

  // Write markdown table
  let mdTable = '| # | Article Slug | Markdown Hits | DB Hits | Dist Hits | Decision |\n';
  mdTable += '| :--- | :--- | :---: | :---: | :---: | :--- |\n';
  inventory.forEach((item, idx) => {
    mdTable += `| ${idx + 1} | \`${item.slug}\` | ${item.mdCount} | ${item.dbCount} | ${item.distCount} | ${item.decision} |\n`;
  });

  fs.writeFileSync(path.join(__dirname, 'blog_audit_table.md'), mdTable, 'utf8');
  console.log('Saved table to blog_audit_table.md');
  process.exit(0);
}

run().catch(console.error);
