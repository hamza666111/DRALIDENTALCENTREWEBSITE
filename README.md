# Dr Ali Dental Centre — redesigned website

React 19, TypeScript, Vite 8 and Tailwind 4. The existing content/config, original local assets, URLs, WhatsApp integration and chat interface have been retained. The site now pre-renders its public page content and metadata at build time, then hydrates interactive controls in the browser. No Node server is needed in production.

## Run

Use Node 22.12+ or Node 24 and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

`npm run build` produces `dist/`, including an HTML document for every configured route, sitemap/robots, and `404.html`. Rebuild whenever content or environment settings change. Development includes draft articles; production does not publish them until their existing review status is changed.

## Pages

Home, Services (all 11 original treatments), reusable treatment details, Our Work, Reviews, Team, About, International Clients, Videos, Blog/article template, Contact, and existing Privacy/Accessibility pages. Navigation places International Clients then Videos immediately after About.

Responsive layout uses the approved teal/white editorial visual system, compact mobile cards, a mobile menu and Call / WhatsApp / Book bar with safe-area spacing. Empty cases, reviews, videos and articles have honest empty states. No fictional patient reviews, outcomes or videos have been added.

## Editing existing content

`src/config/site.ts` remains the source for clinic details, all treatment copy and fees, team biographies/qualifications/photos, reviews, consented cases, articles and integrations. Existing content is retained. `src/config/servicesPage.ts` holds listing FAQs. Existing article bodies and draft status are preserved. Use actual verified content, not the generated design image's wording or images.

Case records now optionally support `timeline`, `context`, and `followUp`. Only `consentConfirmed:true` cases display. Review sources/ratings display only when configured. No self-serving review-star structured data is generated.

## Booking and international enquiries

Copy `.env.example` to `.env.local` if configuration is needed. Do not place private keys in VITE variables: these are public client configuration.

- `VITE_APPOINTMENT_ENDPOINT`: optional existing JSON POST endpoint. Payload: `{name,phone,email,date,time,treatment,consent}`. Date is optional. Without an endpoint, the form prepares a WhatsApp link and explicitly asks the visitor to press Send. Nothing is reported as received before actual API success.
- `VITE_INTERNATIONAL_ENDPOINT`: optional separate JSON POST endpoint. Payload: `{name,email,phone,country,timezone,treatment,time,consent,mode}`; visit mode additionally includes `{arrival,departure,flexible}`. `mode` is `online` or `visit`. Without an endpoint, the same honest WhatsApp handoff is used, including all relevant enquiry fields.
- Endpoints must return 2xx only when an enquiry is actually accepted. Server-side validation, rate limits, storage, notifications, and CORS belong to your backend; no new backend is included.
- Initial consultation requests and proposed visit dates do not confirm an appointment or guarantee suitability/treatment duration.
- The existing chat remains in its existing labelled preview mode. Configure `src/config/chat.ts` and the actual backend separately for live AI replies.

## Publishing videos

Add real entries to `src/config/videos.ts`. The empty array is intentional: no video files were supplied.

Each published record needs a unique lowercase hyphenated `slug`, title, summary, category, thumbnail/alt, `published:true`, and a playable local/HTTPS `src` or supported YouTube/Vimeo `embedUrl`. Hosted embeds must use YouTube `/embed/` or Vimeo `player.vimeo.com/video/` URLs. Unpublished or invalid entries are not shown.

Optional fields: ISO 8601 `duration` (e.g. PT2M15S), truthful `uploadDate` with time zone, plain-text `transcript`, WebVTT `captions`, `reviewer`, `reviewedOn`, and `relatedServices` (treatment slugs). Host caption files with appropriate CORS if external. Uploaded media must have rights and consent where required.

Videos get `/videos/[slug]/` watch pages with poster-first playback, transcript and related treatment links. VideoObject is emitted only with a real upload timestamp and playable published content. The Videos listing stays noindex/out of sitemap until at least one real video is published. No autoplay or invented view counts/durations.

## SEO and launch settings

Set `VITE_SITE_URL` to your verified public origin, such as `https://your-real-domain.tld`, then rebuild. Until configured, pages stay noindex, robots disallows crawling, sitemap is empty, and no placeholder canonicals or organization JSON-LD are emitted.

Clinical treatment pages remain available for review but stay noindex/out of sitemap until their existing `confirmed`, `review.reviewer`, and `review.date` fields are completed. All 11 were unreviewed in the supplied archive. Original medical copy is retained, not independently clinically verified. Have a qualified clinician check the existing claims, intervals, suitability, aftercare and absolute guarantees before marking approved.

Fixes include correct absolute image URLs, explicit canonical host, canonical treatment aliases, no invented prices/currencies/author dates, accurate per-route metadata, build-time HTML, and an actual 404 document. No ranking or AI-citation guarantees.

`public/robots.txt` and `public/sitemap.xml` are preview defaults. The build always generates authoritative versions in `dist/`. Do not deploy `public/` by itself.

## Hosting

Deploy `dist/` as static files. Serve directory `index.html` files and return `404.html` with HTTP 404 for unknown paths. Avoid an unconditional SPA rewrite to the homepage—it defeats per-route HTML and real 404 responses. An example nginx snippet is included under `deployment/`. For any other host, configure equivalent static routing and 404 status. No production deployment has been performed here.

## Remaining owner tasks

- Set the real domain and verify clinic/contact details.
- Approve existing clinical and legal copy; credentials and biographies are preserved as supplied.
- Replace the existing explicitly illustrative Unsplash clinic images with actual clinic photographs when available.
- Add genuine reviews/consented cases, publish reviewed articles and add actual videos as ready.
- Confirm WhatsApp-only operation or connect real request endpoints; connect live chat separately if desired.
- Test external Google Maps/WhatsApp destinations and real backend delivery on your own deployment.

Historical `DADC-Technical-Audit.md` and `HOMEPAGE-REDESIGN.md` are retained for context; this README and `REDESIGN-NOTES.md` describe the delivered version.
