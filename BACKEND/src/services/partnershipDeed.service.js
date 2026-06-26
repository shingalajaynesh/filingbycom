import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import mammoth from "mammoth";
import logger from "./logger.service.js";

const PARTNERSHIP_DEED_TEMPLATE_PATH = path.join(process.cwd(), "templates", "partnership-deed-template.docx");

let partnershipDeedTemplateCache = null;
let partnershipDeedTemplatePromise = null;

async function loadPartnershipDeedTemplate() {
  if (partnershipDeedTemplateCache) return partnershipDeedTemplateCache;

  if (!partnershipDeedTemplatePromise) {
    partnershipDeedTemplatePromise = mammoth.extractRawText({ path: PARTNERSHIP_DEED_TEMPLATE_PATH })
      .then(({ value }) => {
        const lines = String(value || "")
          .split(/\r?\n/)
          .map((line) => line.replace(/\s+/g, " ").trim())
          .filter(Boolean);

        const title = lines.find((line) => /deed of partnership/i.test(line)) || "Deed of Partnership";
        const openingLine = lines.find((line) => /this deed of partnership is made/i.test(line)) || null;

        partnershipDeedTemplateCache = {
          lines,
          title,
          openingLine,
        };

        return partnershipDeedTemplateCache;
      })
      .catch((error) => {
        logger.warn("Unable to read partnership deed template docx; using fallback layout.", error);
        partnershipDeedTemplateCache = {
          lines: [],
          title: "Deed of Partnership",
          openingLine: null,
        };
        return partnershipDeedTemplateCache;
      })
      .finally(() => {
        partnershipDeedTemplatePromise = null;
      });
  }

  return partnershipDeedTemplatePromise;
}

// Helper to convert index to ordinal string
export function getOrdinalWord(num) {
  const ordinals = [
    "FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH",
    "SIXTH", "SEVENTH", "EIGHTH", "NINTH", "TENTH",
    "ELEVENTH", "TWELFTH", "THIRTEENTH", "FOURTEENTH", "FIFTEENTH"
  ];
  return ordinals[num - 1] || `${num}TH`;
}

// Helper to convert index to cardinal word (e.g. 2 -> "two")
export function getCardinalWord(num) {
  const cardinals = [
    "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen"
  ];
  return cardinals[num - 1] || String(num);
}

// Helper to convert index to simple ordinal suffix (e.g. 1st, 2nd)
export function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
}

// Helper to extract city name from address
export function extractCityFromAddress(address) {
  if (!address) return "…………";
  const parts = String(address).split(",");
  if (parts.length > 1) {
    return parts[parts.length - 2].replace(/\d+/g, "").trim().toUpperCase() || "…………";
  }
  return String(address).replace(/\d+/g, "").trim().toUpperCase() || "…………";
}

