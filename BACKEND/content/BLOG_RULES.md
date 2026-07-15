# FilingBy Blog Rules

This file is the editorial and technical rulebook for every blog inside `BACKEND/content/blogs/`.

## Purpose

Use these rules to keep every article publishable, SEO-safe, readable, and consistent with FilingBy's blog design and compliance positioning.

## Folder and file structure

- Store every article as one Markdown file inside `BACKEND/content/blogs/`.
- Use lowercase kebab-case file names only.
- Match the file name to the slug wherever possible.
- Do not create duplicate topic files for the same search intent.
- Keep helper docs in `BACKEND/content/`, not inside the `blogs` folder.

## Slug and naming rules

- Good: `virtual-office-for-gst-registration-guide.md`
- Good: `trademark-objection-reply-guide.md`
- Avoid vague names like `blog1.md`, `new-article.md`, `draft-final.md`
- Avoid date-heavy slugs unless the year is the actual search intent.

## Mandatory frontmatter

Every file must include valid YAML frontmatter with these fields:

```yaml
title:
slug:
excerpt:
seoTitle:
seoDescription:
focusKeyword:
secondaryKeywords:
category:
author:
authorId:
reviewedBy:
reviewerId:
readingTime:
lastUpdated:
featuredImage:
featuredImageWidth:
featuredImageHeight:
imageAlt:
imageGallery:
tableOfContents:
keyTakeaways:
faq:
relatedServices:
relatedBlogs:
relatedCalculators:
relatedTemplates:
internalLinks:
topicHub:
references:
sources:
versionHistory:
cta:
isPublished:
status:
```

## Approved profile IDs

- `authorId`: `filingby-editorial-desk`
- `reviewerId`: `filingby-content-team`

Do not invent new IDs unless the frontend profile map and schema support are updated together.

## Content quality rules

- Minimum target length: `2,500` words for production guides.
- Prefer one clear search intent per article.
- Write for Indian founders, MSMEs, consultants, sellers, and operators.
- Use natural Indian English.
- Explain practical consequences, not only legal definitions.
- Keep paragraphs readable. Break long sections into smaller chunks.
- Add real decision support: steps, comparisons, common mistakes, timelines, checklists.
- Avoid filler intros and repeated generic compliance paragraphs.
- Avoid copying boilerplate paragraphs across multiple articles.

## Required article structure

Every article should include:

1. Introduction
2. Key takeaways
3. Clear H2 sections
4. H3 subsections where useful
5. Tables for comparisons or document lists
6. Government or portal process explanation
7. Common mistakes
8. Pro tips
9. FAQs
10. Internal links
11. Related services
12. References or sources
13. CTA
14. Conclusion

## Markdown formatting rules

- Use proper headings: `##` for main sections, `###` for subsections.
- Use bullets for lists that users will scan.
- Use Markdown tables for comparisons.
- Use blockquotes for important notes and warnings.
- Do not paste raw code blocks unless the content genuinely needs them.
- Do not expose internal draft notes, generator prompts, or placeholder markers.
- Do not use HTML unless Markdown cannot achieve the structure.

## SEO rules

- One primary keyword per article.
- Secondary keywords must support the same search intent.
- Do not create near-duplicate articles for the same keyword cluster.
- Keep `seoTitle` compelling but clear.
- Keep `seoDescription` useful and specific.
- Use internal links naturally, not mechanically.
- Link only to real pages, service routes, calculators, templates, hubs, or valid blog slugs.

## Compliance and trust rules

- High-stakes categories must include authoritative references or sources.
- Prefer government, regulator, or statute-linked references where possible.
- Mention practical limitations where rules vary by state, activity, turnover, or document quality.
- Never claim guaranteed approval or guaranteed timelines.
- If a threshold or rule may change, word it carefully and use update dates.

## Image rules

- Every featured image must include width and height.
- Every gallery item must include `url`, `alt`, `caption`, `width`, and `height`.
- Use helpful alt text, not keyword stuffing.
- Suggested default dimensions:
  - Featured image: `1200 x 675`
  - Gallery image: `1200 x 900`

## Internal linking rules

- Add `5-10` truly relevant internal links where possible.
- Mix blog links, service links, calculators, templates, and one topic hub where relevant.
- Do not repeat the same anchor text excessively.

## Update and maintenance rules

- Update `lastUpdated` whenever legal process, threshold, portal flow, or due date logic changes.
- Add a short `versionHistory` entry for meaningful edits.
- Review high-stakes articles periodically against regulator guidance.
- Check for cannibalisation before creating a new article.

## Safe workflow

1. Create or edit the Markdown file.
2. Run `npm run blogs:audit` inside `BACKEND`.
3. Fix frontmatter, links, repeated headings, or source gaps.
4. Run `npm run blogs:seed` inside `BACKEND` when content is ready for database sync.
5. Rebuild the frontend if blog presentation or routes changed.

## Commands

```bash
cd BACKEND
npm run blogs:audit
npm run blogs:seed
npm run blogs:generate
```

## Do not do

- Do not create duplicate intent articles unless one old article is being replaced.
- Do not leave missing image dimensions.
- Do not leave `reviewedBy` without a matching `reviewerId`.
- Do not publish with broken internal links.
- Do not publish articles that still contain placeholders, prompts, or raw generator artefacts.
