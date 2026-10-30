# SEO handoff — Frames by Andrej

Primary audience: Macedonian speakers looking for photography in Kumanovo, Skopje, Kratovo, Kriva Palanka and Tetovo, with service across North Macedonia.

## Implemented

- Macedonian homepage and gallery at `/` and `/gallery`; English equivalents at `/en` and `/en/gallery`.
- Localized page titles and descriptions, language switches, HTML language tags, reciprocal `mk-MK` / `en-MK` / `x-default` alternates and canonical URLs on the production domain.
- Crawlable category routes (`/gallery/nature`, for example), redirects from previous category query URLs, category introductions and unique metadata. Unknown categories return 404.
- Crawlable gallery pagination with self-canonical page URLs, alongside the existing Load More interaction. All featured photos still appear on the homepage with no limit.
- `/sitemap.xml` includes both languages, category pages, gallery pagination, image URLs and content modification dates from Sanity. `/robots.txt` points to it.
- Studio and preview deployments are excluded from indexing. No address, price, review or rating was invented.
- Organization, WebSite, WebPage, BreadcrumbList and ImageGallery JSON-LD. Service areas reflect the owner's confirmed cities. Organization markup is not a claim of Google LocalBusiness rich-result eligibility.
- Open Graph / Twitter sharing metadata and a 1200 × 630 branded fallback image.
- One visible H1 on the homepage, real hero/collection image elements, responsive Sanity image sources, image dimensions where available, lazy-loaded gallery images and existing alt descriptions.

## Owner actions, in order

1. **Review Macedonian copy and publish translations.** Refresh production Studio after deployment. In Website settings add the Macedonian biography and public contact details. In hero slides use the new Macedonian text fields. In photos, collections and categories add Macedonian names and image descriptions. Standard original template text is translated automatically; custom text is retained until you provide a Macedonian version. The original fields supply the English pages. Keep category IDs unchanged.
2. **Write category introductions.** Fill in Category introduction (Macedonian) and the English equivalent. Describe the actual work in that collection. Avoid lists of cities or repetitive keywords; use genuine locations and context in photo descriptions.
3. **Verify Google Search Console.** Add `https://frames.andrejjovanovski.dev/` as a URL-prefix property, or verify the parent domain by DNS if you control it. For HTML-tag verification, put only the tag's `content` value in Vercel's `GOOGLE_SITE_VERIFICATION` variable for Production and redeploy, then click Verify. No verification secret was generated or account action taken by this implementation.
4. **Submit the sitemap.** In Search Console → Sitemaps submit `https://frames.andrejjovanovski.dev/sitemap.xml`. Use URL Inspection on the homepage, gallery and key category pages to test the live URL and request indexing. Indexing and rankings are determined by Google.
5. **Create or update one eligible Google Business Profile.** Use the real business name and the most accurate photography category. Add your real telephone, website and realistic service areas. If customers do not visit your address, use a service-area profile and hide the address. Do not create separate profiles just to target the five cities. Google's service-area guidance should determine the profile boundaries; a country-wide website service offering is not permission to list an unlimited GBP service area.
6. **Add trust signals.** Use consistent business information on Facebook, Instagram and your Google profile. Ask actual clients for honest reviews. Add detailed real projects and photographs over time, with client permission where applicable. Seek relevant mentions from venues, collaborators or local publications you actually work with.
7. **Measure after deployment.** Run PageSpeed Insights on the homepage and gallery on mobile. In Search Console review indexing, image-search traffic, Core Web Vitals, and queries such as `фотограф Куманово`, `фотограф Скопје`, and the specific services you offer. Review impressions, clicks and inquiries monthly; expand content according to actual demand. Analytics was not installed because no account or measurement ID was provided.

## Content practices

- Give images concise, descriptive names before uploading; describe the actual scene in alt text. Never claim a photo was taken in a city just to target that city.
- Use the Order and Featured fields to curate the homepage. Many large images can slow the page even with responsive sources and lazy loading.
- If you later add service-specific or project pages, write original useful information and examples. Avoid near-identical pages made only by swapping city names.
- Keep public contact details current. A physical address should only be added to business markup after it is confirmed and appropriate to publish.

## Official references

- [Google multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google image SEO](https://developers.google.com/search/docs/appearance/google-images)
- [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google service-area profiles](https://support.google.com/business/answer/9157481)
- [Google business representation guidelines](https://support.google.com/business/answer/3038177)
