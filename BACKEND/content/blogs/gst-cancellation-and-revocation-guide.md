---
title: "GST Cancellation and Revocation Guide: Voluntary Surrender (REG-16) vs Restoration (REG-21)"
slug: "gst-cancellation-and-revocation-guide"
seoTitle: "GST Cancellation and Revocation Guide: REG-16, REG-21 & GSTR-10"
seoDescription: "Step-by-step guide to voluntary GST cancellation (REG-16), suo-motu revocation (REG-21), Section 29(5) stock reversal, and GSTR-10 final return filing."
focusKeyword: "gst cancellation and revocation guide"
secondaryKeywords:
  - "form gst reg 16 cancellation"
  - "form gst reg 21 revocation of cancellation"
  - "gstr 10 final return deadline"
  - "section 29 cgst act cancellation"
searchIntent: "Informational / Compliance"
category: "GST"
subCategory: "Cancellation"
author: "FilingBy Editorial Team"
authorId: "filingby-editorial-team"
readingTime: "11 mins"
lastUpdated: "2026-09-12"
featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop"
featuredImageWidth: 1200
featuredImageHeight: 675
imageAlt: "Tax professional reviewing GST cancellation order and preparing Form GST REG-21 revocation on the portal"
excerpt: "A comprehensive procedural guide to surrendering inactive GST numbers via Form GST REG-16, handling suo-motu cancellations, stock ITC reversals, and filing REG-21 revocation."
cta: "Need to cancel an inactive GST number or revoke a suo-motu cancellation? FilingBy manages REG-16 surrender, GSTR-10 final returns, and REG-21 restorations."
isPublished: true
relatedServices:
  - "gst-registration"
  - "gst-filing"
relatedBlogs:
  - "gst-registration-guide"
  - "gstr-1-vs-gstr-3b-reconciliation-guide"
  - "composition-vs-regular-gst-scheme"
topicHub: "/blog?category=GST"
relatedCalculators: []
relatedTemplates:
  - "gst-stock-itc-reversal-worksheet"
internalLinks:
  - "/blog?category=GST"
  - "/services/gst-registration"
tableOfContents:
  - "The Legal Architecture of GST Cancellation (Section 29)"
  - "Voluntary Cancellation by the Taxpayer (Form GST REG-16)"
  - "Suo-Motu Cancellation by the Tax Authority"
  - "Registration Suspension Under Rule 21A"
  - "Stock Valuation and ITC Reversal Under Section 29(5)"
  - "The Mandatory Final Return: Form GSTR-10"
  - "Revocation of Suo-Motu Cancellation (Form GST REG-21)"
  - "Timelines, Extended Windows & Officer Adjudication"
  - "Frequently Asked Questions"
  - "Official References"
keyTakeaways:
  - "Voluntary cancellation is initiated by the taxpayer via Form GST REG-16 due to business closure, transfer, demerger, or falling below turnover thresholds."
  - "Under Section 29(5), cancellation triggers a mandatory reversal of Input Tax Credit on closing inputs, semi-finished goods, and capital goods or payment of equivalent output tax, whichever is higher."
  - "Form GSTR-10 (Final Return) must be filed within three months of the cancellation order date; failing to file attracts Section 47 late fees up to ₹10,000."
  - "Revocation of cancellation under Section 30 applies ONLY to suo-motu cancellations by the proper officer; application via Form GST REG-21 must be filed within 30 days (extendable up to 90 days)."
