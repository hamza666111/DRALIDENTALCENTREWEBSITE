# Delivery notes

## Implemented
- Shared desktop/mobile design across Home, Services, treatment details, About, Team, Reviews, Our Work, Blog, Contact and existing legal pages. Original clinic content and assets retained.
- International Clients after About, followed by Videos. International enquiry supports online consultation and planned visits with country/timezone/travel details.
- Searchable/category-filtered video catalogue and individual watch-page template, ready for real media records.
- Clear appointment requests, mobile Call/WhatsApp/Book bar, keyboard-accessible navigation and responsive layouts.
- Build-time page HTML, per-route metadata, canonical URLs, truthful structured data, sitemap/robots generation, treatment alias support, and a 404 document.

## Verification completed
- TypeScript checking passed.
- Production client and server-rendering builds passed; 28 pre-rendered route documents generated.
- Generated HTML checked for single primary headings and valid JSON-LD.
- Browser visual and interaction testing could not complete: the available Chromium runtime failed to launch in this environment. Responsive code is implemented, but device appearance and real form delivery need verification on your deployment.
- No live messages, appointments or production deployment were made.

## Before launch
1. Follow README.md; set VITE_SITE_URL to the real domain and rebuild. The included dist is a noindex preview intentionally.
2. Have the clinic approve the original treatment content, then complete its confirmed/reviewer/date fields. Unreviewed treatment pages stay noindex.
3. Add real videos, consented cases and reviews as available. Empty collections show honest empty states.
4. Forms use the existing WhatsApp handoff unless real endpoints are configured. Chat remains its labelled preview implementation.
5. Check mobile/desktop display and real delivery on your hosting environment.

## Packaging
Source, original assets, npm lockfile, deployment example and built preview are included. Dependencies/cache are excluded; run npm ci. The old formatter was removed after it damaged TypeScript inline type separators; those separators were repaired and the resulting code passed type checking and the build. npm is the documented package manager.
