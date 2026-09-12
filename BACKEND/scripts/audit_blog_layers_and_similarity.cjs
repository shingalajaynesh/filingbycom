const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mdDir = path.join(__dirname, '../content/blogs');
const distDir = path.join(__dirname, '../../FRONTEND/dist/blog');

const TEMPLATE_PHRASES = [
  "only relevant when a deadline arrives",
  "A simple internal checklist showing what is being filed",
  "simple internal checklist showing what is being filed",
  "How long does this take?",
  "What documents do I need?",
  "What happens if there is a delay?",
  "Can I do this online?",
  "Is this mandatory for my business?"
];

// Tokenize text for n-gram shingles
function getShingles(text, k = 5) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  const shingles = new Set();
  for (let i = 0; i <= words.length - k; i++) {
    shingles.add(words.slice(i, i + k).join(' '));
  }
  return shingles;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

// Clean editorial body from boilerplate chrome
function cleanBody(text) {
  return text
    // remove markdown headers
    .replace(/^#+.*$/gm, '')
    // remove disclaimers
    .replace(/This article is general information[\s\S]*?exact facts\./gi, '')
    .replace(/Editorial note[\s\S]*?exact facts\./gi, '')
    .replace(/Published by:? FilingBy Editorial Team/gi, '')
    .replace(/Last updated:? \d{4}-\d{2}-\d{2}/gi, '')
    // remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    .trim();
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const dbPosts = await mongoose.connection.db.collection('blogposts').find({}).toArray();
  const dbPostMap = new Map(dbPosts.map(p => [p.slug, p]));

  const mdFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));
  console.log(`Found ${mdFiles.length} Markdown files in content/blogs`);
  console.log(`Found ${dbPosts.length} posts in MongoDB blogposts`);

  const results = [];
  const articlesCleaned = [];

  for (const file of mdFiles) {
    const slug = file.replace('.md', '');
    const mdPath = path.join(mdDir, file);
    const mdContent = fs.readFileSync(mdPath, 'utf8');

    // DB post
    const dbPost = dbPostMap.get(slug);
    const dbContent = dbPost ? (dbPost.content || '') : '';

    // Dist HTML
    const distPath = path.join(distDir, slug, 'index.html');
    const distContent = fs.existsSync(distPath) ? fs.readFileSync(distPath, 'utf8') : '';

    // Search template phrases
    const mdHits = TEMPLATE_PHRASES.filter(p => mdContent.toLowerCase().includes(p.toLowerCase()));
    const dbHits = TEMPLATE_PHRASES.filter(p => dbContent.toLowerCase().includes(p.toLowerCase()));
    const distHits = TEMPLATE_PHRASES.filter(p => distContent.toLowerCase().includes(p.toLowerCase()));

    results.push({
      slug,
      mdHits,
      dbHits,
      distHits,
      hasDist: Boolean(distContent)
    });

    const cleaned = cleanBody(mdContent);
    articlesCleaned.push({
      slug,
      cleaned,
      shingles: getShingles(cleaned, 5),
      paragraphs: mdContent.split(/\n\s*\n/).map(p => cleanBody(p)).filter(p => p.length > 80)
    });
  }

  console.log('\n=== LAYER AUDIT RESULTS (TEMPLATE PHRASES) ===');
  let totalWithHits = 0;
  for (const r of results) {
    if (r.mdHits.length > 0 || r.dbHits.length > 0 || r.distHits.length > 0) {
      totalWithHits++;
      console.log(`[FLAGGED] ${r.slug}: MD=[${r.mdHits.join(', ')}], DB=[${r.dbHits.join(', ')}], Dist=[${r.distHits.join(', ')}]`);
    }
  }
  if (totalWithHits === 0) {
    console.log('✅ ZERO template hits found across all 60 articles in Markdown, MongoDB, and Dist HTML!');
  } else {
    console.log(`⚠️ ${totalWithHits} articles contain template phrase hits.`);
  }

  // Programmatic similarity check
  console.log('\n=== PROGRAMMATIC SIMILARITY ANALYSIS ===');
  let highestSim = 0;
  let highestPair = null;
  const pairScores = [];

  for (let i = 0; i < articlesCleaned.length; i++) {
    for (let j = i + 1; j < articlesCleaned.length; j++) {
      const a = articlesCleaned[i];
      const b = articlesCleaned[j];
      const sim = jaccardSimilarity(a.shingles, b.shingles);
      pairScores.push({ pair: `${a.slug} <--> ${b.slug}`, sim });
      if (sim > highestSim) {
        highestSim = sim;
        highestPair = { a: a.slug, b: b.slug, sim };
      }
    }
  }

  pairScores.sort((x, y) => y.sim - x.sim);

  console.log(`Total pairs compared: ${pairScores.length}`);
  console.log(`Highest similarity pair: ${highestPair.a} <--> ${highestPair.b} with Jaccard ${(highestPair.sim * 100).toFixed(2)}%`);
  console.log('\nTop 5 Most Similar Pairs:');
  for (let i = 0; i < Math.min(5, pairScores.length); i++) {
    console.log(` ${i + 1}. ${(pairScores[i].sim * 100).toFixed(2)}% : ${pairScores[i].pair}`);
  }

  // Top repeated paragraph clusters
  console.log('\n=== REPEATED PARAGRAPH ANALYSIS ===');
  const paraMap = new Map();
  for (const a of articlesCleaned) {
    for (const p of a.paragraphs) {
      // Normalize paragraph
      const norm = p.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
      if (!paraMap.has(norm)) {
        paraMap.set(norm, { sample: p.slice(0, 100) + '...', articles: new Set() });
      }
      paraMap.get(norm).articles.add(a.slug);
    }
  }

  const repeatedParas = [...paraMap.values()].filter(v => v.articles.size > 1);
  repeatedParas.sort((a, b) => b.articles.size - a.articles.size);

  console.log(`Total unique substantial paragraphs: ${paraMap.size}`);
  console.log(`Total repeated paragraphs (shared by >1 article): ${repeatedParas.length}`);

  if (repeatedParas.length > 0) {
    console.log('\nTop 10 Repeated Paragraph / Signature Clusters:');
    for (let i = 0; i < Math.min(10, repeatedParas.length); i++) {
      const item = repeatedParas[i];
      console.log(`\nCluster ${i + 1} (Shared by ${item.articles.size} articles):`);
      console.log(`Snippet: "${item.sample}"`);
      console.log(`Articles: ${[...item.articles].slice(0, 4).join(', ')}${item.articles.size > 4 ? ` and ${item.articles.size - 4} more` : ''}`);
    }
  } else {
    console.log('✅ ZERO repeated paragraphs found across all 60 articles.');
  }

  process.exit(0);
}

run().catch(console.error);
