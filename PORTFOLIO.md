# Photography, films, commercial projects and inquiries

## Architecture and changes

The existing application is Next.js 15 App Router / React 19 with a shared CSS design system, Sanity Studio at `/studio`, Macedonian at the root and English under `/en`. Photography is still managed by the original photo, collection, category, hero and website-settings documents. The original uncropped `PhotoGallery`, responsive image helpers, canonical URLs, language alternates and structured metadata are reused.

The homepage now links to Films and Commercial without repeating complete project galleries. Navigation uses six items: Home, Photography, Films, Commercial, About and Contact. Shared headers and footers keep the pages consistent. No projects, client names, results or testimonials were fabricated, and no existing CMS records were overwritten.

## New routes

| Macedonian | English | Purpose |
|---|---|---|
| `/films` | `/en/films` | Cinematic hero, featured/other films, production photographs and inquiry CTA |
| `/films/[slug]` | `/en/films/[slug]` | Poster, click-to-load player, synopsis, credits, production/technical details, stills, behind the scenes and related films |
| `/commercial` | `/en/commercial` | Commercial photography/video projects, with an honest empty state until published |
| `/commercial/[slug]` | `/en/commercial/[slug]` | Client or personal/spec label, project description, objective, approach, services, deliverables, photographs, optional video/BTS and related projects |
| `/contact?service=…` | `/en/contact?service=…` | Shared inquiry form with validated service preselection |
| `/api/inquiry` | Same endpoint | Validates requests and forwards them to the existing Formspree form |

Existing photography routes and old gallery category redirects remain supported. The new public pages and actual published project URLs are included in the sitemap. All detail pages have localized metadata, canonicals, language alternates, sharing images, breadcrumbs and work descriptions. Unknown project IDs return 404; temporary content-service failures show an unavailable state with noindex metadata.

## Sanity setup and compatibility

Existing category documents with no `portfolioType` remain photography categories. The new **Portfolio section** selector supports Photography, Films and Commercial. Photography queries and dropdowns ignore film/commercial categories. There is no mandatory migration and no new CMS, authentication service or database.

Create categories in Studio by choosing the appropriate Portfolio section, entering English and Macedonian names, generating a stable Category ID and publishing. Optionally, use the existing Sanity CLI sign-in to create the twelve requested starter categories:

```powershell
npx sanity login
npm run setup:portfolio
```

The setup script only creates missing categories. It does not create fake projects or modify existing photos or categories. Starter film categories: Narrative Short Films, Cinematic Reels, Commercial Films, Music Videos, Wedding Films and Behind the Scenes. Starter commercial categories: Product Photography, Brand Photography, Food & Restaurant Photography, Business & Corporate Photography, Promotional Videos and Social Media Campaigns. Names, translations and display order can be edited later in Studio.

## Add a film

1. In Studio choose **Film**, then create an entry.
2. Add a real title, generate its URL ID, choose a published film category and upload a real poster. Add descriptive poster alt text.
3. Add a YouTube or Vimeo link, or an HTTPS `.mp4` / `.webm` URL. A Sanity video-file upload is also supported. For Vimeo unlisted films, keep the complete link including its privacy hash.
4. Fill the short description, synopsis, actual release year/runtime, creator and credits. Add production/equipment notes only where relevant.
5. Add film stills and behind-the-scenes photographs with image descriptions and optional captions. Optional notes can describe lighting, camera setups, storyboards or the filming process.
6. Add Macedonian translations and optional SEO overrides. Enable Featured and set Order to curate the Films listing, then publish.

The film hero uses the first featured poster, or first published poster. Until real film content is published, the page uses an atmospheric graphic treatment and an explicit empty state, with no invented footage.

## Add a commercial project

1. Choose **Commercial project** and add the title, URL ID, published commercial category and cover.
2. Select **Client project**, **Personal Project** or **Spec Work**. Personal Project is the safe default. Only a Client project asks for and displays a real client name; personal/spec projects do not claim a client.
3. Add the overview, creative objective/approach, services and deliverables. Add final photographs, optional video, production photos and notes.
4. Add the publication date, Featured/Order values, translations and optional SEO text; publish.

Covers may use the editor's crop/hotspot. Final photography and BTS galleries display the complete original frames using the existing masonry grid and lightbox.

## Inquiry delivery and service selection

The homepage and contact page use the same `InquiryForm`. Required fields: full name, email, service type and project description. Optional fields: telephone, project date, location and estimated budget. Supported query values are:

```text
portrait
wedding-photo
event
commercial-photo
commercial-video
wedding-video
cinematic-film
other
```

