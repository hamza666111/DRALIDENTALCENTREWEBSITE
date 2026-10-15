# Homepage redesign

The desktop and mobile references guide presentation only. Existing clinic data in `src/config/site.ts` remains authoritative. Other page bodies and the shared `BookingBand` used by inner pages are unchanged.

## What changed

- Homepage layout and scoped styles: `src/pages/Home.tsx` and `src/pages/home.css`.
- Hero with a descriptive H1, appointment anchor, WhatsApp action, and the existing labelled concept image.
- All 11 existing treatment names, summaries, and destinations retained: six featured cards and five additional treatments.
- Three published clinician previews use the existing portraits, roles, and clinical-focus text. Profile links retain the complete team details at `/team/#…`.
- International feature uses the existing WhatsApp and Contact flows; it does not promise an online consultation service.
- Existing care-philosophy text, reassurance statements, booking steps, contact information, and appointment form retained.
- Reviews and consented cases render when populated. Empty placeholder panels are omitted.
- All visible articles remain available. The existing four articles are drafts: visible in development and excluded from production under the existing publishing rules.
- Responsive header, mobile footer accordions, and homepage Call / WhatsApp / Book bar. On small screens the existing assistant appears beside the menu, away from form controls.
- Original portrait files retained. Homepage-only WebP copies provide 160px mobile variants and original-width variants. The three original-width copies total 85,606 bytes, versus 1,276,008 bytes for the original PNGs. Update these derived files in `public/team/home/` if the source portraits are replaced.
- No new package dependencies. The hero loads eagerly with responsive sources; below-the-fold images load lazily. Existing reduced-motion support is respected.

## Reserved pages

`/international-clients/` and `/videos/` are registered, with empty components. Both `pageLaunch` flags in `src/config/site.ts` are false. Navigation will place them immediately after About, in that order, when individually enabled.

While unfinished, direct visits use the existing not-found view instead of an empty page. Both routes are noindex and omitted from sitemaps. Complete their individual briefs, metadata, and indexing review before enabling their flags. No forms or page functionality have been invented for them.

## Validation

- TypeScript check and production build pass.
- Chromium checks at 360, 390, 768, 1024, and 1440px: one descriptive H1, all 11 treatments, three published clinicians, consistent content, no horizontal overflow, and no header-control overlap.
- 56 automated browser assertions passed: content retention, route metadata/structured-data equality against the previous version, menu focus and Escape, FAQ keyboard activation, form validation, WhatsApp handoff without simulated success, retained form values, footer keyboard access, assistant opening, team profile links, hidden navigation, noindex, and sitemap exclusions.
- Additional checks cover reduced motion, mobile portrait selection, and visible form controls in a 500px-high viewport. Bottom-bar height is covered by existing body/safe-area padding.
- Original appointment form and its integration configuration are unchanged. No appointment request or WhatsApp message was sent during testing.
- These are local Chromium checks, not a claim of a Lighthouse score or verification on physical iOS/Android devices.

## Content or functionality still awaiting input

- Approved clinic and treatment photography. Existing concept images remain labelled; no mockup imagery or invented clinic exterior was used.
- Genuine reviews and consented cases; both current arrays are empty.
- Clinical approval and publication of the draft articles.
- A verified appointment endpoint if direct online submission is desired. Currently a valid form explicitly offers WhatsApp and says nothing has been sent yet.
- Separate briefs and references for International Clients and Videos.
- The assistant remains in its existing preview mode; a live AI backend is a separate task.

Existing SEO metadata, structured data, canonical behaviour, and preview indexing rules are retained. The redesign does not change the existing client-rendered architecture or publish the site.