faq:
  - q: "Can a taxpayer apply for revocation if they voluntarily cancelled their GST registration?"
    a: "No. Under Section 30 of the CGST Act, the revocation route (Form GST REG-21) is legally available only when a registration has been cancelled suo-motu by the Proper Officer. If a taxpayer voluntarily surrenders their registration via Form GST REG-16, they cannot revoke it; they must apply for a fresh registration under Form GST REG-01 if they wish to resume operations."
  - q: "What is the time limit for filing Form GST REG-21 for revocation?"
    a: "Under the amended Section 30 and Rule 23 of the CGST Rules, an application for revocation must be submitted within 30 days from the date of service of the cancellation order. The period may be extended by an authorized Additional or Joint Commissioner by up to 60 additional days (total 90 days) upon sufficient cause being shown."
  - q: "Can Form GST REG-21 be filed while regular GST returns remain unfiled?"
    a: "No. The GST Common Portal electronically blocks the submission of Form GST REG-21 until all pending returns (GSTR-1 and GSTR-3B) up to the effective date of cancellation are filed, and all outstanding tax, interest, and late fees are paid in full."
  - q: "What is Form GSTR-10 and what happens if a business forgets to file it?"
    a: "Form GSTR-10 is the mandatory Final Return filed within three months of the cancellation date under Section 45. If unfiled, the department issues Form GSTR-3A (Notice to Return Defaulter). Continued default attracts late fees of ₹50 per day (₹20 for nil returns) capped at ₹10,000 under Section 47."
  - q: "Can a business issue tax invoices while its GSTIN status is 'Suspended'?"
    a: "No. Under Rule 21A of the CGST Rules, once a GSTIN is suspended—either automatically upon filing REG-16 or initiated by the officer—the taxpayer cannot make any taxable supply, cannot issue a tax invoice, cannot charge GST, and cannot claim input tax credit."
references:
  - title: "Central Goods and Services Tax Act, 2017 - Sections 29, 30 & 45"
    url: "https://cbic-gst.gov.in/"
    publisher: "Central Board of Indirect Taxes and Customs (CBIC), Government of India"
  - title: "CGST Rules, 2017 - Rules 20, 21, 21A, 22 & 23 (Cancellation & Revocation)"
    url: "https://www.cbic.gov.in/"
    publisher: "CBIC, Department of Revenue, Ministry of Finance"
  - title: "GST Portal User Manual - Application for Cancellation & Revocation"
    url: "https://www.cbic.gov.in/entities/cbic-content-gst"
    publisher: "Goods and Services Tax Network (GSTN)"
versionHistory:
  - date: "September 2026"
    change: "Comprehensive Phase 2 rewrite: bespoke statutory analysis, Section 29(5) ITC reversal calculations, amended Rule 23 30-to-90 day revocation timelines, and GSTR-10 requirements."
status: "published"
---

# GST Cancellation and Revocation Guide: Voluntary Surrender (REG-16) vs Restoration (REG-21)

Managing a Goods and Services Tax Identification Number (GSTIN) requires constant compliance. When a business entity ceases operations, restructures its corporate form, or falls permanently below statutory revenue thresholds, leaving a GSTIN dormant without formal deregistration is dangerous. Inactive registrations accumulate daily late filing fees, trigger automated risk notices, and can lead to personal banking freezes for directors and partners.

Conversely, thousands of active businesses discover each month that their GSTIN has been abruptly cancelled **suo-motu** by tax authorities due to non-filing of returns or portal discrepancies.

Under the **Central Goods and Services Tax (CGST) Act, 2017**, terminating a GST registration and restoring an improperly cancelled one follow entirely different statutory tracks. This guide provides a definitive procedural manual covering voluntary surrender (**Form GST REG-16**), stock Input Tax Credit reversals under **Section 29(5)**, mandatory final returns (**Form GSTR-10**), and revocation applications (**Form GST REG-21**).

---

## The Legal Architecture of GST Cancellation (Section 29)

GST registration termination is codified under **Section 29 of the CGST Act**:

### THE TWO PATHWAYS OF GST CANCELLATION

| **1. Voluntary Cancellation** | **2. Suo-Motu Cancellation** |
| --- | --- |
| (Initiated by Taxpayer) | (Initiated by Proper Officer) |
| Applied via Form GST REG-16 | SCN issued in Form GST REG-17 |
| Business discontinued/closed | Default in filing for 6+ months |
| Change in legal constitution | Registration obtained by fraud |
| Turnover fell below threshold | Physical verification failure |
| Order issued in GST REG-19 | Order issued in GST REG-19 |


---

## Voluntary Cancellation by the Taxpayer (Form GST REG-16)

