# Frames by Andrej — Next.js + Sanity CMS

The primary website is in Macedonian, with an English version under `/en`. See [SEO.md](SEO.md) for the SEO implementation and owner setup steps. Add translations in the optional Macedonian fields in Sanity; original fields supply English content. Keep category IDs stable when editing names.

Films, commercial projects and client inquiries are documented in [PORTFOLIO.md](PORTFOLIO.md), including Studio setup, service selection, video hosting, tests and delivery checks.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows, copy `.env.example` to `.env.local` manually. Visit http://localhost:3000.

## Connect your free Sanity project

1. Create a project at https://www.sanity.io/manage and create a dataset (usually `production`).
2. Put the values in `.env.local`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
```

3. Restart `npm run dev` and open **http://localhost:3000/studio**. Sign in with the account that owns the Sanity project.
4. Create **Homepage hero slide**, **Collection**, **Portfolio photograph**, and **Website settings** documents, then **Publish** each one.
5. In Sanity Manage → API → CORS origins, add `http://localhost:3000` (with credentials enabled) and your production domain (with credentials enabled) so Studio can connect. If your dataset is private, public website reads will need a server-side read token; the included integration expects a **public dataset**.
6. On deployment, add the same `NEXT_PUBLIC_SANITY_*` environment variables to your host and redeploy.

The website shows sample photography until you publish content for each section. Sanity content replaces the corresponding sample section when available. Each page request reads published content directly from Sanity; refresh the website after publishing changes. Sanity's free plan has usage limits.

## Content editing

- **Category**: create a name, generate its Category ID once, set its order, and publish. Category names and filter order update on the website after refresh; keep the Category ID unchanged when renaming. Select categories in collections and portfolio photographs. Existing selections keep working. To make old selections editable category documents, open any existing photograph or collection and click **Create and publish existing categories** below its Category field.
- **Homepage hero slide**: headline, italic line, caption, image, order.
- **Collection**: title, subtitle, category, image, order.
- **Portfolio photograph**: title, image, category, order, alt description. Every published photo appears at `/gallery`. Enable **Featured** to include it in the homepage preview; all featured photos appear according to Order, with no limit and the same masonry layout as the full gallery. The full gallery has category filters, an uncropped masonry layout, a lightbox, and Load More in batches of 24. Collection cards link to `/gallery?category=category-id`.
- **Website settings**: About photo/text, Instagram and Facebook links, optional TikTok URL, contact email. TikTok links appear only when its URL is filled in and published.

## Before publishing

- The contact forms send validated inquiries through `/api/inquiry` to Formspree (`https://formspree.io/f/mzeegbel`). Configure and verify the recipient email in the Formspree dashboard. The contact email in Sanity does not control form delivery.
- Set your Instagram and Facebook URLs in Website settings.
- The supplied original logo lives in `public/branding/`.
- The site uses sample Unsplash images where Sanity documents have not been published.
- Verify your host's commercial-use terms before deploying a business site.

## Commands

`npm run dev` — local site and `/studio` dashboard

`npm run build` — production build

`npm run lint` — TypeScript check
