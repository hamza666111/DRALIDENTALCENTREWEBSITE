import { chatConfig } from "../config/chat"
import { international } from "../config/international"
import { publishedVideos } from "../config/videos"
import { articles, cases, integrations, pricing, reviews, seo, services } from "../config/site"
import { Link } from "../lib/router"

export default function ContentStatus() {
  const pendingTreatments = services.filter(
    (s) => !s.confirmed || !s.review.reviewer || !s.review.date,
  ).length
  const missingFees = services.filter((s) => s.fee.amount === null).length
  const draftArticles = articles.filter((a) => a.status === "draft").length
  const publishedCases = cases.filter((c) => c.consentConfirmed).length
  const videoCount = publishedVideos().length
  const treatmentNotes = [
    pendingTreatments
      ? `${pendingTreatments} treatment pages need clinical approval.`
      : "Treatment pages have clinical approval.",
    missingFees
      ? `${missingFees} fees need confirmation.`
      : "Treatment fees are entered.",
    pricing.currency ? "Currency is set." : "Currency still needs confirmation.",
  ]
  const items = [
    {
      title: "Treatments and fees",
      detail: treatmentNotes.join(" "),
      to: "/services/",
    },
    {
      title: "Article drafts",
      detail: draftArticles
        ? `${draftArticles} drafts are visible for review. Approve the clinical copy and publication details before treating them as published advice.`
        : "All configured articles have been reviewed.",
      to: "/blog/",
    },
    {
      title: "Patient reviews",
      detail: reviews.length
        ? `${reviews.length} review${reviews.length === 1 ? " is" : "s are"} displayed.`
        : "No patient reviews have been added. Add genuine feedback with its source and permission.",
      to: "/reviews/",
    },
    {
      title: "Treatment cases",
      detail: publishedCases
        ? `${publishedCases} consented case${publishedCases === 1 ? " is" : "s are"} displayed.`
        : "No consented before-and-after cases have been added. Each needs images and clinical context.",
      to: "/work/",
    },
    {
      title: "Videos",
      detail: videoCount
        ? `${videoCount} playable video${videoCount === 1 ? " is" : "s are"} displayed.`
        : "No playable clinic videos have been added. The video page shows where they will appear.",
      to: "/videos/",
    },
    {
      title: "Enquiries and assistant",
      detail: `${integrations.appointmentEndpoint && international.endpoint ? "Direct form delivery is connected." : "Direct form delivery is not fully connected; enquiries use an explicit WhatsApp handoff."} ${chatConfig.mode === "live" && chatConfig.backendUrl ? "The assistant is connected." : "The assistant remains a labelled preview."}`,
      to: "/contact/",
    },
    {
      title: "Launch details",
      detail: `${seo.domain ? "A public site URL is configured." : "The public site URL is not configured."} Confirm clinic photography and approve the legal text before launch.`,
      to: "/about/",
    },
  ]

  return (
    <section id="content-status" className="home-section bg-[#eaf4f6]" aria-labelledby="content-status-title">
      <div className="home-shell">
        <p className="eyebrow">Website content preview</p>
        <h2 id="content-status-title" className="h2 mt-3">What is ready, and what still needs content.</h2>
        <p className="mt-3 max-w-[70ch] text-muted">
          You can browse every page and draft below. This checklist shows the material still needed before the website is ready for public launch.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="rounded-[12px] border border-line bg-white p-5">
              <h3 className="font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
              <Link to={item.to} className="text-link mt-4 inline-flex">View section →</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