Under **Section 29(1)** and **Rule 20 of the CGST Rules**, a registered person may apply for cancellation electronically on the GST Portal using **Form GST REG-16** within **30 days** of the occurrence of the triggering event.

### Valid Statutory Grounds for Voluntary Surrender:
1. **Discontinuance or Closure of Business**: Complete cessation of commercial or professional operations.
2. **Transfer of Business**: Sale of the ongoing business, amalgamation, demerger, or transfer to a new entity.
3. **Change in Legal Constitution**: E.g., converting a Sole Proprietorship into a Private Limited Company or Partnership into an LLP. The old GSTIN must be cancelled and a fresh GSTIN obtained under the new PAN.
4. **Turnover Below Exemption Threshold**: A taxpayer who registered voluntarily but whose aggregate annual turnover remains well below ₹20 Lakhs (services) or ₹40 Lakhs (goods) and who no longer wishes to incur monthly compliance overheads.

---

## Suo-Motu Cancellation by the Tax Authority

Under **Section 29(2)**, the Proper Officer possesses unilateral statutory authority to cancel a registration from such date, including any retrospective date, as they deem fit, under five specific triggers:
* **Continuous Return Default**: A regular taxpayer fails to furnish monthly returns for a continuous period of **six months** (or two consecutive tax periods for QRMP filers).
* **Composition Scheme Default**: A composition dealer fails to furnish returns for three consecutive tax periods.
* **Non-Commencement of Business**: A person who took voluntary registration fails to commence commercial operations within **six months** from the date of registration.
* **Fraud or Misstatement**: The registration was obtained through fraudulent documentation, willful misstatement, or suppression of facts.
* **Anti-Evasion Rule Violations**: Issuing invoices without supply of goods/services (circular trading under Rule 21) or violating Rule 86B cash payment limits.

---

## Registration Suspension Under Rule 21A

When an application for voluntary cancellation is submitted, or when the Proper Officer initiates suo-motu cancellation proceedings, the GSTIN enters **"Suspended"** status under **Rule 21A**:

* **Prohibition on Invoicing**: The taxpayer is legally barred from issuing a tax invoice and cannot charge or collect any GST from clients during suspension.
* **Freeze on Input Tax Credit**: The taxpayer cannot claim ITC on inward supplies received during the suspension period.
* **Return Filing Freeze**: The portal suspends regular return filing obligations until the cancellation or revocation order is formally decided.

---

## Stock Valuation and ITC Reversal Under Section 29(5)

One of the most critical statutory conditions of GST cancellation is the **mandatory reversal of Input Tax Credit** on closing stock.

Under **Section 29(5)**, every registered person whose registration is cancelled must pay an amount equal to:
1. The **Input Tax Credit** availed on closing stock of inputs, semi-finished goods, finished goods, and capital goods / plant and machinery; **OR**
2. The **Output Tax payable** on such goods, **whichever is higher**.

1. **Determine Closing Stock on Date of Cancellation**
2. **Calculate Tax Reversal**
3. **Compare Against Output Tax on Open Market Value**

Failure to accurately calculate and discharge this tax liability results in recovery proceedings under Section 73 or Section 74, along with 18% annual interest under Section 50.

---

## The Mandatory Final Return: Form GSTR-10

Under **Section 45 of the CGST Act** read with **Rule 81**, every person whose registration is cancelled must furnish a **Final Return** in **Form GSTR-10**:

* **Filing Window**: Must be submitted electronically within **three months** of the date of cancellation or date of the cancellation order, whichever is later.
* **Scope**: GSTR-10 is not a regular return; it is a closing audit return disclosing closing stock valuations, tax paid on inputs/capital goods, and confirmation of zero tax liability.
* **Penalty for Default**: If GSTR-10 is not furnished within the statutory deadline, the GST portal issues **Form GSTR-3A**. Continued non-filing attracts a late fee under **Section 47** of ₹50 per day (subject to a maximum cap of ₹10,000).

---

## Revocation of Suo-Motu Cancellation (Form GST REG-21)

