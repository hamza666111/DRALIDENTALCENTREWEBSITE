# DADC Website — Technical Audit and Handoff

Read-only audit of the repository as it exists now. Nothing in the website was modified. No packages were installed, no services connected, nothing deployed. Secrets: none found in source; environment-variable **names** only are listed.

**Status legend** (used throughout)

- **[VERIFIED]** — implemented and checked by me (typecheck, build, source inspection, or headless-Chromium tests in earlier sessions on this same code).
- **[UNTESTED]** — present in code, never executed with real inputs.
- **[MOCK]** — placeholder, sample or preview behaviour.
- **[MISSING]** — not implemented / no data.
- **[NOT INSPECTABLE]** — cannot be checked from this environment.

Evidence gathered for this audit (this session): `package.json`, `pnpm-lock.yaml` presence, installed versions read from `node_modules/*/package.json`, full source read/grep, `pnpm exec tsc --noEmit -p .` (passed), `pnpm exec vite build --outDir /tmp/audit-dist` (passed with one warning — see §10). Earlier sessions ran headless Chromium (via the DevTools protocol) layout, interaction and chat tests against production builds; those results are cited as "earlier test run" and apply to code that has not changed since, except where noted.

---

## 1. Project structure and technology

| Item | Value | Status |
| --- | --- | --- |
| Framework | React **19.2.4**, React DOM **19.2.4** | [VERIFIED] installed |
| Language | TypeScript **5.9.3** (`strict: true`, `jsx: react-jsx`) | [VERIFIED] |
| Build tool | Vite **8.0.5**, `@vitejs/plugin-react` **6.0.1** (Vite 8 uses Rolldown) | [VERIFIED] |
| Styling | Tailwind CSS **4.2.2** via `@tailwindcss/vite` **4.2.2**; no Tailwind config file; tokens in `src/index.css` `@theme` | [VERIFIED] |
| Formatter | oxfmt **0.2.0** (`pnpm format`) | present, not run |
| Package manager | pnpm **10.34.3** (pinned in `.mise.toml`), lockfile `pnpm-lock.yaml` | [VERIFIED] |
| Runtime | Node **22** (`.mise.toml`; v22.22.0 installed) | [VERIFIED] |
| UI / icon / animation libraries | **None.** Icons are inline SVG in `src/components/Icons.tsx`; animation is CSS only | [VERIFIED] |
| Form / validation / state / data fetching libraries | **None.** Hand-written validation (`validate()` in `AppointmentForm.tsx`), React `useState`, native `fetch` | [VERIFIED] |
| Routing | Custom history-API router `src/lib/router.tsx` (no react-router) | [VERIFIED] |
| Rendering mode | **Client-side rendered SPA only.** No SSR, no static generation | [VERIFIED] |
| Lint / test | **No linter, no test runner, no test files** | [MISSING] |

### package.json (complete)

```json
{
  "name": "figma-make-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview", "format": "oxfmt" },
  "dependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "devDependencies": {
    "@types/node": "^22.0.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0", "tailwindcss": "^4.0.0", "@tailwindcss/vite": "^4.0.0",
    "oxfmt": "^0.2.0", "typescript": "^5.7.0", "vite": "^8.0.5"
  }
}
```

### Commands

- Dev: `pnpm dev` (in Figma Make the dev server is started by the host — do not start another).
- Build: `pnpm build` → `dist/`.
- Preview of build: `pnpm preview`.
- Typecheck (no script defined): `pnpm exec tsc --noEmit -p .`.
- Format: `pnpm format`.
- Deploy: `.figma/make/deploy` → `pnpm run build` then `figma make deploy --build-dir dist`. Preview deploy: `.figma/make/deploy-preview` (development-mode build with inline sourcemaps).

### Deployment / hosting assumptions

- Host: Figma Make hosting (`figma make deploy`). Whether the host rewrites unknown paths to `index.html` (needed for nested routes) is **[NOT INSPECTABLE]**.
- `vite.config.ts` sets `base` from env `FIGMA_PUBLIC_URL` if present. The mascot uses `import.meta.env.BASE_URL`; other assets (favicon, fonts) use absolute URLs.

### Directory tree (source only)

```
.
├── index.html                 # shell: fonts, preconnects, <noscript>, #root
├── vite.config.ts             # plugins incl. dadcSitemap(); imports src/config/site.ts and src/lib/seo.ts
├── tsconfig.json  .mise.toml  package.json  pnpm-lock.yaml
├── README.md  AGENTS.md  CLAUDE.md(@AGENTS.md)
├── .figma/make/               # site.json (robots/description), deploy, deploy-preview, install, dev.json …
├── public/
│   ├── favicon.svg            # default Figma Make icon (not DADC)
│   └── chat/mascot-176.png, mascot-176.webp, mascot-264.webp
└── src/
    ├── main.tsx               # mounts App; global <img> error handler (adds .img-failed)
    ├── App.tsx                # Shell: header, <main>, footer, MobileBookingBar, ChatWidget; route switch (Page)
    ├── index.css              # Tailwind import, @theme tokens, .shell/.grid-layout, type scale, buttons, motion
    ├── config/
    │   ├── site.ts            # ALL clinic content + seo + integrations + articles + articleBodies
    │   └── chat.ts            # chatConfig (mode, backendUrl, limits, copy)
    ├── lib/
    │   ├── router.tsx         # RouterProvider, useRouter, Link, matchRoute, isActive, normalize
    │   ├── seo.ts             # metaFor(), sitemapPaths(), absolute()
    │   ├── useSeo.ts          # client-side <head> updates + JSON-LD
    │   ├── whatsapp.ts        # buildWhatsAppUrl(), appointmentMessage(), formatFee()
    │   ├── articles.ts        # visibleArticles(), findVisibleArticle()
    │   ├── images.ts          # srcSet()
    │   └── useReveal.ts       # one-time IntersectionObserver reveal
    ├── components/            # shared UI (see §3)
    ├── pages/                 # Home, Services, ServiceDetail, Work, Reviews, About, Blog, Article, Contact, Legal, NotFound
    └── chat/                  # assistant UI + service adapter (see §7)
```

