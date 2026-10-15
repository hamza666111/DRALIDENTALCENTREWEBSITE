import { useState } from "react"
import ArticleCard from "../components/ArticleCard"
import Breadcrumbs from "../components/Breadcrumbs"
import ContactPanel from "../components/ContactPanel"
import { ArrowRight } from "../components/Icons"
import Reveal from "../components/Reveal"
import { articleBodies, getService, type Service } from "../config/site"
import { findVisibleArticle, visibleArticles } from "../lib/articles"
import { Link } from "../lib/router"
import NotFound from "./NotFound"

/** Reusable article template driven by articleBodies in the config. */
export default function Article({ slug }: { slug: string }) {
  const a = findVisibleArticle(slug)
  const body = articleBodies[slug]
  const [tocOpen, setTocOpen] = useState(false)
  if (!a || !body) return <NotFound />
  const related = visibleArticles()
    .filter((x) => x.slug !== slug)
    .slice(0, 3)
  const svc = body.services.map(getService).filter(Boolean) as Service[]
  const toc = (
    <ol className="space-y-1">
      {body.sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={() => setTocOpen(false)}
            className="flex min-h-[44px] items-center gap-3 border-b border-line text-[0.92rem] font-medium text-action hover:text-action-hover"
          >
            <span className="font-serif text-lg text-brand/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-b from-surface to-canvas">
        <div className="shell">
          <div className="pt-4">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Blog", to: "/blog/" },
                { label: a.title },
              ]}
            />
          </div>
          <div className="grid-layout items-center gap-y-8 pb-10 pt-6">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <p className="eyebrow enter mb-4">{a.category}</p>
              <h1 className="display enter enter-2 max-w-[16ch] text-ink">
                {a.title}
              </h1>
              <p className="mt-5 max-w-[58ch] text-muted">{a.excerpt}</p>
              <dl className="enter enter-4 mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {[
                  ["Written by", a.author],
                  ["Clinically reviewed by", a.status === "reviewed" ? a.reviewer : null],
                  ["Published", a.status === "reviewed" ? a.published : null],
                  ["Last updated", a.status === "reviewed" ? a.lastmod : null],
                  [
                    "Reading time",
                    a.readingTimeMinutes
                      ? `${a.readingTimeMinutes} min read`
                      : null,
                  ],
                ]
                  .filter(([, v]) => Boolean(v))
                  .map(([k, v]) => (
                    <div key={k as string}>
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
            <div className="enter enter-3 group col-span-4 md:col-span-8 lg:col-span-5">
              <div className="arch-tl overflow-hidden bg-pale">
                <img
                  src={a.image}
                  alt={a.imageAlt || `${a.title} — oral care guide`}
                  width={a.imageWidth || 1200}
                  height={a.imageHeight || 900}
                  loading="lazy"
                  className="zoom-img aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </div>
          {a.status === "draft" && (
            <p
              role="note"
              className="mb-10 rounded-[10px] border border-[#ecd9b4] bg-[#fdf6e9] px-5 py-4 text-[0.92rem] text-[#5c4a26]"
            >
              <strong>Draft — clinician review required.</strong> This content
              is visible for review. It has not been clinically approved and
              should not be used as clinical advice. Reviewer and publication
              date still need to be supplied.
            </p>
          )}
        </div>
      </header>

      <div className="shell py-12">
        <div className="grid-layout gap-y-10">
          <article className="col-span-4 md:col-span-8 lg:col-span-8">
            <div className="max-w-[720px]">
              <p className="text-[1.15rem] leading-relaxed text-ink">
                {body.intro}
              </p>
              <div className="mt-8 rounded-[12px] border border-line bg-surface lg:hidden">
                <button
                  type="button"
                  aria-expanded={tocOpen}
                  aria-controls="toc-mobile"
                  onClick={() => setTocOpen(!tocOpen)}
                  className="flex min-h-[52px] w-full items-center justify-between px-5 font-semibold text-ink"
                >
                  On this page{" "}
                  <span
                    aria-hidden
                    className={`transition-transform ${
                      tocOpen ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                <div id="toc-mobile" hidden={!tocOpen} className="px-5 pb-4">
                  {toc}
                </div>
              </div>
              {body.sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-28 border-t border-line pt-10 mt-10 first-of-type:mt-10"
                >
                  <h2 className="flex items-baseline gap-4 font-serif text-[2rem] leading-tight text-ink md:text-[2.4rem]">
                    <span className="text-brand/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  <p className="mt-4 text-muted leading-relaxed">{s.body}</p>
                  {s.points && (
                    <ul className="mt-4 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.sub?.map((x) => (
                    <div key={x.title} className="mt-6">
                      <h3 className="font-serif text-2xl text-ink">
                        {x.title}
                      </h3>
                      <p className="mt-2 text-muted leading-relaxed">
                        {x.body}
                      </p>
                    </div>
                  ))}
                </section>
              ))}
              <section
                className="mt-12 border-t border-line pt-8"
                aria-labelledby="refs"
              >
                <h2 id="refs" className="font-semibold text-ink">
                  References
                </h2>
                {body.references.length ? (
                  <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                    {body.references.map((r) => (
                      <li key={r.url}>
                        <a
                          href={r.url}
                          className="text-action underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    References to be added by the clinical reviewer.
                  </p>
                )}
              </section>
              {svc.length > 0 && (
                <section
                  className="mt-12 rounded-[14px] border border-line bg-surface p-6 sm:p-8"
                  aria-labelledby="svc"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
                    <div>
                      <p className="eyebrow !text-[0.72rem]">
                        Clinical Services
                      </p>
                      <h2 id="svc" className="h3 mt-1 text-ink">
                        Related treatments & pricing
                      </h2>
                    </div>
                    <Link to="/services/" className="text-link text-sm">
                      All fees & services <ArrowRight size={14} />
                    </Link>
                  </div>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {svc.map((s) => (
                      <li
                        key={s.slug}
                        className="group rounded-[10px] border border-line bg-pale/40 p-4 transition-colors hover:bg-pale"
                      >
                        <Link to={`/services/${s.slug}/`} className="block">
                          <span className="font-serif text-lg text-ink group-hover:text-action">
                            {s.name}
                          </span>
                          <span className="mt-1 block text-xs text-muted line-clamp-2">
                            {s.summary}
                          </span>
                          <span className="mt-3 inline-flex items-center text-xs font-semibold text-action">
                            Learn more & fees{" "}
                            <ArrowRight size={14} className="ml-1 arrow-move" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </article>
          <aside className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <nav
                aria-label="On this page"
                className="hidden rounded-[12px] border border-line bg-surface p-6 lg:block"
              >
                <p className="mb-2 font-serif text-2xl text-ink">
                  On this page
                </p>
                {toc}
              </nav>
              <ContactPanel
                title="Have a question before your visit?"
                compact
              />
            </div>
          </aside>
        </div>
        {related.length > 0 && (
          <Reveal
            as="section"
            className="mt-16 border-t border-line pt-12"
            aria-labelledby="rel"
          >
            <div className="flex items-end justify-between gap-4">
              <h2 id="rel" className="h2 text-ink">
                Related articles
              </h2>
              <Link to="/blog/" className="text-link">
                View all articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} article={r} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </>
  )
}
