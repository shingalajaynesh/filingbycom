import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const blogs = await mongoose.connection.db.collection('blogposts').find({}, { projection: { slug: 1, faq: 1, title: 1 } }).toArray();
    
    console.log(`Auditing ${blogs.length} blogs for 'faq' field in DB:\n`);
    const clean = [];
    const minor = [];
    const strong = [];
    const ymyl = [];

    for (const b of blogs) {
      const faqs = b.faq || [];
      const isYmyl = /itr|tax|gst|penalty|fine|llp|incorporation|notice|director|audit|fssai/i.test(b.slug);
      
      let templateCount = 0;
      for (const item of faqs) {
        const q = item.q || item.question || '';
        const a = item.a || item.answer || '';
        const text = q + ' ' + a;
        if (/3–7 working days|3-7 working days|Government fee varies|100% online|No physical visits/i.test(text)) {
          templateCount++;
        }
      }

      if (templateCount >= 2) {
        strong.push({ slug: b.slug, templateCount, totalFaqs: faqs.length });
      } else if (templateCount === 1) {
        minor.push({ slug: b.slug, templateCount, totalFaqs: faqs.length });
      } else {
        clean.push({ slug: b.slug, totalFaqs: faqs.length });
      }

      if (isYmyl && templateCount > 0) {
        ymyl.push({ slug: b.slug, templateCount, totalFaqs: faqs.length });
      }
    }

    console.log(`Clean FAQs: ${clean.length}`);
    console.log(`Minor Template Issue: ${minor.length}`);
    console.log(`Strong Template Duplication: ${strong.length}`);
    console.log(`YMYL Update Needed: ${ymyl.length}`);

    if (minor.length) console.log('\nMinor issues sample:', minor.slice(0, 10));
    if (strong.length) console.log('\nStrong issues sample:', strong.slice(0, 10));
    if (ymyl.length) console.log('\nYMYL issues sample:', ymyl.slice(0, 10));

    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
})();
