import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../src/models/Service.model.js";

dotenv.config();

const optimize = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database to apply SEO optimizations...");

    // 1. Optimize Trust Registration Service
    const trustService = await Service.findOne({ slug: "trust-registration" });
    if (trustService) {
      console.log(`Found Trust Registration service. Optimizing SEO...`);
      
      // Update description to target key search queries
      trustService.description = (trustService.description || "") + 
        " Comprehensive assistance for trust registration, 12A/80G tax exemptions, trust company compliance checklists, and mandatory annual trust audits in India.";
      
      // Update/Append FAQs targeting trust audit, compliance checklist
      const newFaqs = [
        {
          q: "What is a trust audit, and when is it mandatory?",
          a: "A trust audit is an independent audit of accounts conducted by a qualified Chartered Accountant. It is mandatory under Section 12A/12AB of the Income Tax Act if the trust seeks tax exemptions or if its total income exceeds the basic exemption limit in any financial year."
        },
        {
          q: "What is included in the trust compliance checklist?",
          a: "The core trust compliance checklist includes: (1) maintaining proper double-entry books of accounts, (2) obtaining a trust audit report in Form 10B/10BB, (3) filing the annual ITR-7 return, (4) renewing Section 80G tax benefits, and (5) submitting foreign contribution returns (FCRA) if applicable."
        },
        {
          q: "What are the key trust company compliance regulations in India?",
          a: "Trusts must ensure that: funds are invested in specified securities under Section 11(5), commercial activities are purely incidental to charitable objects, proper registers are kept, and statutory trust audits are completed before the income tax filing deadline."
        }
      ];

      // Add unique FAQs
      for (const faq of newFaqs) {
        if (!trustService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          trustService.faqs.push(faq);
        }
      }
      
      await trustService.save();
      console.log("Trust Registration service optimized successfully!");
    } else {
      console.log("Service 'trust-registration' not found in database.");
    }

    // 2. Optimize CSR Registration Service
    const csrService = await Service.findOne({ slug: "csr-registration" });
    if (csrService) {
      console.log(`Found CSR Registration service. Optimizing SEO...`);
      
      csrService.description = (csrService.description || "") + 
        " Expert CA support for corporate CSR registration (Form CSR-1), compliance reports, and independent CSR audits to verify eligible fund utilization under Section 135.";

      const newFaqs = [
        {
          q: "What is the meaning of a CSR audit?",
          a: "A CSR (Corporate Social Responsibility) audit is a formal review of a company's CSR projects, expenditures, and compliance with Section 135 of the Companies Act, 2013. It verifies that CSR funds were spent on eligible activities and projects."
        },
        {
          q: "Is a CSR audit report mandatory for companies?",
          a: "Yes, companies meeting CSR thresholds must document their CSR policy, projects, and expenditures in the Board's Report. An independent CSR audit report provides verification and assurance that the funds were utilized appropriately without any diversion."
        },
        {
          q: "How do you prepare a checklist for a CSR audit?",
          a: "To prepare for a CSR audit, ensure you have: (1) CSR Committee approval resolutions, (2) CSR-1 registration certificate copy, (3) project completion reports, (4) impact assessment reports (if applicable), and (5) utilization certificates from implementing agencies."
        }
      ];

      for (const faq of newFaqs) {
        if (!csrService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          csrService.faqs.push(faq);
        }
      }

      await csrService.save();
      console.log("CSR Registration service optimized successfully!");
    } else {
      console.log("Service 'csr-registration' not found in database.");
    }

    // 3. Optimize MOA Amendment Service
    const moaService = await Service.findOne({ slug: "moa-amendment" });
    if (moaService) {
      console.log(`Found MOA Amendment service. Optimizing SEO...`);
      
      moaService.description = (moaService.description || "") + 
        " Seamless process to amend the Memorandum of Association (MOA) and change the Object Clause of your company. Fully online filing of Form MGT-14 with the Registrar of Companies (ROC).";

      const newFaqs = [
        {
          q: "How do you amend the Object Clause of the Memorandum of Association (MOA)?",
          a: "Amending the Object Clause of the MOA requires: (1) passing a Board Resolution, (2) passing a Special Resolution in an EGM, and (3) filing Form MGT-14 with the Registrar of Companies (ROC) within 30 days of the resolution along with the amended copy of MOA."
        },
        {
          q: "What is the process and timeline for an MOA amendment?",
          a: "The MOA amendment process is fully online. Once the shareholders approve the amendment, Form MGT-14 is filed on the MCA portal. The Registrar of Companies (ROC) reviews and approves the filing, which typically takes 7 to 15 working days."
        },
        {
          q: "What is the significance of the Object Clause in the Memorandum of Association?",
          a: "The Object Clause defines the scope of activities and businesses a company is legally permitted to carry out. Any transaction beyond the scope of the Object Clause is considered ultra vires (beyond powers) and void."
        }
      ];

      for (const faq of newFaqs) {
        if (!moaService.faqs.some(f => f.q.toLowerCase().includes(faq.q.substring(0, 15).toLowerCase()))) {
          moaService.faqs.push(faq);
        }
      }

      await moaService.save();
      console.log("MOA Amendment service optimized successfully!");
    } else {
      console.log("Service 'moa-amendment' not found in database.");
    }

    console.log("Database SEO optimizations completed successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Optimization failed:", error);
    process.exit(1);
  }
};

optimize();
