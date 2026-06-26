import fs from "fs";
import path from "path";
import partnershipDeedService from "../src/services/partnershipDeed.service.js";

const sampleDeed = {
  businessName: "RISEMICRO MOTION",
  businessActivity: "video editing",
  officeAddress: "10, Bhakti Nandan Society, Sector-4, Sardar Chowk, Mota Varachha, Surat, Gujarat - 394101",
  deedDate: new Date("2026-06-21"),
  partners: [
    {
      fullName: "HITESHKUMAR VRAJLAL SARDHARA",
      type: "individual",
      fatherName: "VRAJLAL SHAMJIBHAI SARDHARA",
      address: "B-1, First Floor, Vishvanath Society, Mota Varchha, Surat, Chorasi, Surat, Gujarat-394101",
      profitSharePercent: 25.00,
      isManagingPartner: true,
      canOperateBankAccount: true
    },
    {
      fullName: "DHARMESHKUMAR DINESHBHAI KUMBHANI",
      type: "company",
      companyName: "TRANSCODEZY IT SOLUTIONS PRIVATE LIMITED",
      address: "10, Bhakti Nandan Society, Sector-4, Sardar Chowk, Mota Varachha, Surat, Gujarat-395008",
      profitSharePercent: 25.00,
      isManagingPartner: true,
      canOperateBankAccount: true
    },
    {
      fullName: "DHARMIK TRIKAMBHAI OSLANIYA",
      type: "individual",
      fatherName: "TRIKAMBHAI ,PNABHAI OSLANIYA",
      address: "B-701, Shivalik Heights, Near Suriyam Residency, Haridarshan Society, Surat - 395004",
      profitSharePercent: 16.67,
      isManagingPartner: true,
      canOperateBankAccount: true
    },
    {
      fullName: "ASHISH RAJESHBHAI MAKWANA",
      type: "individual",
      fatherName: "RAJESHBHAI BHUPATBHAI MAKWANA",
      address: "B-1/502, PARISHRAM PARK RESIDENCY, VARIYAV ROAD, OPP SHASHWAT BUNGLOW, SURAT – GUJARAT - 395005",
      profitSharePercent: 16.67,
      isManagingPartner: false,
      canOperateBankAccount: false
    },
    {
      fullName: "PIYUSH MUKESHBHAI KAPADIA",
      type: "individual",
      fatherName: "MUKESHBHAI KALUBHAI KAPADIA",
      address: "C-4/103, KRISHNA TOWNSHIP, SATELIGHT ROAD, MOTA VARACHHA, SURAT - 394101",
      profitSharePercent: 16.66,
      isManagingPartner: true,
      canOperateBankAccount: false
    }
  ]
};

async function test() {
  console.log("Starting PDF generation tests via Puppeteer...");
  
  // 1. Run 5-partner test
  try {
    console.log("--- Generating 5-Partner Deed ---");
    const relativeUrl = await partnershipDeedService.generateDeedPDF(sampleDeed);
    console.log(`Deed PDF generated successfully: ${relativeUrl}`);
    const fullPath = path.join(process.cwd(), "public", relativeUrl);
    
    const destPath = "C:/Users/jayne/.gemini/antigravity-ide/brain/391d7686-b832-4b65-84e1-245d9bd4f39d/test_deed_styled.pdf";
    fs.copyFileSync(fullPath, destPath);
    console.log(`Copied generated 5-partner PDF to: ${destPath}`);
  } catch (err) {
    console.error("5-partner test failed:", err);
  }

  // 2. Run 2-partner test
  try {
    console.log("\n--- Generating 2-Partner Deed ---");
    const sampleDeed2 = {
      ...sampleDeed,
      partners: sampleDeed.partners.slice(0, 2).map((p, idx) => ({
        ...p,
        profitSharePercent: idx === 0 ? 60.00 : 40.00
      }))
    };
    
    const relativeUrl = await partnershipDeedService.generateDeedPDF(sampleDeed2);
    console.log(`2-Partner Deed PDF generated successfully: ${relativeUrl}`);
    const fullPath = path.join(process.cwd(), "public", relativeUrl);
    
    const destPath = "C:/Users/jayne/.gemini/antigravity-ide/brain/391d7686-b832-4b65-84e1-245d9bd4f39d/test_deed_2_partners.pdf";
    fs.copyFileSync(fullPath, destPath);
    console.log(`Copied generated 2-partner PDF to: ${destPath}`);
  } catch (err) {
    console.error("2-partner test failed:", err);
  }
}

test();
