import type { ReactNode } from "react"
import ArticleCard from "../components/ArticleCard"
import Breadcrumbs from "../components/Breadcrumbs"
import FAQAccordion from "../components/FAQAccordion"
import { ArrowRight, Check, Minus } from "../components/Icons"
import Reveal from "../components/Reveal"
import ToothIllustration from "../components/ToothIllustration"
import WhatsAppCTA from "../components/WhatsAppCTA"
import ArchLine from "../components/ArchLine"
import { getService, type Service } from "../config/site"
import { Link } from "../lib/router"
import { findVisibleArticle } from "../lib/articles"
import { cliniciansForService } from "../lib/clinicians"
import { formatFee } from "../lib/whatsapp"
import { BookingBand } from "./Home"
import NotFound from "./NotFound"

const sections = [
  { id: "overview", label: "Overview" },
  { id: "suitability", label: "Suitability" },
  { id: "journey", label: "Treatment journey" },
  { id: "fees", label: "Fees" },
  { id: "aftercare", label: "Aftercare" },
  { id: "faqs", label: "FAQs" },
]

function FeeSummary({ s }: { s: Service }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-6 shadow-[0_20px_40px_-30px_rgba(17,23,25,0.35)]">
      <p className="font-serif text-2xl text-ink">Your treatment estimate</p>
      <dl className="mt-4 space-y-3 border-t border-line pt-4 text-[0.95rem]">
        <div>
          <dt className="text-muted">Fee</dt>
          <dd className="font-semibold text-action">{formatFee(s.fee)}</dd>
        </div>
        <div>
          <dt className="text-muted">Pricing basis</dt>
          <dd className="font-medium text-ink">
            {s.fee.basis ?? "To be confirmed"}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">
        A personalised plan and estimate are provided after assessment.
      </p>
      <div className="mt-5">
        <WhatsAppCTA full label="Discuss on WhatsApp" treatment={s.name} />
      </div>
    </div>
  )
}

function Block({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <Reveal
      as="section"
      id={id}
      className="treatment-block scroll-mt-32 border-t border-line py-14 first:border-t-0 first:pt-0"
    >
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="h2 max-w-[20ch] text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </Reveal>
  )
}