For example, `/contact?service=commercial-video` preselects Commercial Video Production. Unknown or repeated values leave the required service selector blank. Film CTAs choose `cinematic-film`; commercial project CTAs choose `commercial-photo`, or `commercial-video` when the project includes video. Existing homepage service buttons still scroll to the inline form and preselect their service.

The browser sends JSON to `/api/inquiry`. The server independently validates required fields, service IDs, email, real calendar dates, lengths, request size and request origin, and rejects filled honeypots. It forwards validated fields to the existing `https://formspree.io/f/mzeegbel` endpoint. No API key or mail credentials are needed. Visitor input is not logged by this code.

Success is shown only after Formspree responds successfully with `ok: true`. Failures/rate limits retain the visitor's input and allow retry. Pending submissions disable fields and use a synchronous guard against duplicate clicks. This is an inquiry workflow, not an automatically confirmed calendar booking or payment system. Formspree's spam filtering and limits remain in effect; the honeypot is additional filtering, not comprehensive bot protection.

Manual delivery check after deployment: submit one genuine inquiry and confirm it appears in Formspree and the configured email inbox. Confirm the recipient is verified and that any Formspree domain restriction includes `frames.andrejjovanovski.dev`. If enabling a CAPTCHA, first verify the chosen Formspree challenge flow is compatible with a server-forwarded form; no CAPTCHA widget is installed here.

## Video performance and privacy

Posters are Sanity images with existing responsive sources. Neither embedded players nor hosted video sources load before a visitor clicks. YouTube uses `youtube-nocookie.com`; Vimeo uses `dnt=1` and preserves unlisted hashes. Video controls do not autoplay audio. A loading indicator and provider link are available; direct hosted videos use native controls and `preload="none"`. Third-party availability, embedding restrictions and actual playback must be checked with your real videos. Add captions on the hosting platform for spoken material. Do not publish private credentials inside video URLs.

Official provider documentation: [YouTube privacy-enhanced embeds](https://support.google.com/youtube/answer/171780), [Vimeo embed options](https://developer.vimeo.com/player/sdk/embed).

## Files

- New route wrappers: `app/films/**`, `app/commercial/**`, `app/contact/page.tsx`, and their `app/en/**` equivalents; `app/api/inquiry/route.ts`.
- New UI: `components/PortfolioPage.tsx`, `ProjectCards.tsx`, `VideoPlayer.tsx`, `ContactPage.tsx`, `InquiryForm.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`.
- New data/helpers: `lib/portfolio.ts`, `paths.ts`, `video.ts`, `inquiry.ts`, `production-i18n.ts`.
- New Sanity definitions: `sanity/schemaTypes/film.ts`, `commercialProject.ts`, `projectFields.ts`; extended category scope and schema registration.
- Extended existing integration: `app/HomeClient.tsx`, `components/GalleryPage.tsx`, `app/globals.css`, `lib/sanity.ts`, `sanity/CategoryInput.tsx`, `app/sitemap.ts`, `middleware.ts`, `package.json`, `README.md`.
- Setup and tests: `scripts/setup-portfolio.ts`, `tests/portfolio.test.cjs`.

## Verification

Run `npm run lint`, `npm test`, and `npm run build`. Lint remains the existing TypeScript check; there is no separate formatter configured. Tests use Node's built-in runner and the existing TypeScript dependency, adding no test package. They cover video URL handling, service IDs, inquiry validation and forwarding, failure/rate-limit handling, schema compilation, detail-page rendering, related work, honest empty states and project metadata. Fixtures stay in tests and are never published to Sanity.

Implementation QA completed successfully: TypeScript check; seven Node tests; production build; browser checks on all new listing/contact routes in Macedonian and English; responsive widths 320–1920px; empty states; real server rejection of invalid inquiries; query-service validation; field accessibility and mobile keyboard menu handling; duplicate-submit guard; simulated success/server/network failures; no provider requests before video activation; metadata, language alternates, sitemap entries and missing-project 404s. Real projects were tested through isolated fixtures, not published dummy documents. Real email inbox delivery and playback of the owner's future video URLs remain owner checks.

## Remaining owner steps

- Deploy the updated repository and refresh Studio. No new Vercel variables or credentials are required.
- Create the category definitions manually or run the optional starter command after signing in.
- Publish real films/commercial projects and Macedonian translations. Existing custom English text is retained as fallback until translated.
- Check actual YouTube/Vimeo embed permissions (including your production domain), captions and poster quality. Verify direct-file size and playback on mobile if using Sanity-hosted video.
- Send a real inquiry from the deployed site and confirm inbox delivery. Automated checks use intercepted/mock responses and do not send test emails.