Content system: **TypeScript objects** in `src/config/site.ts` and `src/config/chat.ts`. No Markdown, CMS or database.

---

## 2. Route and link inventory

Router: `matchRoute(path)` in `src/lib/router.tsx`. `App.tsx` → `Page` switch. Every route is rendered by the same `index.html`.

### Real routes

| Path | Purpose | Source | Type | Data source | Incoming internal links | Indexability now | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | `pages/Home.tsx` (`Home`, `BookingBand`) | static | `services`, `visibleArticles()`, `clinic`, `cases`, `reviews` | header logo + nav, footer logo, breadcrumbs, 404 | noindex (site-wide preview) | complete UI; facts pending |
| `/services/` | Treatments, filter, fee table, FAQs | `pages/Services.tsx` | static | `services`, `categories`, `pricing` | nav, Home (×2), About, footer "All treatments and fees", breadcrumbs, 404, chat sources | noindex (site-wide) | complete UI; fees unconfirmed |
| `/services/check-ups/` | Service detail | `pages/ServiceDetail.tsx` | dynamic | `services[]` | Home rows, Services list, fee table, footer, About grid, related cards, articles, chat cards | noindex (site-wide **and** per-page: `review.reviewer` null) | draft copy |
| `/services/cleaning/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/services/fillings/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/services/root-canal-care/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/services/teeth-whitening/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/services/dental-implants/` | 〃 (fullest content) | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/work/` | Before/after + cases | `pages/Work.tsx` | static | `cases` (empty) | nav, footer, Home | noindex (site-wide) | layout preview, no cases |
| `/reviews/` | Reviews | `pages/Reviews.tsx` | static | `reviews` (empty), `integrations` | nav, footer, Home | noindex (site-wide) | empty state |
| `/about/` | Clinic story, team | `pages/About.tsx` | static | `clinicians` (empty), `services` | nav, footer | noindex (site-wide) | placeholders |
| `/blog/` | Article listing | `pages/Blog.tsx` | static | `visibleArticles()` | nav, footer, Home, Article, breadcrumbs | noindex (site-wide) | complete UI; **empty in production** (all drafts) |
| `/blog/first-dental-visit/` | Article | `pages/Article.tsx` | dynamic | `articles` + `articleBodies` | Home/Blog cards, ServiceDetail reading, About, Article related, chat long sample | **dev only**; 404 in production build (draft) | draft |
| `/blog/treatment-estimate/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/blog/everyday-oral-care/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/blog/questions-whitening/` | 〃 | 〃 | dynamic | 〃 | 〃 | 〃 | draft |
| `/contact/` | WhatsApp, details, request form | `pages/Contact.tsx`, `components/AppointmentForm.tsx` | static | `clinic`, `integrations`, `treatmentOptions` | nav, footer, 404, chat sources | noindex (site-wide) | UI complete; no backend |
| `/privacy/` | Privacy policy | `pages/Legal.tsx` (`Privacy`) | static | hard-coded in file | footer, AppointmentForm consent label | noindex (site-wide) | owner review required |
| `/accessibility/` | Accessibility statement | `pages/Legal.tsx` (`Accessibility`) | static | hard-coded in file | footer | noindex (site-wide) | owner review required |
| anything else | 404 | `pages/NotFound.tsx` | fallback | — | — | per-page noindex; **HTTP 200** | complete (client-side) |

Draft rule: `showDrafts = import.meta.env?.DEV === true` (`src/config/site.ts`). In a production build every article has `status: 'draft'`, so `/blog/` shows "No articles have been published yet" and article URLs render `NotFound`. **[VERIFIED by source]**

### Navigation sources

- Header + drawer: `navItems` in `src/config/site.ts` → `SiteHeader.tsx`. Active state: `isActive()` (prefix match; `/` exact) → `aria-current="page"`. **[VERIFIED]** in the earlier test run.
- Footer (`SiteFooter.tsx`): treatments = all `services` + "All treatments and fees"; clinic column = `navItems.slice(2)` (Our work, Reviews, About, Blog, Contact); legal = `/privacy/`, `/accessibility/`.
- Breadcrumbs: `components/Breadcrumbs.tsx` (visual) used by `ServiceDetail`, `Article`, `Legal`, `PageIntro` (prop). BreadcrumbList JSON-LD from `metaFor()` (emitted only when `seo.domain` is set).

### URL behaviour

- **Trailing slash:** links always use a trailing slash. `normalize()` adds a slash to the *router state* but does **not** rewrite the address bar, so `/services` and `/services/` both render (duplicate URLs; no redirect). [VERIFIED by source]
- **Search / filter / pagination** (Services, Work, Blog): React state only, never in the URL. Not shareable or crawlable, so there are no duplicate URLs. Back/forward does not restore filters.
- **Back/forward:** `popstate` listener in `RouterProvider`. [VERIFIED] earlier.
- **Redirects:** none.
- **Unknown routes:** client-side `NotFound` with `noindex`; real HTTP status depends on the host — **[NOT INSPECTABLE]**. Likely 200 with an SPA fallback.
- **Direct visit / refresh on nested routes:** works on the Vite dev server (SPA fallback) and worked in earlier tests with a fallback static server. On Figma hosting: **[NOT INSPECTABLE]**.

### Link problems found

- **Broken in production:** `src/pages/About.tsx:112` links to `/blog/${articles[0].slug}/` using raw `articles` instead of `visibleArticles()`. In a production build this goes to `/blog/first-dental-visit/`, which renders 404. **[VERIFIED by source]**
- **Chat long-sample link** to `https://example.invalid/...` in `src/chat/service.ts` (`longSample`): it's deliberately unreal demo text in preview mode only, but it renders as text, not a link.
- `href="#"`: **none**. Hash links present are intentional: skip link `#main` (`App.tsx`), error summary `#f-…` (`AppointmentForm.tsx`), in-page TOC/sub-nav anchors (`ServiceDetail.tsx`, `Article.tsx`).
- Buttons without real actions: WhatsApp buttons show a "number not configured" note (by design, `WhatsAppCTA.tsx`, `WhatsAppHandoff.tsx`).
- Placeholder-only pages/sections: Work (cases), Reviews, About team, Legal "To confirm" blocks, Contact details/map.