export default function ServiceDetail({ slug }: { slug: string }) {
  const s = getService(slug)
  if (!s) return <NotFound />
  const related = s.related.map(getService).filter(Boolean) as Service[]
  const reading = s.articles.map(findVisibleArticle).filter((a) => !!a)

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-b from-surface to-canvas">
        <ArchLine className="absolute -left-1/4 top-10 h-[420px] w-[150%] opacity-70" />
        <div className="shell relative">
          <div className="pt-4">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services/" },
                { label: s.name },
              ]}
            />
          </div>
          <div className="grid-layout items-center gap-y-8 pb-12 pt-6 lg:pb-16">
            <div className="col-span-4 md:col-span-8 lg:col-span-6">
              <p className="eyebrow enter mb-3">{s.name}</p>
              <h1 className="display enter enter-2 max-w-[15ch] text-ink">
                {s.name} in Lahore
              </h1>
              <p className="mt-4 font-serif text-2xl">{s.headline}</p>
              {s.geoDirectAnswer && (
                <details className="intro-details mt-5">
                  <summary>About this treatment</summary>
                  <p className="mt-3 text-muted">{s.geoDirectAnswer}</p>
                </details>
              )}
              <p className="enter enter-3 mt-5 max-w-[44ch] text-muted">
                {s.intro}
              </p>
              <div className="enter enter-4 mt-8">
                <WhatsAppCTA
                  label="Book a WhatsApp consultation"
                  treatment={s.name}
                  arrow
                />
              </div>
            </div>
            <div className="enter enter-3 col-span-4 flex flex-col items-center justify-center gap-4 md:col-span-8 lg:col-span-6">
              {s.image ? (
                <figure className="group relative w-full overflow-hidden rounded-[16px] border border-line bg-pale">
                  <div className="arch-tl overflow-hidden">
                    <img
                      src={s.image}
                      alt={
                        s.imageAlt ||
                        `Clinical treatment operatory and technology for ${s.name} at DADC`
                      }
                      width={s.imageWidth || 1200}
                      height={s.imageHeight || 900}
                      loading="lazy"
                      className="zoom-img aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-[8px] bg-surface/90 px-3 py-1.5 backdrop-blur-sm">
                    <ToothIllustration
                      variant={
                        s.slug === "dental-implants" ? "implant" : s.category
                      }
                      className="h-6 w-6 text-brand"
                    />
                    <span className="text-[0.75rem] font-medium text-ink">
                      {s.name}
                    </span>
                  </div>
                </figure>
              ) : (
                <ToothIllustration
                  variant={
                    s.slug === "dental-implants" ? "implant" : s.category
                  }
                  className="h-52 w-52 md:h-64 md:w-64"
                />
              )}
            </div>
            <div className="enter enter-4 col-span-4 md:col-span-4 lg:hidden">
              <FeeSummary s={s} />
            </div>
          </div>
        </div>
        <nav
          aria-label="On this page"
          className="relative border-y border-line bg-surface"
        >
          <ul className="shell flex gap-1 overflow-x-auto text-[0.9rem] font-medium [scrollbar-width:none]">
            {sections.map((x) => (
              <li key={x.id} className="shrink-0">
                <a
                  href={`#${x.id}`}
                  className="inline-flex min-h-[48px] items-center px-3 text-muted hover:text-action"
                >
                  {x.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="shell py-16">
        {(!s.confirmed || !s.review.reviewer || !s.review.date) && (
          <div
            role="note"
            className="mb-12 rounded-[10px] border border-[#ecd9b4] bg-[#fdf6e9] px-5 py-4 text-[0.92rem] text-[#5c4a26]"
          >
            <strong className="font-semibold">
              Draft — clinician review required.
            </strong>{" "}
            This information is general, not clinical advice, and has not yet
            been approved by the clinic.
            <span className="mt-1 block">
              Reviewed by: {s.review.reviewer ?? "To be confirmed"} · Review
              date: {s.review.date ?? "To be confirmed"}
            </span>
          </div>
        )}

        <div className="grid-layout gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <Block
              id="overview"
              eyebrow="Overview"
              title={`What is ${s.name.toLowerCase()} and what does it involve?`}
            >
              <div className="max-w-[62ch] space-y-4 text-muted">
                {s.overview.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {s.highlights.length > 0 && (
                <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                  {s.highlights.map((h) => (
                    <li key={h.title} className="border-l-2 border-pale pl-5">
                      <h3 className="font-serif text-2xl text-ink">
                        {h.title}
                      </h3>
                      <p className="mt-1 text-[0.95rem] text-muted">{h.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Block>

            <Block
              id="suitability"
              eyebrow="Is it right for you?"
              title={`Who is suitable for ${s.name.toLowerCase()}?`}
            >
              <p className="max-w-[62ch] text-muted">
                {s.suitability ??
                  "Suitability information is being prepared by the clinic."}
              </p>
            </Block>

            <Block
              id="journey"
              eyebrow="The process"
              title={`What are the steps in the ${s.name.toLowerCase()} treatment process?`}
            >
              <p className="max-w-[60ch] text-muted">
                Every plan is tailored. The stages below are typical; timings
                vary between individuals and are discussed at your consultation.
              </p>
              <ol className="relative mt-10 grid gap-8 md:grid-cols-3">
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-[21px] hidden h-px bg-line md:block"
                />
                {s.journey.map((j, i) => (
                  <li key={j.title} className="relative">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-action font-semibold text-white">
                      {i + 1}
                    </span>
                    <h3 className="h3 mt-4 text-ink">{j.title}</h3>
                    <p className="mt-2 text-[0.95rem] text-muted">{j.body}</p>
                  </li>
                ))}
              </ol>
            </Block>

            <Block
              id="fees"
              eyebrow="Fees & costs"
              title={`How much does ${s.name.toLowerCase()} cost and what is included?`}
            >
              <p className="max-w-[60ch] text-muted">
                Fee: <strong className="text-action">{formatFee(s.fee)}</strong>
                {s.fee.basis ? ` · ${s.fee.basis}` : ""}. Your estimate is
                confirmed after a clinical assessment.
              </p>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-[12px] border border-line bg-pale/60 p-6">
                  <h3 className="font-semibold text-ink">Typically included</h3>
                  <ul className="mt-4 space-y-3 text-[0.95rem]">
                    {s.included.map((x) => (
                      <li key={x} className="flex gap-3">
                        <Check size={20} className="shrink-0 text-action" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[12px] border border-line bg-surface p-6">
                  <h3 className="font-semibold text-ink">
                    Additional charges may apply
                  </h3>
                  <ul className="mt-4 space-y-3 text-[0.95rem]">
                    {s.additional.map((x) => (
                      <li key={x} className="flex gap-3">
                        <Minus size={20} className="shrink-0 text-muted" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Block>

            <Block
              id="aftercare"
              eyebrow="Aftercare"
              title={`What aftercare is recommended following ${s.name.toLowerCase()}?`}
            >
              <ul className="max-w-[62ch] space-y-3 text-muted">
                {s.aftercare.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {a}
                  </li>
                ))}
              </ul>
            </Block>

            <Block
              id="faqs"
              eyebrow="FAQs"
              title={`Frequently asked questions about ${s.name.toLowerCase()}`}
            >
              <FAQAccordion items={s.faqs} />
            </Block>
          </div>

          <aside
            className="col-span-4 hidden lg:col-span-4 lg:block"
            aria-label="Fee summary"
          >
            <div className="sticky top-28 space-y-6">
              <FeeSummary s={s} />
              <div className="rounded-[12px] bg-pale p-6">
                <p className="font-serif text-2xl text-ink">
                  Have a question first?
                </p>
                <p className="mt-2 text-[0.95rem] text-muted">
                  Ask us anything about {s.name.toLowerCase()} before deciding.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <Reveal
          as="section"
          className="mt-10 border-t border-line pt-10"
          aria-labelledby="who-title"
        >
          <h2 id="who-title" className="h3 text-ink">
            Who you’ll see
          </h2>
          <p className="mt-2 max-w-[60ch] text-muted">
            {(() => {
              const people = cliniciansForService(s.slug)
              return people.length
                ? `Clinicians who focus on ${s.name.toLowerCase()}: ${people.map((c) => c.name).join(", ")}.`
                : "Learn about our clinicians, their qualifications and areas of clinical focus."
            })()}
          </p>
          <Link to="/team/" className="text-link mt-1">
            Meet your dentist <ArrowRight size={16} />
          </Link>
        </Reveal>

        {related.length > 0 && (
          <Reveal
            as="section"
            className="mt-10 border-t border-line pt-14"
            aria-labelledby="related-title"
          >
            <p className="eyebrow mb-3">Related treatments</p>
            <h2 id="related-title" className="h2 text-ink">
              You may also be interested in
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/services/${r.slug}/`}
                    className="group flex h-full items-center gap-4 rounded-[12px] border border-line bg-surface p-4 transition-colors hover:bg-pale"
                  >
                    <ToothIllustration
                      variant={
                        r.slug === "dental-implants" ? "implant" : r.category
                      }
                      className="h-16 w-16 shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block font-semibold text-ink">
                        {r.name}
                      </span>
                      <span className="block text-sm text-muted">
                        {r.summary}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      className="arrow-move shrink-0 text-action"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {reading.length > 0 && (
          <Reveal
            as="section"
            className="mt-16"
            aria-labelledby="reading-title"
          >
            <h2 id="reading-title" className="h3 text-ink">
              Relevant reading
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {reading.map((a) => (
                <ArticleCard key={a!.slug} article={a!} compact />
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <BookingBand
        title={`Questions about ${s.name.toLowerCase()}?`}
        treatment={s.name}
      />
    </>
  )
}