If the tax department cancelled a GSTIN suo-motu (for instance, due to six months of unfiled returns during an operational lull), the business cannot resume operations under a new GSTIN with the same PAN without clearing the existing default. Instead, the taxpayer must seek **Revocation of Cancellation** under **Section 30**.

```
[Proper Officer Issues Cancellation Order (Form GST REG-19)]
        │
        ▼
[Taxpayer Clears Pending Returns & Discharges All Tax, Interest & Late Fees]
        │
        ▼  (Within 30 Calendar Days of Order)
[File Application for Revocation in Form GST REG-21]
        │
        ▼
[Proper Officer Reviews Application]
   ├─── Satisfied ──> Passes Revocation Order in Form GST REG-22 (GSTIN Restored)
   └─── Query / Doubt ──> Issues SCN in Form GST REG-23 (Must reply in REG-24 in 7 days)
```

> [!IMPORTANT]
> **Revocation vs Fresh Application**: You cannot apply for revocation if you voluntarily cancelled your GSTIN via REG-16. Revocation is strictly a remedy against departmental suo-motu cancellations.

---

## Timelines, Extended Windows & Officer Adjudication

Under **Rule 23 of the CGST Rules**, as amended:
1. **Standard Window**: Form GST REG-21 must be filed within **30 days** from the date of service of the cancellation order.
2. **First Extension**: An Additional Commissioner or Joint Commissioner can extend the deadline by a further period not exceeding **30 days** upon written request showing reasonable cause.
3. **Second Extension**: The Commissioner can grant an additional extension of up to **30 days** beyond the first extension, creating an aggregate maximum window of **90 days**.

Once Form GST REG-21 is submitted, the Proper Officer must either revoke the cancellation (Form GST REG-22) or issue a Show Cause Notice (Form GST REG-23) within **30 days** of receiving the application.

---

## Frequently Asked Questions

### Can a taxpayer apply for revocation if they voluntarily cancelled their GST registration?
No. Under Section 30 of the CGST Act, the revocation route (Form GST REG-21) is legally available only when a registration has been cancelled suo-motu by the Proper Officer. If a taxpayer voluntarily surrenders their registration via Form GST REG-16, they cannot revoke it; they must apply for a fresh registration under Form GST REG-01 if they wish to resume operations.

### What is the time limit for filing Form GST REG-21 for revocation?
Under the amended Section 30 and Rule 23 of the CGST Rules, an application for revocation must be submitted within 30 days from the date of service of the cancellation order. The period may be extended by an authorized Additional or Joint Commissioner by up to 60 additional days (total 90 days) upon sufficient cause being shown.

### Can Form GST REG-21 be filed while regular GST returns remain unfiled?
No. The GST Common Portal electronically blocks the submission of Form GST REG-21 until all pending returns (GSTR-1 and GSTR-3B) up to the effective date of cancellation are filed, and all outstanding tax, interest, and late fees are paid in full.

### What is Form GSTR-10 and what happens if a business forgets to file it?
Form GSTR-10 is the mandatory Final Return filed within three months of the cancellation date under Section 45. If unfiled, the department issues Form GSTR-3A (Notice to Return Defaulter). Continued default attracts late fees of ₹50 per day (₹20 for nil returns) capped at ₹10,000 under Section 47.

### Can a business issue tax invoices while its GSTIN status is 'Suspended'?
No. Under Rule 21A of the CGST Rules, once a GSTIN is suspended—either automatically upon filing REG-16 or initiated by the officer—the taxpayer cannot make any taxable supply, cannot issue a tax invoice, cannot charge GST, and cannot claim input tax credit.

---

## Official References

- [Central Goods and Services Tax Act, 2017 - Sections 29, 30 & 45](https://cbic-gst.gov.in/) — Central Board of Indirect Taxes and Customs (CBIC), Government of India
- [CGST Rules, 2017 - Rules 20, 21, 21A, 22 & 23 (Cancellation & Revocation)](https://www.cbic.gov.in/) — CBIC, Department of Revenue, Ministry of Finance
- [GST Portal User Manual - Application for Cancellation & Revocation](https://www.gst.gov.in/) — Goods and Services Tax Network (GSTN)