---

## 3. Shared components and page composition

| Concern | Files / symbols |
| --- | --- |
| Header + mobile drawer | `src/components/SiteHeader.tsx` (`SiteHeader`): sticky, scroll shadow, drawer below **1120px** (`min-[1120px]:`), Escape, focus trap, focus restore |
| Footer | `src/components/SiteFooter.tsx` (`SiteFooter`), bottom padding `pb-36` reserves room for the mascot |
| Container / grid | `src/index.css` `.shell` (max **1600px**, padding 20/32/48px at <768, ≥768, ≥1024px), `.grid-layout` (4/8/12 columns) |
| Typography, colours, radii | `src/index.css` `@theme` (`--color-*`, `--font-serif`, `--font-sans`, `--radius-*`), `.display`, `.h2`, `.h3`, `.eyebrow`, `.btn*`, `.text-link` |
| Page header | `components/PageIntro.tsx`, `components/SectionHeading.tsx`, `components/ArchLine.tsx` (decorative SVG) |
| Booking bands | `BookingBand` (exported from `pages/Home.tsx`, used by Home, ServiceDetail), `components/BookingPanel.tsx` (Work, Reviews, About), `components/ContactPanel.tsx` (Blog, Article) |
| Sticky mobile booking bar | `components/MobileBookingBar.tsx` (class `booking-bar`, hidden ≥1120px); body padding in `index.css` |
| WhatsApp / phone | `lib/whatsapp.ts` (`buildWhatsAppUrl`, `appointmentMessage`); `components/WhatsAppCTA.tsx`; `chat/WhatsAppHandoff.tsx`; `tel:` links in `SiteFooter.tsx`, `Contact.tsx` (only rendered if `clinic.phone` is set) |
| Forms | `components/AppointmentForm.tsx` (only form). Blog search input in `pages/Blog.tsx` |
| Treatments, fees, FAQs | `components/TreatmentRow.tsx`, `components/PriceTable.tsx`, `components/FAQAccordion.tsx`, `components/ToothIllustration.tsx`, `formatFee()` |
| Before/after | `components/BeforeAfter.tsx` (range input + side-by-side toggle) |
| Reviews | `pages/Reviews.tsx` (`ReviewText`, `Meta`), no separate component |
| Articles | `components/ArticleCard.tsx`; layout `pages/Article.tsx` |
| Chat | `src/chat/*` (see §7); launcher/mascot `chat/ChatLauncher.tsx` (`MascotArt`) |
| Motion helpers | `components/Reveal.tsx`, `lib/useReveal.ts` |
| Logo | `components/Logo.tsx` (text fallback while `clinic.logo.src` is null) |

**Site-wide changes:** `src/index.css` (tokens, `.shell`, buttons, motion), `src/config/site.ts` (all content), `SiteHeader`, `SiteFooter`, `MobileBookingBar`, `WhatsAppCTA`, `lib/whatsapp.ts`, `App.tsx` (shell order, SEO hook, chat mount).

### Connection map

```
pages/*  ──► PageIntro, SectionHeading, Reveal, ArchLine, Breadcrumbs
         ──► TreatmentRow / PriceTable / FAQAccordion / ArticleCard / BeforeAfter / AppointmentForm
         ──► BookingBand / BookingPanel / ContactPanel ──► WhatsAppCTA ──► lib/whatsapp.ts
App.tsx  ──► SiteHeader, SiteFooter, MobileBookingBar, ChatWidget, useSeo(lib/useSeo → lib/seo)
All      ──► src/config/site.ts (clinic, services, pricing, articles, articleBodies, seo, integrations)
Chat     ──► src/config/chat.ts, chat/service.ts (getChatAdapter)

External (runtime): fonts.googleapis.com / fonts.gstatic.com (fonts), images.unsplash.com (photos),
                    wa.me (only if clinic.whatsapp set), integrations.appointmentEndpoint (null),
                    chatConfig.backendUrl (null), clinic.mapEmbedUrl iframe (null).
Build-time:         vite.config.ts → dadcSitemap() reads seo.domain + sitemapPaths().
```

---

## 4. Content and configuration

All content lives in **`src/config/site.ts`** (TypeScript objects). Editing workflow: change the file, then rebuild and redeploy. **Every content update requires a rebuild.** Note: because `vite.config.ts` imports `site.ts`, editing it also restarts the dev server (this caused an earlier stale-module error).

| Content | Location | Schema |
| --- | --- | --- |
| Identity / logo | `clinic` (`ClinicConfig`) | `name`, `tagline`, `logo {src,alt,width,height}`, `address`, `city`, `postcode`, `phone`, `whatsapp` (digits), `email`, `openingHours: {days,hours}[]`, `mapEmbedUrl` |
| SEO | `seo` | `domain`, `defaultDescription`, `socialImage`, `locale` |
| Pricing | `pricing` | `currency` (ISO), `note` |
| Treatments | `services: Service[]` | `slug`, `name`, `category`, `confirmed`, `summary`, `headline`, `intro`, `fee {amount,from,basis}`, `included[]`, `additional[]`, `overview[]`, `highlights[]`, `suitability`, `journey[]`, `aftercare[]`, `faqs[]`, `related[]`, `articles[]`, `review {reviewer,date}` |
| Categories | `categories` | `all / preventive / restorative / cosmetic` |
| Clinicians | `clinicians: Clinician[]` = **[]** | `name`, `role`, `verifiedCredentials[]`, `photo` |
| Reviews | `reviews: Review[]` = **[]** | `author`, `source`, `date`, `text`, `url` |
| Cases | `cases: CaseStudy[]` = **[]** | `title`, `treatment` (slug), `clinician`, `consentConfirmed`, `before`, `after` |
| Articles | `articles: Article[]` (4) + `articleBodies` | `slug`, `title`, `category`, `excerpt`, `image`, `imageAlt`, `status`, `author`, `reviewer`, `published`; body: `intro`, `sections[]`, `services[]`, `references[]` |
| Integrations | `integrations` | `reviewSubmitUrl`, `reviewSummary`, `appointmentEndpoint`, `directionsUrl` (all null) |
| Images | `images`, helper `u()` | Unsplash URLs |
| Privacy / Accessibility | hard-coded arrays in `src/pages/Legal.tsx` | `Section {title, body, review?}` |
| Chat copy | `src/config/chat.ts` | see §7 |

