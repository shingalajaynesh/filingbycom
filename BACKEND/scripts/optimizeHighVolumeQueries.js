import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../src/models/Service.model.js";
import VirtualLocation from "../src/models/VirtualLocation.model.js";

dotenv.config();

const optimizeQueries = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database for Search Console query optimization...");

    // ── 1. OPTIMIZE APEDA REGISTRATION SERVICE ───────────────────────────────
    const apedaService = await Service.findOne({ slug: "apeda-registration" });
    if (apedaService) {
      console.log("Found APEDA Registration service. Optimizing SEO...");
      apedaService.description = "Complete CA-assisted support for online APEDA registration, agricultural export licenses, documentation checklists, and RCMC renewal in India.";
      
      const apedaFaqs = [
        {
          q: "What is APEDA registration, and who needs it?",
          a: "APEDA (Agricultural and Processed Food Products Export Development Authority) registration is mandatory for exporters of scheduled agricultural and processed food products from India. It provides the Import Export Code (IEC) holder with an RCMC registration certificate."
        },
        {
          q: "What documents are required for APEDA registration online?",
          a: "The documents required include: (1) Import Export Code (IEC) copy, (2) Cancelled cheque of the business account, (3) Audited balance sheet or bank certificate, (4) Partnership deed or MOA/AOA, and (5) PAN card of the entity."
        },
        {
          q: "What is the fee and validity of APEDA registration?",
          a: "The official APEDA registration fee is ₹5,000 (excluding GST). The registration certificate (RCMC) is valid for 5 years, after which it must be renewed online by submitting export return statements."
        }
      ];

      for (const faq of apedaFaqs) {
        if (!apedaService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          apedaService.faqs.push(faq);
        }
      }
      await apedaService.save();
      console.log("APEDA Registration optimized!");
    }

    // ── 2. OPTIMIZE TAN REGISTRATION SERVICE ─────────────────────────────────
    const tanService = await Service.findOne({ slug: "tan-registration" });
    if (tanService) {
      console.log("Found TAN Registration service. Optimizing SEO...");
      tanService.description = "Apply for your Tax Deduction and Collection Account Number (TAN card) online. Fast filing of Form 49B, verification, and support for all categories of deductors (LLP, Pvt Ltd, Proprietorship).";
      
      const tanFaqs = [
        {
          q: "What is the full form of TAN card, and who needs it?",
          a: "TAN stands for Tax Deduction and Collection Account Number. It is a 10-digit alphanumeric number mandatory for all individuals, companies, LLPs, and partnership firms who are responsible for deducting or collecting tax at source (TDS/TCS)."
        },
        {
          q: "How many days does it take to get a TAN number online?",
          a: "Once Form 49B is submitted online and physical/digital credentials are authenticated, the Income Tax Department typically allocates the TAN number within 2 to 3 working days."
        },
        {
          q: "What is the difference between PAN and TAN?",
          a: "PAN (Permanent Account Number) is used for tracking income tax filings and financial transactions. TAN is exclusively used by tax deductors for depositing Tax Deducted at Source (TDS) and filing TDS returns."
        }
      ];

      for (const faq of tanFaqs) {
        if (!tanService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          tanService.faqs.push(faq);
        }
      }
      await tanService.save();
      console.log("TAN Registration optimized!");
    }

    // ── 3. OPTIMIZE LLP COMPLIANCE SERVICE ───────────────────────────────────
    const llpService = await Service.findOne({ slug: "roc-annual-filing-llp" });
    if (llpService) {
      console.log("Found LLP Compliance service. Optimizing SEO...");
      
      const llpFaqs = [
        {
          q: "What are the mandatory annual compliances for an LLP in India?",
          a: "An LLP must complete two primary annual filings: (1) Form 11 (Annual Return of LLP) due by May 30th, and (2) Form 8 (Statement of Account & Solvency) due by October 30th. These are mandatory even if the LLP has zero active transactions."
        },
        {
          q: "What are the penalties for late filing of LLP compliance forms?",
          a: "Under the MCA regulations, a delay in filing LLP Form 8 or Form 11 incurs a penalty of ₹100 per day per form with no maximum upper limit. Timely filing is critical to avoid heavy statutory fees."
        }
      ];

      for (const faq of llpFaqs) {
        if (!llpService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          llpService.faqs.push(faq);
        }
      }
      await llpService.save();
      console.log("LLP Compliance optimized!");
    }

    // ── 4. OPTIMIZE PRIVATE LIMITED WINDING UP ──────────────────────────────
    const windingUpService = await Service.findOne({ slug: "pvt-winding-up" });
    if (windingUpService) {
      console.log("Found Private Limited Winding Up service. Optimizing SEO...");
      
      const windingFaqs = [
        {
          q: "What is the process for winding up a private limited company in India?",
          a: "A private limited company can be closed online using the Fast Track Exit mode (Form STK-2) if it has zero assets and liabilities and has been inactive for at least 2 years. Otherwise, it requires passing a special resolution and appointing a liquidator."
        },
        {
          q: "Is there any tax on winding up a company?",
          a: "Yes, any distribution of assets to shareholders during winding up is taxed as 'deemed dividend' in the hands of shareholders under Section 2(22)(c) of the Income Tax Act, to the extent of accumulated profits."
        }
      ];

      for (const faq of windingFaqs) {
        if (!windingUpService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          windingUpService.faqs.push(faq);
        }
      }
      await windingUpService.save();
      console.log("Winding Up optimized!");
    }

    // ── 5. SEED KOLKATA VIRTUAL OFFICE ───────────────────────────────────────
    const kolkataCity = {
      slug: "kolkata",
      name: "Kolkata",
      state: "West Bengal",
      tagline: "Salt Lake Sector V, Park Street & Rajarhat",
      rate: "999",
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1481977797746!2d88.4272186!3d22.574443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b22b79a523%3A0xe54e6378c2e64627!2sSector%20V%2C%20Salt%20Lake%20City%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        {
          name: "Salt Lake Sector V Tech Hub",
          slug: "salt-lake-sector-v",
          address: "5th Floor, Block EP & GP, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
          feature: "Premium IT Park Location, Compliant Workspaces",
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
          priceGST: "999",
          priceIncorp: "1,299",
          priceMail: "599",
          amenities: ["High-speed Wi-Fi", "Front Desk Representative", "Mail Forwarding", "Conference Rooms", "GST Officer Physical Audit Support"],
          description: "Establish your business in West Bengal's leading technology park. Fully compliant with all WB GST requirements, featuring dedicated name boards and desks.",
          mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1481977797746!2d88.4272186!3d22.574443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b22b79a523%3A0xe54e6378c2e64627!2sSector%20V%2C%20Salt%20Lake%20City%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
          photos: [
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
          ]
        },
        {
          name: "Park Street Business Centre",
          slug: "park-street",
          address: "Level 3, Park Plaza, Park Street, Kolkata, West Bengal - 700016",
          feature: "Premium Central Kolkata Business Address",
          image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
          priceGST: "1,199",
          priceIncorp: "1,499",
          priceMail: "699",
          amenities: ["Prestigious Address", "Courier Management", "Lounge Access", "Meeting Rooms", "Name Board Listing"],
          description: "Establish a corporate presence on Kolkata's most prestigious commercial avenue. Ideal for high-profile business invoicing and mailbox forwarding.",
          mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.654302213123!2d88.3512217!3d22.5482354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027715f5a8947f%3A0xa19bf9e557bfa373!2sPark%20Street%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
          photos: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
          ]
        }
      ],
      faqs: [
        { q: "Can I use the Kolkata virtual office address for West Bengal GST registration?", a: "Yes, our spaces provide the exact legal documentation (NOC, utility bill, commercial rent agreement) required by WB GST officials." },
        { q: "Is physical verification supported for corporate tax officer visits in Kolkata?", a: "Yes, our on-site team facilitates physical desk setup and documentation files during statutory tax officer visits." }
      ]
    };

    const existingKolkata = await VirtualLocation.findOne({ slug: "kolkata" });
    if (!existingKolkata) {
      await VirtualLocation.create(kolkataCity);
      console.log("Seeded Kolkata Virtual Office!");
    } else {
      console.log("Kolkata Virtual Office already exists. Updating details...");
      Object.assign(existingKolkata, kolkataCity);
      await existingKolkata.save();
    }

    console.log("All Search Console queries database optimizations completed successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Optimization failed:", error);
    process.exit(1);
  }
};

optimizeQueries();
