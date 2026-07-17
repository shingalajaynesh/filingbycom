# FilingBy SEO and Clarity Audit

Date: July 17, 2026
Source range: Google Search Console export for the last 3 months and Microsoft Clarity snapshot for the last 3 days

## Executive Summary

FilingBy generated 121 clicks from 9,859 impressions over the last 3 months, for an overall CTR of about 1.23%.

The main SEO opportunity is not ranking discovery. Several pages already rank on page 1 or near page 1, but they are under-clicked:

- `/pages/trust-compliance` at 2,797 impressions, 0.61% CTR, average position 6.68
- `/pages/csr-audit` at 2,019 impressions, 0.45% CTR, average position 10.02
- `/pages/trust-audit` at 1,795 impressions, 0.84% CTR, average position 7.36
- `/pages/moa-amendment-public-private-limited` at 1,011 impressions, 0.2% CTR, average position 7.09

The Clarity snapshot shows low traffic volume but also suggests weak page-to-conversion alignment:

- 24 sessions in the last 3 days
- 37.5% dead clicks
- 29.17% quick backs
- 58.09% average scroll depth
- 1.3 minutes active time

This combination usually means users are finding the site, landing, then either not seeing the answer fast enough or not trusting the page enough to continue.

## What The Data Says

### Highest-opportunity pages

1. Trust compliance
   - 17 clicks
   - 2,797 impressions
   - 0.61% CTR
   - Position 6.68
2. CSR audit
   - 9 clicks
   - 2,019 impressions
   - 0.45% CTR
   - Position 10.02
3. Trust audit
   - 15 clicks
   - 1,795 impressions
   - 0.84% CTR
   - Position 7.36
4. MOA amendment
   - 2 clicks
   - 1,011 impressions
   - 0.2% CTR
   - Position 7.09
5. LLP compliance
   - 1 click
   - 404 impressions
   - 0.25% CTR
   - Position 8.22

These are the pages where small CTR lifts would have the clearest payoff because the rankings are already viable.

### Highest-opportunity queries

- `trust audit`: 172 impressions, 2.91% CTR, position 9.05
- `csr audit`: 160 impressions, 1.25% CTR, position 14.33
- `moa amendment`: 71 impressions, 0% CTR, position 7.31
- `trust compliance checklist`: 47 impressions, 0% CTR, position 10.89
- `audit of trust is compulsory or voluntary`: 45 impressions, 0% CTR, position 9.38
- `tancard`: 37 impressions, 0% CTR, position 9.14
- `apeda registration`: 32 impressions, 0% CTR, position 28.84
- `can moa be amended`: 28 impressions, 0% CTR, position 6.64
- `audit of trust`: 25 impressions, 0% CTR, position 7.24
- `llp compliance`: 22 impressions, 0% CTR, position 10.18

Pattern:

- Trust and compliance intent is working best.
- CTR is still weak even where rankings are decent.
- Searchers appear to be looking for practical answers, checklists, applicability, due dates, and process clarity.

### Country and device split

- India: 120 clicks, 5,490 impressions, 2.19% CTR
- United States: 0 clicks, 3,099 impressions, 0% CTR
- Desktop: 73 clicks, 7,636 impressions, 0.96% CTR
- Mobile: 48 clicks, 2,204 impressions, 2.18% CTR

Implication:

- India is the real commercial market and should stay the content priority.
- Desktop underperforms mobile materially on CTR, which often points to weak SERP snippet competitiveness on research-heavy queries.

### Search appearance

- Product snippets: 14 clicks, 3,000 impressions, 0.47% CTR, position 8.77
- Review snippet: 0 clicks, 74 impressions, 0% CTR, position 32.68

Implication:

- Structured data is being picked up, but not yet winning enough clicks.
- Rich result eligibility alone is not enough; title and description alignment still need work.

## Clarity Readout

From the screenshot dated July 17, 2026:

- 24 sessions over the last 3 days
- 8 unique users
- 37.5% dead clicks
- 29.17% quick backs
- Top pages include `/`, `/blog`, `/virtual-space`, `/login`, and even `http://localhost/`
- Referrers include `www.filingby.com`, `www.upwork.com`, `accounts.google.com`, `tagassistant.google.com`, and `vercel.com`