### Unconfirmed / placeholder content (verified in source)

- `clinic.logo.src`, `address`, `city`, `postcode`, `phone`, `whatsapp`, `email`, `openingHours`, `mapEmbedUrl`: all **null**.
- `pricing.currency` null, so every fee renders "Fee to be confirmed". All 6 services have `fee.amount: null`, `confirmed: false`, and `review` null.
- Service inclusions/exclusions and all clinical copy: **draft**, written as general examples.
- `clinicians`, `reviews`, `cases`: empty.
- All 4 articles: `status: 'draft'`, author/reviewer/published null, `references: []`.
- `seo.domain`, `seo.socialImage`: null. `integrations.*`: null.
- Photography: Unsplash stock labelled "Concept imagery".
- Legal pages: "Owner review required" plus "To confirm" items; "Last updated: to be confirmed".
- `favicon.svg`: default Figma Make icon.
- About "Our story": an owner-review placeholder note.

### Duplication risks

- `.figma/make/site.json` `description` (shown in the static HTML) differs from `seo.defaultDescription`, and it reads like a project prompt, not clinic copy.
- Static `<title>` and `og:title` come from the Figma plugin default **"Figma Make App"** (no `title` in `site.json`). The client overwrites them after JS runs.
- Treatment labels in `chat/service.ts` sample replies and legal/About copy are hand-written prose that mentions treatments and clinic facts. They'd need updating if services change.
- `treatmentOptions` is derived from `services` (no duplication).

---

## 5. Design, assets and motion

- **CSS entry:** `src/index.css` (imported by `main.tsx`). Tokens: canvas `#f6f8f7`, surface `#fff`, pale `#e8f3f6`, ink `#111719`, muted `#526169`, line `#d6e0e3`, brand `#0788b8`, action `#006b91`, action-hover `#005674`, night `#111b1f`; radii card 12px / control 8px.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024) plus a custom **1120px** (`min-[1120px]:`) for desktop nav/booking bar/mascot position, and **639px** for the full-screen mobile chat. Body bottom padding 76px + safe area below 1120px.
- **Fonts:** Google Fonts `<link>` in `index.html` (Instrument Serif, Manrope 400–700, `display=swap`) with preconnect. Fallbacks: Georgia/Times; system sans. **[NOT INSPECTABLE]** in this sandbox (no internet; screenshots showed fallbacks).
- **Logo:** none (text wordmark in `Logo.tsx`). **Mascot:** `public/chat/mascot-176.webp`, `mascot-264.webp`, `mascot-176.png` (trimmed from the uploaded 1254×1254 RGBA PNG; transparent corners verified earlier).
- **Images:** Unsplash `auto=format` (AVIF/WebP), `w=` sizing; only the Home hero has `srcSet`/`sizes` and `fetchPriority="high"`; most others use `loading="lazy"`; aspect-ratio boxes reserve space; `img-failed` hides broken images (`main.tsx`).

### Animations

| Animation | File | Trigger | Duration | Reduced motion |
| --- | --- | --- | --- | --- |
| Hero entrance `.enter` (opacity + 12px) | `index.css` | page load | 450ms, staggered 80ms | removed (1ms) |
| Section reveal `.reveal` | `index.css`, `useReveal.ts` | IntersectionObserver, once; forced visible after 2.5s | 600ms | shown, no motion |
| Header shadow | `SiteHeader.tsx` | `scrollY > 8` | 300ms | transitions 1ms |
| Buttons | `index.css` `.btn` | hover/press | 160ms colour, 0.98 press | 1ms |
| Treatment row hover/focus | `TreatmentRow.tsx` + `.arrow-move` | hover/focus | 200ms bg, 4px arrow | arrow movement removed |
| Image zoom (max 1.025) | `.zoom-img` | group hover | 600ms | removed |
| FAQ accordion | `FAQAccordion.tsx` | click | 300ms grid-rows/opacity | 1ms |
| Chat panel open/close | `index.css` `.chat-in/.chat-out` | open/close | 200/190ms | 1ms; close timeout 0 |
| Typing dots | `.chat-dot` | only while a request is pending | 1.2s loop | static |
| Mascot greeting | `.mascot-greet` | always while visible; paused when the tab is hidden or the chat is open | 7.6s cycle (~1.6s motion), 2s delay | none |

**Mascot:** **whole-image sway** (±2°, ≤2px, `transform-origin: 50% 95%`). The arm is **not** animated independently, because the asset is a single flattened image. `ChatLauncher` takes an `art` prop so a layered or animated asset can replace `MascotArt`.

### Fixed / sticky layers (z-index)

`SiteHeader` sticky `z-40`; header drawer `z-50`; `MobileBookingBar` `z-30`; mascot launcher `z-[35]`; skip link `z-[60]`; chat panel `z-[70]`; the WhatsApp "not configured" note uses `z-30`.

**Preserve:** tokens and type scale, `.shell` widths, the 1120px nav switch, the booking-bar padding and the mascot clearance (`bottom: calc(86px + safe-area)`, footer `pb-36`), reduced-motion block, the honest placeholder states.

---

## 6. Forms, booking and external connections

