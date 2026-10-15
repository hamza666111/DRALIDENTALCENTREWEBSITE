import { servicesPageFaqs } from "../config/servicesPage"
import {
  articleBodies,
  articles,
  clinic,
  getService,
  pageLaunch,
  pricing,
  seo,
  services,
  slugAliases,
  showDrafts,
} from "../config/site"
import { international } from "../config/international"
import {
  findVideo,
  publishedVideos,
  safeEmbed,
  safeMediaUrl,
} from "../config/videos"
import { findVisibleArticle } from "./articles"
import { publishedClinicians } from "./clinicians"
import type { Route } from "./router"
export interface Meta {
  title: string
  description: string
  canonical: string
  noindex: boolean
  ogType: "website" | "article"
  ogImage: string
  crumbs: { name: string ; path: string }[]
  jsonLd: object[]
}
export interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq: "weekly" | "monthly" | "yearly"
  priority: string
}
/** A canonical host is explicit. Preview/local origins and example.com are never production canonicals. */
export function getBaseUrl(): string {
  try {
    if (!seo.domain) return ""
    const u = new URL(seo.domain)
    if (
      !["https:", "http:"].includes(u.protocol) ||
      ["example.com", "localhost", "127.0.0.1"].includes(u.hostname)
    )
      return ""
    return u.origin
  } catch {
    return ""
  }
}
export const absolute = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path
  return getBaseUrl()
    ? `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`
    : ""
}
const pages: Record<string, {
  title: string
  description: string
  crumb?: string
}> = {
  home: {
    title: `Dental Clinic in Lahore | ${clinic.name}`,
    description: seo.defaultDescription,
  },
  services: {
    title: `Dental Treatments in Lahore | ${clinic.name}`,
    description:
      "Explore our dental treatments, what each involves and how treatment estimates are discussed. Request a consultation with our Lahore clinic.",
    crumb: "Services",
  },
  work: {
    title: `Treatment Journeys | ${clinic.name}`,
    description:
      "Learn about our approach to treatment. Patient cases are published with consent and individual clinical context.",
    crumb: "Our Work",
  },
  reviews: {
    title: `Patient Feedback | ${clinic.name}`,
    description:
      "Patient feedback with attribution and original sources where available. Learn what to expect and contact our clinic.",
    crumb: "Reviews",
  },
  team: {
    title: `Meet Our Dental Team | ${clinic.name}`,
    description:
      "Meet Dr. Ali Azhar, Dr. Maria Khan and Dr. Usman Tariq. Explore their supplied profiles, qualifications and areas of clinical focus.",
    crumb: "Team",
  },
  about: {
    title: `About Our Lahore Clinic | ${clinic.name}`,
    description:
      "Get to know our clinic, care approach and dental team. Find out what to expect at your first visit to Dr Ali Dental Centre.",
    crumb: "About",
  },
  "international-clients": {
    title: `International Dental Patients in Lahore | ${clinic.name}`,
    description:
      "Request an online consultation or coordinate a clinic visit to Pakistan. Share your travel plans and time zone with our Lahore dental team.",
    crumb: "International Clients",
  },
  videos: {
    title: `Dental Videos & Explainers | ${clinic.name}`,
    description:
      "Explore published clinic videos, dental procedure explainers and oral-health information. Watch with available captions and transcripts.",
    crumb: "Videos",
  },
  blog: {
    title: `Oral Health Journal | ${clinic.name}`,
    description:
      "Browse published dental guides and treatment information, with authorship and clinical review details where supplied.",
    crumb: "Blog",
  },
  contact: {
    title: `Request an Appointment in Lahore | ${clinic.name}`,
    description:
      "Find our address, opening hours and contact details. Request a dental appointment or message the clinic on WhatsApp.",
    crumb: "Contact",
  },
  privacy: {
    title: `Privacy Policy | ${clinic.name}`,
    description:
      "Read how information submitted through this website is handled.",
    crumb: "Privacy",
  },
  accessibility: {
    title: `Accessibility | ${clinic.name}`,
    description:
      "Website accessibility information and ways to contact the clinic for assistance.",
    crumb: "Accessibility",
  },
  notFound: {
    title: `Page Not Found | ${clinic.name}`,
    description: "Find treatments, clinic information or contact our team.",
  },
}
function organization(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": absolute("/#organization"),
    name: clinic.name,
    url: getBaseUrl(),
    ...(clinic.logo.src ? { logo: absolute(clinic.logo.src) } : {}),
    image: absolute(seo.socialImage),
    description: seo.defaultDescription,
    ...(clinic.phone ? { telephone: clinic.phone } : {}),
    ...(clinic.email ? { email: clinic.email } : {}),
    ...(clinic.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.address,
            addressLocality: clinic.city,
            postalCode: clinic.postcode,
            addressCountry: "PK",
          },
        }
      : {}),
    ...(clinic.mapUrl ? { hasMap: clinic.mapUrl } : {}),
    ...(clinic.social
      ? { sameAs: Object.values(clinic.social).filter(Boolean) }
      : {}),
  }
}
const faq = (items: { question: string ; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
})
export function metaFor(route: Route, path: string): Meta {
  let m = pages[route.name] || pages.notFound,
    canonicalPath = path
  let noindex = !getBaseUrl() || route.name === "notFound",
    ogType: "website" | "article" = "website",
    ogImage = absolute(seo.socialImage)
  let crumbs = m.crumb
    ? [
        { name: "Home", path: "/" },
        { name: m.crumb, path },
      ]
    : []
  let jsonLd: object[] = []
  if (getBaseUrl() && route.name !== "notFound") jsonLd.push(organization())
  if (route.name === "service") {
    const s = getService(route.slug)
    if (!s) {
      m = pages.notFound
      noindex = true
    } else {
      canonicalPath = `/services/${s.slug}/`
      m = {
        title: `${s.name} in Lahore | ${clinic.name}`,
        description: s.intro,
      }
      crumbs = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services/" },
        { name: s.name, path: canonicalPath },
      ]
      if (s.image) ogImage = absolute(s.image)
      const approved = s.confirmed && !!s.review.reviewer && !!s.review.date
      noindex = noindex || !approved
      if (approved) {
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: absolute(canonicalPath),
          provider: { "@id": absolute("/#organization") },
          ...(pricing.currency && s.fee.amount !== null
            ? {
                offers: {
                  "@type": "Offer",
                  price: s.fee.amount,
                  priceCurrency: pricing.currency,
                  url: absolute(canonicalPath),
                },
              }
            : {}),
        })
        if (s.faqs.length) jsonLd.push(faq(s.faqs))
      }
    }
  }
  if (route.name === "services") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Dental treatments",
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: absolute(`/services/${s.slug}/`),
      })),
    })
    jsonLd.push(faq(servicesPageFaqs))
  }
  if (route.name === "international-clients") {
    noindex = noindex || !pageLaunch.internationalClients
    jsonLd.push(faq(international.faqs))
  }
  if (route.name === "videos")
    noindex = noindex || !pageLaunch.videos || !publishedVideos().length
  if (route.name === "article") {
    const a = findVisibleArticle(route.slug)
    if (!a || !articleBodies[route.slug]) {
      m = pages.notFound
      noindex = true
    } else {
      m = { title: `${a.title} | ${clinic.name}`, description: a.excerpt }
      ogType = "article"
      ogImage = absolute(a.image)
      crumbs = [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog/" },
        { name: a.title, path },
      ]
      noindex = noindex || a.status !== "reviewed"
      if (a.status === "reviewed")
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.title,
          description: a.excerpt,
          image: absolute(a.image),
          mainEntityOfPage: absolute(path),
          ...(a.author
            ? { author: { "@type": "Person", name: a.author } }
            : {}),
          ...(a.published ? { datePublished: a.published } : {}),
          ...(a.lastmod ? { dateModified: a.lastmod } : {}),
          publisher: { "@id": absolute("/#organization") },
        })
    }
  }
  if (route.name === "video") {
    const v = findVideo(route.slug)
    if (!v) {
      m = pages.notFound
      noindex = true
    } else {
      m = { title: `${v.title} | ${clinic.name}`, description: v.summary }
      ogImage = absolute(v.thumbnail)
      crumbs = [
        { name: "Home", path: "/" },
        { name: "Videos", path: "/videos/" },
        { name: v.title, path },
      ]
      if (v.uploadDate && /^\d{4}-\d{2}-\d{2}T/.test(v.uploadDate))
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: v.title,
          description: v.summary,
          thumbnailUrl: [absolute(v.thumbnail)],
          uploadDate: v.uploadDate,
          ...(v.duration ? { duration: v.duration } : {}),
          ...(safeMediaUrl(v.src) ? { contentUrl: absolute(v.src!) } : {}),
          ...(safeEmbed(v.embedUrl) ? { embedUrl: v.embedUrl } : {}),
          ...(v.transcript ? { transcript: v.transcript } : {}),
        })
    }
  }
  if (route.name === "team" && !publishedClinicians().length) noindex = true
  if (crumbs.length > 1)
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: absolute(c.path),
      })),
    })
  if (!getBaseUrl()) jsonLd = []
  return {
    title: m.title,
    description: m.description,
    canonical:
      route.name === "notFound" || m === pages.notFound
        ? ""
        : absolute(canonicalPath),
    noindex,
    ogType,
    ogImage,
    crumbs,
    jsonLd,
  }
}
export const staticPaths = () => [
  "/",
  "/services/",
  "/work/",
  "/reviews/",
  "/team/",
  "/about/",
  ...(pageLaunch.internationalClients ? ["/international-clients/"] : []),
  ...(pageLaunch.videos ? ["/videos/"] : []),
  "/blog/",
  "/contact/",
  "/privacy/",
  "/accessibility/",
]
export const renderPaths = () => [
  ...staticPaths(),
  ...services.map((s) => `/services/${s.slug}/`),
  ...Object.keys(slugAliases).map((slug) => `/services/${slug}/`),
  ...articles
    .filter((a) => a.status === "reviewed" && articleBodies[a.slug])
    .map((a) => `/blog/${a.slug}/`),
  ...publishedVideos().map((v) => `/videos/${v.slug}/`),
]
export function getSitemapEntries(): SitemapEntry[] {
  if (!getBaseUrl()) return []
  return [
    ...staticPaths().filter(
      (p) => p !== "/videos/" || publishedVideos().length,
    ),
    ...services
      .filter((s) => s.confirmed && s.review.reviewer && s.review.date)
      .map((s) => `/services/${s.slug}/`),
    ...articles
      .filter((a) => a.status === "reviewed" && articleBodies[a.slug])
      .map((a) => `/blog/${a.slug}/`),
    ...publishedVideos().map((v) => `/videos/${v.slug}/`),
  ]
    .filter((p) => p !== "/team/" || publishedClinicians().length)
    .map((p) => ({
      loc: absolute(p),
      changefreq: "monthly",
      priority: p === "/" ? "1.0" : "0.7",
    }))
}
const xml = (s: string) =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
export const generateSitemapXml = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${getSitemapEntries()
    .map(
      (e) =>
        `  <url><loc>${xml(e.loc)}</loc>${
          e.lastmod ? `<lastmod>${xml(e.lastmod)}</lastmod>` : ""
        }</url>`,
    )
    .join("\n")}\n</urlset>\n`
export const robotsText = () =>
  getBaseUrl()
    ? `User-agent: *\nAllow: /\nSitemap: ${getBaseUrl()}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n"
export const sitemapPaths = () => getSitemapEntries().map((e) => e.loc)
export { showDrafts }