Interpretation:

- The sample is small, so this is directional rather than definitive.
- There is likely internal, testing, or operational traffic mixed into the snapshot.
- Dead clicks and quick backs suggest visitors do not always find the next obvious step.
- The homepage and service pages need stronger first-screen clarity and cleaner CTA paths.

## Codebase Findings

### 1. PAN intent is being redirected to TAN

Found in:

- `FRONTEND/vercel.json`
- `FRONTEND/src/routes/AppRoutes.jsx`

Current mapping:

- `/pages/pan-card` -> `/services/tan-registration`

This is an intent mismatch. PAN and TAN are different user needs. Even if the page ranks, users searching for PAN are likely to bounce when they land on a TAN page.

### 2. Multiple legacy pages are consolidated onto broader service pages

Examples:

- `/pages/trust-compliance` -> `/services/trust-registration`
- `/pages/trust-audit` -> `/services/trust-registration`
- `/pages/csr-audit` -> `/services/csr-registration`

This is not automatically wrong, but it means the destination page has to satisfy the exact legacy intent. If the page reads more like a registration page than a trust audit or CSR audit page, CTR and on-page engagement will suffer.

### 3. SEO overrides already exist for key services

Found in:

- `FRONTEND/src/features/ca-portal/pages/ServicePage.jsx`
- `BACKEND/scripts/applyJuly2026SeoActions.js`
- `BACKEND/scripts/optimizeSearchConsoleServices.js`
- `BACKEND/scripts/optimizeHighVolumeQueries.js`

This is good. The site already has a workflow for tightening search intent. The remaining gap is likely:

- deployment freshness
- page copy depth
- heading structure
- CTA placement
- mismatched redirects such as PAN -> TAN

## Priority Actions

### Highest priority

1. Fix the PAN redirect strategy.
   - Do not send `/pages/pan-card` traffic to the TAN page.
   - Best option: create a PAN-focused destination.
   - If a PAN destination does not exist yet, avoid treating this as solved by TAN copy alone.

2. Tighten the first screen on the trust and CSR service pages.
   - Put the exact query language in the H1 and intro.
   - Add a short answer block above the fold.
   - Show due dates, applicability, process summary, and documents without forcing long scrolling.

3. Improve CTR on the four biggest SEO opportunity pages.
   - Trust compliance
   - Trust audit
   - CSR audit
   - MOA amendment

### Medium priority

4. Reduce mixed intent on consolidated pages.
   - If one page targets both registration and compliance, structure sections clearly so Google and users both understand the primary answer.

5. Clean Clarity data quality.
   - Filter internal/admin/test traffic where possible.
   - Exclude localhost and implementation traffic from interpretation.

6. Improve next-step clarity on service pages.
   - Add one primary CTA near the top.
   - Add a secondary trust-building CTA such as "Talk to a CA" or "Get document checklist".

### Lower priority

7. Push APEDA and LLP pages with deeper content blocks rather than only metadata changes.
   - APEDA is still ranking too low for snippet optimization alone.
   - LLP has enough relevance to merit richer deadline and penalty content.

## Suggested SEO Copy Direction

For the trust page:

- Emphasize `trust compliance`, `trust audit`, `trust compliance checklist`, `ITR-7`, and `12A/80G`.
- Add a visible checklist section near the top.
- Add a direct answer for whether trust audit is compulsory or voluntary.

For the CSR page:

- Lead with `CSR audit meaning`, `CSR audit report`, `CSR checklist`, and `CSR-1 context`.
- Add a practical "who needs this review" section.

For the MOA page:

- Lead with `can MOA be amended`, `object clause amendment`, `MGT-14`, and `timeline`.
- Use a process table above the fold.

For the LLP page:

- Put Form 8 and Form 11 due dates high on the page.
- Add penalties and zero-activity LLP guidance clearly.

## Recommendation

The strongest next step is a focused implementation pass on:

1. redirect corrections
2. top-of-page content on the trust, CSR, and MOA service pages
3. CTA and above-the-fold clarity improvements for the same pages

These changes are more likely to move clicks and engagement than broad sitewide edits right now.