| Action | Component | Handler | Validation | Endpoint | States | Delivery | Connected? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Appointment request | `AppointmentForm.tsx` | `submit()` | `validate()`: name required; phone ≥7 digits; email optional with format check; date required and not in the past; consent required | `integrations.appointmentEndpoint` (**null**) — JSON POST `{name, phone, email, date, time, treatment, consent}`; any 2xx = success | pristine, invalid (focused error summary), pending, received, failed + Try again, handoff; double-submit guard (`inFlight` ref) | none now | **No.** With no endpoint it shows WhatsApp handoff, or "Prototype — not submitted" when no number is set |
| Book on WhatsApp | `WhatsAppCTA.tsx` | `buildWhatsAppUrl(appointmentMessage(treatment))` | — | `https://wa.me/<digits>?text=<encoded>` | link, or a "not configured" note | WhatsApp app | **No number configured** |
| Chat WhatsApp handoff | `chat/WhatsAppHandoff.tsx` | `buildWhatsAppUrl(chatConfig.whatsappMessage)` | — | wa.me | link, or disabled | — | No number |
| Call the clinic | `Contact.tsx`, `SiteFooter.tsx` | `tel:` | — | — | hidden if no phone | — | No phone |
| Map / directions | `Contact.tsx` | iframe `clinic.mapEmbedUrl`; link `integrations.directionsUrl` | — | — | placeholder | — | No |
| Review submission | `Reviews.tsx` | link `integrations.reviewSubmitUrl` | — | — | text note | — | No |
| Chat | §7 | | | `chatConfig.backendUrl` (null) | | | Preview only |

**WhatsApp construction** (`src/lib/whatsapp.ts`): it strips non-digits from `clinic.whatsapp`, returns `null` if empty, and otherwise returns `https://wa.me/${digits}?text=${encodeURIComponent(message)}`. Messages:

- General/treatment: `Hello DADC, I would like to request an appointment[ about <Treatment>]. Could you let me know which times may be available? Thank you.`
- Form handoff: multi-line request with name, treatment interest, preferred day and time window.
- Chat: `Hello DADC, I would like some help planning my visit.` (no transcript).

**"Appointment confirmation":** there is **no booking system**. "Request received" only appears after a real 2xx from a configured endpoint, and states it is not a confirmed appointment. Currently unreachable (endpoint null). **[VERIFIED by source; the endpoint path is UNTESTED]**

**Third parties:** Google Fonts, Unsplash images, wa.me (conditional). **No analytics** (`site.json` has no `googleAnalyticsId`; no gtag found), no cookies, no maps embedded now.

**Environment variables (names only):** `FIGMA_PUBLIC_URL` (asset base path), `FIGMA_DEV_SERVER_HOST`, `PORT` (dev/preview server). `BASE_URL` is Vite-provided. No app-specific env vars; `.env*` is git-ignored and none exist in the repo.

---

## 7. Current chat implementation

### Files

```
src/config/chat.ts        chatConfig
src/chat/types.ts         ChatLink, ChatReply, ChatResult, ChatErrorKind, HistoryItem, ChatRequest, ChatAdapter, ChatMessage
src/chat/service.ts       previewAdapter, httpAdapter(url), sanitizeReply(), getChatAdapter()
src/chat/ChatWidget.tsx   open/close, mobile scroll lock, visualViewport → --chat-vh, Escape, focus trap (mobile), hides booking bar
src/chat/ChatLauncher.tsx mascot button (aria-label "Open DADC AI assistant"), MascotArt
src/chat/ChatPanel.tsx    session state, send(), retry(), clear(), preview-state menu, live-region announce
src/chat/ChatHeader.tsx   title, close, "Chat on WhatsApp", "Clear chat"
src/chat/MessageList.tsx  role="log", near-bottom auto-scroll, "New message" button
src/chat/MessageBubble.tsx RichText (paragraphs/lists, no HTML), sources, cards, handoff
src/chat/TreatmentCard.tsx  card from getService(slug) + formatFee
src/chat/QuickActions.tsx   chatConfig.quickActions
src/chat/ChatComposer.tsx   textarea, Enter/Shift+Enter, IME guard, 1,000-char soft limit
src/chat/ChatStatus.tsx     statusText, ChatStatus (Retry / WhatsApp), Typing
src/chat/WhatsAppHandoff.tsx
```

### Configuration (`src/config/chat.ts`)

```ts
export const chatConfig = {
  mode: 'preview' as 'preview' | 'live',
  backendUrl: null as string | null,
  maxLength: 1000,
  previewDelayMs: 700,
  requestTimeoutMs: 20000,
  welcome: 'Hello! What would you like to know about DADC?',
  note: 'For clinic information, not diagnosis. Please avoid sharing sensitive medical details.',
  whatsappMessage: 'Hello DADC, I would like some help planning my visit.',
  quickActions: ['Explore treatments', 'Treatment fees', 'Opening hours & location', 'Request an appointment'],
}
```

### Types (`src/chat/types.ts`)

```ts
export interface ChatLink { label: string; href: string }             // internal "/…" or https
export interface ChatReply { text: string; sources?: ChatLink[]; treatments?: string[]; handoff?: boolean }
export type ChatErrorKind = 'network' | 'limit' | 'unavailable'
export type ChatResult = { ok: true; reply: ChatReply } | { ok: false; error: ChatErrorKind }
export interface HistoryItem { role: 'user' | 'assistant'; text: string }
export interface ChatRequest {
  message: string; history: HistoryItem[]; pagePath: string; locale: string; signal: AbortSignal
  simulate?: 'long' | 'card' | ChatErrorKind                         // preview only
}
export interface ChatAdapter { readonly kind: 'preview' | 'http' | 'unavailable'; sendMessage(req: ChatRequest): Promise<ChatResult> }
export interface ChatMessage extends Partial<ChatReply> { id: string; role: 'user' | 'assistant'; text: string; status?: ChatErrorKind }
```

### Adapter (`src/chat/service.ts`, condensed)