// Helper to format date into "21st Day of June 2026"
export function formatLegalDate(dateInput) {
  if (!dateInput) return "……… Day of ___________ 20___";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "……… Day of ___________ 20___";

  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[date.getMonth()];

  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix} Day of ${monthName} ${year}`;
}

// Generate business name slug for filename
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Builds standard, clean HTML of the Deed of Partnership based on the canonical template.
 * Includes all styling for standard margins, layout spacing, table grids, and signature alignments.
 */
export async function buildDeedHTML(deed) {
  const formattedDate = formatLegalDate(deed.deedDate);
  const formattedOfficeAddress = deed.officeAddress.trim();
  const businessNameUpper = deed.businessName.toUpperCase().trim();
  const activityDesc = deed.businessActivity.trim();
  const cityUpper = extractCityFromAddress(deed.officeAddress);

  // 1. Partner Introductory Paragraphs (with exact bold spans and no spaces)
  const partnerIntroParagraphs = deed.partners.map((partner, idx) => {
    const ordinal = getOrdinalWord(idx + 1);
    const fullNameUpper = partner.fullName.toUpperCase().trim();
    const addressStr = partner.address.trim();

    if (partner.type === "company") {
      const companyUpper = partner.companyName.toUpperCase().trim();
      return `<p class="legal-p-no-indent">${idx + 1}.<strong>${fullNameUpper}</strong>, Nominee Director of <strong>${companyUpper}</strong>, residing at <strong>${addressStr}</strong> hereinafter referred to as <strong>${ordinal} PARTNER</strong>.</p>`;
    } else {
      const fatherUpper = partner.fatherName.toUpperCase().trim();
      return `<p class="legal-p-no-indent">${idx + 1}.<strong>${fullNameUpper}</strong>, son of <strong>${fatherUpper}</strong>, residing at <strong>${addressStr}</strong> hereinafter referred to as <strong>${ordinal} PARTNER</strong>.</p>`;
    }
  }).join("\n");

  // 2. Profit Sharing Table Rows (flex alignment matching coordinates)
  const profitTableRows = deed.partners.map((partner, idx) => {
    const ordinalNum = idx + 1;
    const ordinalSuffix = getOrdinalSuffix(ordinalNum).replace(String(ordinalNum), "");
    
    let detailsHtml = "";
    const isCompany = partner.type === "company";
    if (isCompany) {
      const companyUpper = partner.companyName.toUpperCase().trim();
      const nameUpper = partner.fullName.toUpperCase().trim();
      detailsHtml = `<strong>${companyUpper}</strong><br/>${nameUpper} (Director )`;
    } else {
      const nameUpper = partner.fullName.toUpperCase().trim();
      detailsHtml = `<strong>${nameUpper}</strong>`;
    }
    
    return `
      <div class="profit-row${isCompany ? ' company-row' : ''}">
        <div class="profit-label">${ordinalNum}<sup>${ordinalSuffix}</sup> Partner</div>
        <div class="profit-details">${detailsHtml}</div>
        <div class="profit-pct">${Number(partner.profitSharePercent).toFixed(2)}%</div>
      </div>
    `;
  }).join("\n");

  // 3. Management text
  const managingPartnerNames = deed.partners
    .filter(p => p.isManagingPartner)
    .map(p => p.fullName.toUpperCase().trim());
  
  // Fallback: If no managing partner checked, list all
  const finalManagers = managingPartnerNames.length > 0 
    ? managingPartnerNames 
    : deed.partners.map(p => p.fullName.toUpperCase().trim());
  
  const managersText = finalManagers.map(name => `<strong>${name}</strong>`).join(" AND ");

  // 4. Operation of Bank Accounts text
  const operatingPartnerNames = deed.partners
    .filter(p => p.canOperateBankAccount)
    .map(p => p.fullName.toUpperCase().trim());
  
  // Fallback: If no bank operator checked, list all
  const finalOperators = operatingPartnerNames.length > 0 
    ? operatingPartnerNames 
    : deed.partners.map(p => p.fullName.toUpperCase().trim());
  
  const bankOperatorsText = finalOperators.map(name => `<strong>${name}</strong>`).join(" AND ");

  // 5. Signature Blocks (single column sequential)
  const signatureBlocks = deed.partners.map((partner, idx) => {
    const ordinal = getOrdinalWord(idx + 1);
    const fullNameUpper = partner.fullName.toUpperCase().trim();
    if (partner.type === "company") {
      const companyUpper = partner.companyName.toUpperCase().trim();
      return `
        <div class="sig-block">
          <p class="sig-label"><strong>${ordinal} PARTNER</strong></p>
          <p class="sig-name"><strong>${companyUpper}</strong></p>
          <p class="sig-name"><strong>${fullNameUpper}</strong></p>
          <p class="sig-title">(AUTHORIZE NOMINEE DIRECTOR)</p>
        </div>
      `;
    } else {
      return `
        <div class="sig-block">
          <p class="sig-label"><strong>${ordinal} PARTNER</strong></p>
          <p class="sig-name"><strong>${fullNameUpper}</strong></p>
        </div>
      `;
    }
  }).join("\n");

  let clauseNum = 1;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    @page {
      size: 612pt 1008pt;
      margin-top: 69.8pt;
      margin-bottom: 69.8pt;
      margin-left: 90.1pt;
      margin-right: 90pt;
    }
    @page:first {
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    h1, h2, p, table, tr, td, div {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: Cambria, "Liberation Serif", Caladea, serif;
      font-size: 12.7pt;
      line-height: 22.3pt;
      color: #000000;
      -webkit-print-color-adjust: exact;
    }
    .cover-page {
      width: 612pt;
      height: 1008pt;
      position: relative;
      background: #ffffff;
    }
    .cover-biz-name {
      position: absolute;
      top: 340.9pt;
      left: 0;
      width: 612pt;
      text-align: center;
      font-size: 21.2pt;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .cover-deed-title {
      position: absolute;
      top: 390.7pt;
      left: 0;
      width: 612pt;
      text-align: center;
      font-size: 21.2pt;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .cover-address {
      position: absolute;
      top: 439.2pt;
      left: 90pt;
      width: 432pt;
      text-align: center;
      font-size: 12.7pt;
      font-weight: bold;
      line-height: 22.3pt;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .no-margin-top {
      margin-top: 0 !important;
    }
    .content-container {
      width: 100%;
    }
    h1.title {
      font-size: 17pt;
      font-weight: bold;
      text-align: center;
      margin: 0;
      margin-bottom: 31.8pt;
      line-height: 1.2;
    }
    h2.section-title {
      font-size: 12.7pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
      margin-top: 22.3pt;
      line-height: 22.3pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    .legal-p, .legal-p-no-indent {
      text-align: justify;
      margin: 0;
      margin-bottom: 22.3pt;
      line-height: 22.3pt;
    }
    .clause-p {
      text-align: justify;
      margin: 0;
      line-height: 22.3pt;
    }
    .profit-table-wrapper {
      margin-top: 0;
      margin-bottom: 22.3pt;
    }
    .profit-table {
      font-size: 14.8pt;
      line-height: 19.1pt;
      margin-left: 14.5pt;
      width: 443.4pt;
      min-width: 443.4pt;
    }
    .profit-row {
      display: flex;
      margin-bottom: 0;
    }
    .profit-row.company-row {
      margin-bottom: 10.6pt;
    }
    .profit-label {
      width: 77pt;
      min-width: 77pt;
      flex-shrink: 0;
    }
    .profit-details {
      width: 320pt;
      min-width: 320pt;
      flex-shrink: 0;
    }
    .profit-pct {
      width: 46.4pt;
      min-width: 46.4pt;
      text-align: right;
      flex-shrink: 0;
    }
    .profit-label sup {
      font-size: 10.6pt;
      vertical-align: super;
    }
    .table-wrapper {
      margin-top: 0;
      margin-bottom: 0;
    }
    table.remun-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.7pt;
      margin-bottom: 22.3pt;
    }
    table.remun-table, table.remun-table td {
      border: 1px solid #000000;
    }
    table.remun-table td {
      padding: 6.4pt 10.6pt;
      vertical-align: top;
      line-height: 22.3pt;
    }
    .sig-block {
      margin-top: 65.7pt;
      page-break-inside: avoid;
    }
    .sig-block:first-child {
      margin-top: 44.5pt;
    }
    .sig-label, .sig-name {
      font-weight: bold;
      margin: 0;
      text-transform: uppercase;
      line-height: 22.3pt;
    }
    .sig-title {
      font-weight: normal;
      margin: 0;
      text-transform: uppercase;
      line-height: 22.3pt;
    }
    .witness-block {
      margin-top: 65.7pt;
      page-break-inside: avoid;
    }
    .witness-header {
      font-weight: bold;
      margin: 0;
      margin-bottom: 22.3pt;
      line-height: 22.3pt;
    }
    .witness-line {
      margin: 0;
      margin-bottom: 22.3pt;
      line-height: 22.3pt;
    }
  </style>
</head>
<body>
  <div class="cover-page">
    <div class="cover-biz-name">${businessNameUpper}</div>
    <div class="cover-deed-title">PARTNERSHIP DEED</div>
    <div class="cover-address">Address: ${formattedOfficeAddress}</div>
  </div>
  <div class="page-break"></div>

  <div class="content-container">
    <h1 class="title">Deed of Partnership</h1>
    <p class="legal-p-no-indent">This deed of partnership is made on <strong>${formattedDate}</strong> between:</p>
    
    ${partnerIntroParagraphs}

    <p class="legal-p-no-indent">Whereas, the parties hereto have agreed to commence business in partnership among themselves with the effect from the date of this presents a business interalia ${activityDesc} under the name and style of <strong>M/S. ${businessNameUpper}</strong>, having its office at <strong>${formattedOfficeAddress}</strong> and it is expedient to have written instrument of partnership. Now this partnership deed witnesses as follows:</p>

    <h2 class="section-title">${clauseNum++}. NAME OF BUSINESS</h2>
    <p class="legal-p-no-indent"><strong>“M/S. ${businessNameUpper}”</strong></p>

    <h2 class="section-title">${clauseNum++}. BUSINESS ACTIVITY</h2>
    <p class="legal-p-no-indent">The parties here to have mutually agreed to carry on the business of ALL TYPES OF ${activityDesc.toUpperCase()} services.</p>

    <h2 class="section-title page-break no-margin-top">${clauseNum++}. PLACE OF BUSINESS</h2>
    <p class="legal-p-no-indent">The principal place of the partnership business will be situated at <strong>${formattedOfficeAddress}</strong></p>

    <h2 class="section-title">${clauseNum++}. DURATION OF PARTNERSHIP</h2>
    <p class="legal-p-no-indent">The duration of the partnership will be at will.</p>

    <h2 class="section-title">${clauseNum++}. CAPITAL OF THE FIRM</h2>
    <p class="legal-p-no-indent">That the capital required for the partnership shall be contributed by the partners as mutually agreed upon amongst the partners. A simple interest @12% p.a. shall be payable by the firm to the partners on their capital contribution.</p>

    <h2 class="section-title">${clauseNum++}. PROFIT SHARING RATIO</h2>
    <p class="legal-p-no-indent">The profit or loss of the firm shall be shared as per following ratio among all the partners and transferred to partner’s current account.</p>

    <div class="profit-table-wrapper">
      <div class="profit-table">
        ${profitTableRows}
      </div>
    </div>

    <h2 class="section-title">${clauseNum++}. MANAGEMENT</h2>
    <p class="legal-p-no-indent">The <strong>${managersText}</strong> shall be Managing Partner and he will look after all the day to day transaction of the firm and any legal activities in the name of the firm and the remaining partners shall co-operate to do so.</p>

    <h2 class="section-title">${clauseNum++}. OPERATION OF BANK ACCOUNTS</h2>
    <p class="legal-p-no-indent">The firm shall open a current account in the name of <strong>M/S. ${businessNameUpper}</strong>, at any bank and such account shall be operated by <strong>${bankOperatorsText}</strong> as declared from time to time to the Banks.</p>

    <h2 class="section-title">${clauseNum++}. BORROWING</h2>
    <p class="legal-p-no-indent">The written consent of all Partners will be required for the partnership to avail credit facilities from any financial institution.</p>

    <h2 class="section-title page-break no-margin-top">${clauseNum++}. ACCOUNTS</h2>
    <p class="legal-p-no-indent">The firms shall regularly maintain in the ordinary course of business, true and correct accounts of all its transactions and also of all its assets and liabilities, the property books of account, which shall ordinarily be kept at the firm’s place of business. The accounting year shall be the financial year from 1st April onwards and the balance sheet shall be properly audited and the same shall be signed by all the Partners. Every Partner shall have access to the books and the right to verify their correctness.</p>

    <h2 class="section-title">${clauseNum++}. Remuneration to partners:-</h2>
    <p class="legal-p-no-indent">We, the partners, have agreed to act as active partners. Also we partners who are acting as working partners of this partnership firm of ours and looking after the day to day running of the business and working in the partnership are entitled to remuneration as mentioned below.</p>

    <div class="table-wrapper">
      <table class="remun-table">
        <tbody>
          <tr>
            <td>1. If loss or Rs. 6,00,000/- in case of annual book profit (accounting profit).</td>
            <td>Rs. 3,00,000/- or 90% of book profit whichever is higher,</td>
          </tr>
          <tr>
            <td>2. Rs. 6,00,000/- above book profit</td>
            <td>60% of book profit</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="legal-p-no-indent">(a) Annual remuneration of each partner to be apportioned according to the percentage of income of the partnership firm as per the share of profit and loss of that partner.</p>
    <p class="legal-p-no-indent">(b) For the calculation of the amount mentioned above, the income as per Explanation 3 of Section: 40(b) of the Income-tax Act or the provisions which are subject to that assessment year and the amendments thereto have to be taken into account.</p>
    <p class="legal-p-no-indent">(c) If the partnership firm has suffered loss in computing the income as per the provisions of the Income Tax Act as mentioned in Clause No. (b) above, then the partners shall not be entitled to remuneration in that case.</p>
    <p class="legal-p-no-indent">(d) Partners in a partnership firm may increase or decrease the amount of remuneration to the amount specified above. Also, the working partners of the entire party shall not be able to alter or change the method of calculation of remuneration mentioned in (a) above.</p>
    <p class="legal-p-no-indent">(e) It is decided to pay remuneration to the working partners for being active in the partnership firm. The amount of their remuneration has to be deposited with them at the end of the fiscal year when the accounts of the firm are to be finalized and will be eligible to pay remuneration as mentioned in No. (a) above.</p>
    <p class="legal-p-no-indent page-break no-margin-top">(f) Active partners may withdraw their remuneration as working partners during the accounting year. Any amount deposited in the capital of the respective partners and against their current capital or against their interest in the profits of that accounting year can be withdrawn by all the parties as determined.</p>

    <h2 class="section-title">${clauseNum++}. RETIREMENT</h2>
    <p class="legal-p">If any partner shall at anytime during the subsistence of the partnership, be desirous of retiring from the firm, it shall be competent from his to do so, provided he shall give at least one calendar month notice of his intention of doing so. The remaining partner shall pay to the retiring partner or his legal representatives of the deceased partner, the purchase money of his share in the assets of the firm.</p>

    <h2 class="section-title">${clauseNum++}. DEATH OF PARTNER</h2>
    <p class="legal-p">In the event of the death of any partners, one of the legal representatives of the deceased partner shall become the partner of the firm and in the event the legal representative show their denial to point the firm, they shall be paid the part of the part of the purchase amount calculated as on the date of the death of the partner.</p>

    <h2 class="section-title">${clauseNum++}. ARBITRATION</h2>
    <p class="legal-p">Whenever there be any difference of opinion or any dispute between the partners the partners shall refer the same to an arbitration of one person. The decision of the arbitration so nominated shall be final and binding on all partners, such arbitration proceedings shall be governed by Indian Arbitration Act, which is in force.</p>

    <p class="clause-p">${clauseNum++}. That the provisions of the INDIAN PARTNERSHIP ACT 1932, shall apply as regards matters not expressly provided for hereinbefore in this partnership deed.</p>
    <p class="clause-p">${clauseNum++}. That the matters for which no provisions have been made in this deed may be decided upon by mutual consent of the parties in writing.</p>

    <p class="clause-p">…………………………..</p>
    <p class="clause-p"><strong>${cityUpper}</strong></p>

    <p class="legal-p-no-indent page-break no-margin-top">In witness whereof, this deed of partnership is signed sealed and delivered this <strong>${formattedDate}</strong> at <strong>${formattedOfficeAddress}</strong>.</p>

    <div class="sig-container">
      ${signatureBlocks}
    </div>

    <div class="witness-block">
      <p class="witness-header"><strong>WITNESS:</strong></p>
      <p class="witness-line">1.</p>
      <p class="witness-line">2.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Service class to handle Partnership Deed generation operations.
 */
class PartnershipDeedService {
  /**
   * Generates a Partnership Deed PDF based on the model record and saves it locally.
   * File is stored under: public/documents/PartnershipDeed_{businessNameSlug}_{timestamp}.pdf
   * Returns the local relative URL (/documents/filename.pdf) or absolute path.
   */
  generateDeedPDF = async (deed) => {
    try {
      const htmlContent = await buildDeedHTML(deed);
      const slug = slugify(deed.businessName);
      const timestamp = Date.now();
      const filename = `PartnershipDeed_${slug}_${timestamp}.pdf`;
      
      const publicDocsDir = path.join(process.cwd(), "public", "documents");
      if (!fs.existsSync(publicDocsDir)) {
        fs.mkdirSync(publicDocsDir, { recursive: true });
      }
      
      const outputPath = path.join(publicDocsDir, filename);

      logger.info(`Launching Puppeteer to generate PDF at ${outputPath}...`);
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      
      // Output exact point-sized PDF with zero margins
      await page.pdf({
        path: outputPath,
        width: "8.5in",
        height: "14in",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px",
        },
      });

      await browser.close();
      logger.info(`Successfully generated partnership deed PDF: ${filename}`);

      // Return the URL that can be used to reference this document
      return `/documents/${filename}`;
    } catch (error) {
      logger.error("Failed to generate PDF via Puppeteer:", error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  };
}

export default new PartnershipDeedService();