```ts
export function httpAdapter(url: string): ChatAdapter {
  return { kind: 'http', async sendMessage({ message, history, pagePath, locale, signal }) {
    const timeout = AbortSignal.timeout(chatConfig.requestTimeoutMs)
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, pagePath, locale }), signal: AbortSignal.any([signal, timeout]) })
    if (res.status === 429) return { ok: false, error: 'limit' }
    if (res.status === 503) return { ok: false, error: 'unavailable' }
    if (!res.ok) return { ok: false, error: 'network' }
    const data = await res.json()
    if (typeof data.text !== 'string') return { ok: false, error: 'network' }
    return { ok: true, reply: sanitizeReply(data) }   // keeps "/" or https links (≤5), known slugs (≤3), text ≤8000 chars
  } }   // network errors/timeouts → 'network'; user abort rethrown
}
export function getChatAdapter(): ChatAdapter {
  if (chatConfig.mode === 'preview') return previewAdapter
  if (chatConfig.backendUrl) return httpAdapter(chatConfig.backendUrl)
  return unavailableAdapter            // always { ok:false, error:'unavailable' }
}
```

`previewAdapter`: waits `previewDelayMs` (abortable), then:

- `simulate` forces one of the error states, the long sample or the card sample.
- An exact (case-insensitive) match on the four quick-action labels returns a fixed sample reply.
- Anything else returns the fixed fallback ("This is an interface preview…") with a `/services/` link and handoff.

**[MOCK]**: nothing leaves the browser.

### Behaviour summary

- **What happens on send:** `ChatPanel.send()` appends the user message, builds `history` (last 12 non-status messages), calls `adapter.sendMessage` with `pagePath` from the router and `locale` from `<html lang>`, and shows `Typing` until it resolves.
  - **Success:** appends the reply and announces it via a polite live region (first 280 characters).
  - **Network error:** removes the user message, puts the text back in the composer, shows Retry. In preview, a retry after a simulated failure succeeds.
  - **`limit` / `unavailable`:** status message with WhatsApp handoff.
- **Streaming:** **not supported** (single JSON response).
- **Cancellation:** `AbortController` aborts on panel unmount or Clear. **Timeout:** 20s (http adapter only).
- **Storage:** React state in `ChatWidget` only; it survives close/reopen within the page session and is lost on reload. **No localStorage/sessionStorage/cookies/console/analytics** (grep-verified; the earlier test run showed 0 storage keys).
- **Rendering:** `RichText` splits text into paragraphs/lists as React text nodes; no `dangerouslySetInnerHTML` anywhere. Links come only from `sources`; internal ones use `Link`.
- **Language/RTL:** `dir="auto"` on bubbles and the textarea; `ps-`/`rounded-ee` logical properties. Urdu rendering was verified only for layout (no Urdu font in the sandbox).
- **States tested earlier** at 320/768/1440 in headless Chromium: welcome, quick actions, waiting, cards, long reply wrap, network/Retry, limit, unavailable, empty/whitespace/overlong input, Enter/Shift+Enter, "New message", clear confirm, Escape, focus return, scroll lock/restore, mascot hide/restore. **[VERIFIED]** for preview mode. The live `httpAdapter` is **[UNTESTED]**.

**Integration points for a backend:** `src/config/chat.ts` (`mode`, `backendUrl`), `src/chat/service.ts` (`httpAdapter`, `sanitizeReply`, `getChatAdapter`), `src/chat/types.ts` (contract). The UI needs no changes if the backend returns `ChatReply` JSON.

---

## 8. AI backend integration readiness

### Confirmed facts (from code)

- Frontend integration point: `getChatAdapter()` → `httpAdapter(chatConfig.backendUrl)` when `mode: 'live'`.
- The URL is a **build-time constant** in `src/config/chat.ts` (bundled JS). There is no runtime config file and no env var; changing it requires a rebuild.
- Request: `POST <backendUrl>`, `Content-Type: application/json`, body `{ message: string, history: {role,text}[], pagePath: string, locale: string }`. No auth header, no credentials or cookies.
- Response the UI accepts: `200 { text: string, sources?: {label, href}[], treatments?: string[], handoff?: boolean }`.
  - 429 → usage-limit UI; 503 → unavailable UI; other non-2xx, invalid JSON, timeout → network/Retry.
- Client limits: 1,000-character soft input cap (`chatConfig.maxLength`; the send button is blocked above it, but this is client-side only), 12 history items, 20s timeout.

### Proposed architecture (not implemented)

- **Config:** set `mode: 'live'` and `backendUrl: 'https://<worker-domain>/chat'`. Optionally move the URL to a `VITE_CHAT_BACKEND_URL` env var read in `chat.ts` (a public value, never a secret).
- **Contract:** keep the shape above. Optionally add `{ code: 'limit' | 'unavailable' | 'invalid' }` bodies for logs; the UI reads status codes only.
- **Content source:** the assistant should answer only from the same data as the website.
  - Option A (simplest): a build step that exports `clinic`, `services` (only `confirmed` + reviewed, with `fee`/`included`/`additional`), `pricing`, published `articles`/`articleBodies` and `navItems` to `dist/content.json`. The Worker fetches that file from the production origin and caches it.
  - Option B: move content to a shared JSON package imported by both repos.
  - Either way, content reaches the assistant on redeploy plus cache expiry. Do not hand-copy facts into prompts.
- **Must remove or disable before launch:**
  - `chatConfig.mode = 'preview'` and the "Interface preview" banner (it's tied to `mode`).
  - The Preview states menu (`previewStates` in `ChatPanel.tsx`, shown only in preview).
  - `previewAdapter` and the `simulate` field. They can stay in code but must be unreachable; the backend must ignore `simulate`.
  - The `longSample` `example.invalid` text.
- **Domains/CORS:** the Worker must allow the production origin, plus explicitly chosen preview origins, for `POST` + `Content-Type`, with `OPTIONS` preflight. Preview deployments get different origins, so decide whether previews may call the live backend.
- **Server requirements:**
  - Validate JSON shape, cap the message at 1,000 characters, history length and total bytes; reject unknown fields.
  - Per-IP or per-client rate limits and daily quotas → 429.
  - Upstream model timeout under 20s; return 503 when the model is down.
  - Keep secrets in Worker secrets; nothing in the frontend repo.
  - Log minimally: no message bodies or personal data by default; set a retention policy.
  - Filter output: only return `sources.href` values that exist in the route inventory, and only known `treatments` slugs (the frontend `sanitizeReply` is a second line of defence, not the primary one).
  - Origin/CORS checks are **not authentication** and are trivially spoofed by non-browser clients. Combine them with rate limiting, quotas, optional bot challenge (e.g. Turnstile) and payload limits.
- **Behaviour policy:** answer only from verified clinic content. No diagnosis or prescribing. Fees exactly as configured, or "Fee to be confirmed". Never claim a booking; set `handoff: true` for appointment intent. Refuse and redirect for urgent medical issues.
- Model choice, provider availability, free tiers and pricing are **out of scope** and must be checked separately.

---

## 9. SEO and sitemap readiness

| Item | Implementation | Status |
| --- | --- | --- |
| Titles / descriptions | `metaFor()` in `src/lib/seo.ts`, applied by `useSeo()` **after JS runs** | [VERIFIED] client-side |
| Static HTML head | `<title>` and `og:title` = "Figma Make App"; description = `site.json` prompt-like text | **issue** |
| Canonical | added only when `seo.domain` is set and the page is indexable | inactive (domain null) |
| Open Graph / Twitter | `og:title/description/type/url/image`, `twitter:card` via `useSeo` | client-side; `socialImage` null |
| H1 | one per page (earlier test run across all routes and widths) | [VERIFIED] |
| Crawlable links | real `<a href>` via `Link` | [VERIFIED] |
| Initial HTML content | **empty `#root`** + `<noscript>` notice; no prerendering | **limitation** |
| Structured data | `Dentist` (needs domain + address + city), `BreadcrumbList` (needs domain), `Article` (reviewed only). No review markup | inactive now |
| robots.txt | `site.json` `robots.index: false` → Figma plugin emits `User-agent: * / Disallow: /` (confirmed in `/tmp/audit-dist/robots.txt`). `dadcSitemap()` emits an indexable robots + sitemap only when the domain is set **and** index ≠ false | [VERIFIED] |
| sitemap.xml | not generated (domain null) | [VERIFIED] absent |
| noindex | site-wide `<meta name="robots" content="noindex, nofollow">` (plugin); per-page noindex for 404, drafts, unreviewed services (`useSeo`) | [VERIFIED] |
| HTTP status / redirects | host-dependent | [NOT INSPECTABLE] |

### Proposed sitemap inventory (documentation only — not submittable yet)

Publishable once facts and review are complete (`PRODUCTION_DOMAIN` is a placeholder):

```
PRODUCTION_DOMAIN/
PRODUCTION_DOMAIN/services/
PRODUCTION_DOMAIN/work/
PRODUCTION_DOMAIN/reviews/
PRODUCTION_DOMAIN/about/
PRODUCTION_DOMAIN/blog/
PRODUCTION_DOMAIN/contact/
PRODUCTION_DOMAIN/privacy/
PRODUCTION_DOMAIN/accessibility/
```

Only after clinician approval (`confirmed: true` and `review.reviewer` set) add `PRODUCTION_DOMAIN/services/<slug>/` for: `check-ups`, `cleaning`, `fillings`, `root-canal-care`, `teeth-whitening`, `dental-implants`. Add `PRODUCTION_DOMAIN/blog/<slug>/` only for articles with `status: 'reviewed'`: `first-dental-visit`, `treatment-estimate`, `everyday-oral-care`, `questions-whitening` (all drafts today).

- **Today:** strictly, none of the service/article URLs qualify; `sitemapPaths()` already applies these rules.
- **Exclude:** 404, unknown paths, filter/search states, slash-less duplicates.
- **Consider:** whether `/work/` and `/reviews/` are worth indexing while they hold only empty states.
- **Generation:** `sitemapPaths()` (`src/lib/seo.ts`) plus `dadcSitemap()` (`vite.config.ts`) generate from the same content source at build time.
- **`lastmod`:** not emitted. Only add it if a real per-page change date is stored (e.g. a new `updated` field per service/article); never use the build time.

### Before Google Search Console submission

1. Confirm and connect the production domain, then set `seo.domain`.
2. Set `"robots": {"index": true}` in `.figma/make/site.json` for production only, so the site-wide noindex is removed.
3. Add `title` (and a clinic-appropriate `description`) to `site.json`, or replace the static head, so pre-JS HTML isn't "Figma Make App".
4. Ensure the host serves nested routes directly (200 for real pages, ideally 404 for unknown) and normalises trailing slashes. Canonicals already use the trailing-slash form.
5. **Server/build work:** prerender or statically generate each route with its own `<head>` and content (e.g. `vite-react-ssg`, Astro, Next.js static export). This is the main SEO gap of the current client-only architecture; frontend metadata alone does not fix it.
6. Verify domain ownership in Search Console, then submit `PRODUCTION_DOMAIN/sitemap.xml` after confirming it's publicly reachable.
7. Fix the About → draft-article link (§2).

---

## 10. Build, deployment and verification

### Steps

1. Fresh install: Node 22, pnpm 10.34.3 (`mise install` if using mise), then `pnpm install` (Figma's script uses `--prefer-offline --no-frozen-lockfile`).
2. Run: `pnpm dev`.
3. Build: `pnpm build` → `dist/` (`index.html`, `assets/`, `chat/`, `favicon.svg`, `robots.txt`).
4. Deploy: `.figma/make/deploy`.
5. **Nested routes:** the host must fall back to `index.html` for all non-file paths. There are no backend/runtime dependencies (static files only); chat and form backends are external and unset.

### Checks performed

- **This session:** `tsc --noEmit` passed. `vite build` into `/tmp/audit-dist` passed with the warning below. Static head and robots inspected. Grep audit for env vars, storage, logging, fetch, external URLs, hash links and z-indexes.
- **Earlier sessions** (same code, apart from the mascot and chat additions, which were tested then):
  - All routes at 320–1920px: no horizontal overflow or clipping, exactly one H1 per page, no console errors.
  - Menu dialog, filters, FAQ, slider keyboard, form validation and no-backend states.
  - Full chat state suite, plus mascot focus, reduced motion and the hidden-tab pause.

### Known issues and gaps

- **Build warning:** JS chunk **599 KB** minified (164 KB gzip), above Vite's 500 KB warning. No code-splitting yet. [VERIFIED]
- **SEO:**
  - Static title "Figma Make App" and the prompt-like static description (`site.json`).
  - Client-only rendering.
  - Unknown routes probably return 200.
  - No redirect between `/x` and `/x/`.
- **Broken link in production builds:** About → `/blog/first-dental-visit/`.
- `favicon.svg` is not DADC branding; the logo file is missing.
- `tsconfig` targets `lib: ES2020`, while the code uses `AbortSignal.any` and `AbortSignal.timeout`. Typecheck passes, but older browsers (Safari below 17.4 for `AbortSignal.any`) will throw in the **live** chat adapter only. **[UNTESTED]** in real browsers.
- **Not tested here:**
  - Real devices (iOS safe areas and keyboard), screen readers, real 200% zoom, colour contrast with tools.
  - Live font and image rendering (sandbox had no internet).
  - Lighthouse / Core Web Vitals (targets only, never measured).
- **No automated tests or linter.**
- **Unfinished integrations:**
  - WhatsApp number, phone, map/directions.
  - Form endpoint, chat backend, review URL/summary.
  - Production domain, social image.

---

## 11. Handoff summary

**A. Complete** — all 11 route types (6 service + 4 article slugs), shared design system, header/drawer, footer, booking bar, WhatsApp utility and honest unconfigured states. Also:

- Services filter and fee table (labelled blocks on mobile), FAQs.
- Accessible before/after control.
- Reviews/Work/About empty states; Blog search/filter/pagination; article template.
- Contact form with full client-side states.
- Legal pages with owner-review fields, 404.
- Reduced-motion support.
- Client-side SEO plumbing, build-time sitemap/robots switch.
- Chat UI with preview adapter and HTTP adapter; mascot launcher.

**B. Mocked** — chat replies (`previewAdapter`, preview-state menu, `longSample`); all imagery (Unsplash concept photos); before/after placeholder panels; team/review/case placeholders; draft clinical and article copy; legal text pending owner review; the text logo.

**C. Missing before launch**

- **Clinic data and branding:** clinic facts, logo/favicon, fees/currency.
- **Content sign-off:** clinician review of services and articles (reviewer, date, references); genuine reviews/cases/team, or keeping the empty states.
- **Integrations:** form backend or a confirmed WhatsApp-only flow; chat backend.
- **SEO and hosting:** production domain, indexing switch, static `<title>`/description, prerendering/SSG, verified host routing and 404 status, fix the About draft link.
- **Performance:** code-splitting.

**D. Needed from the clinic owner**

- Original logo (SVG/PNG) and favicon source.
- Registered name, street address, city, postcode, phone, WhatsApp number (international), email, opening hours, map/directions link.
- Currency; per-treatment fee or "from" fee, pricing basis, inclusions and additional charges; which of the 6 treatments are offered.
- Named clinical reviewer, approval of service and article copy, and references.
- Team names, roles, verified qualifications, approved portraits.
- Genuine review sources/URLs; review profile link; any verified rating with its source.
- Consented cases with matching before/after images, treatment, clinician and context.
- Privacy policy facts (data controller, legal basis, retention, rights process); accessibility contact and on-site access details.
- Production domain; social share image; whether a booking system or form-delivery service exists.

**E. Files for common tasks**

| Task | Edit |
| --- | --- |
| Clinic details, logo, prices, services, articles, team, reviews, cases, domain, integrations | `src/config/site.ts` |
| Logo asset / favicon | `public/` + `clinic.logo` |
| Chat mode, backend URL, copy, limits | `src/config/chat.ts` |
| Chat transport / response handling | `src/chat/service.ts`, `src/chat/types.ts` |
| WhatsApp message text | `src/lib/whatsapp.ts` (`appointmentMessage`), `chatConfig.whatsappMessage` |
| Form delivery | `integrations.appointmentEndpoint` (+ `components/AppointmentForm.tsx` if the payload changes) |
| Meta, structured data, sitemap rules | `src/lib/seo.ts`, `src/lib/useSeo.ts`, `vite.config.ts` (`dadcSitemap`) |
| Indexing, static title/description | `.figma/make/site.json` |
| Design tokens, widths, motion | `src/index.css` |
| Header nav / footer | `navItems` in `site.ts`; `SiteHeader.tsx`; `SiteFooter.tsx` |
| Legal text | `src/pages/Legal.tsx` |
| Routes | `src/lib/router.tsx` (`matchRoute`, `Route`), `src/App.tsx` (`Page`) |

**F. Recommended order for connecting the real assistant**

1. Get the clinic facts and clinician approval into `src/config/site.ts`, so the assistant has verified content.
2. Add a build step that exports approved content (only confirmed and reviewed services, published articles, clinic facts, route list) to a JSON file served with the site.
3. Build the Worker. It implements the §8 contract with input validation, CORS for production (plus chosen preview) origins, rate limits and quotas (429), timeouts and 503, secrets in Worker secrets, minimal logging, output filtering against the route list and slugs, and a policy prompt grounded only in the exported content.
4. Test the Worker on its own: valid replies, 429, 503, timeouts, oversized input, injection attempts, diagnosis/booking refusals.
5. Point the frontend at it: set `chatConfig.backendUrl` and `mode: 'live'` (optionally via a `VITE_` env var), and rebuild. Confirm the preview banner, preview-states menu and `previewAdapter` are unreachable.
6. Run end-to-end tests in a preview deployment (CORS, all UI states, WhatsApp handoff, mobile keyboard). Add an `AbortSignal.any` fallback if older Safari support matters.
7. Deploy to production. Monitor rate-limit hits and errors without logging message content.
