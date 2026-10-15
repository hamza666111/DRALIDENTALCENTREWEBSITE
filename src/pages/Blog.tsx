import { useMemo, useState } from "react"
import ArticleCard from "../components/ArticleCard"
import ContactPanel from "../components/ContactPanel"
import { ArrowRight } from "../components/Icons"
import PageIntro from "../components/PageIntro"
import Reveal from "../components/Reveal"
import { images } from "../config/site"
import { visibleArticles } from "../lib/articles"
import { Link } from "../lib/router"

const PER_PAGE = 7

export default function Blog() {
  const all = visibleArticles()
  const cats = [
    "All articles",
    ...Array.from(new Set(all.map((a) => a.category))),
  ]
  const [cat, setCat] = useState("All articles")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return all.filter(
      (a) =>
        (cat === "All articles" || a.category === cat) &&
        (!term ||
          `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(term)),
    )
  }, [all, cat, q])
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const current = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const filtered = cat !== "All articles" || q.trim() !== ""
  const [featured, ...grid] = current
  const reset = () => {
    setCat("All articles")
    setQ("")
    setPage(1)
  }

  return (
    <>
      <PageIntro
        eyebrow="Oral-care journal"
        title="Clear answers for a healthier smile."
        intro="Explore our oral-care articles. Drafts are visible for review and clearly labelled until clinical approval."
        directAnswer="The DADC Dental Journal includes draft guides on dental visits, treatment estimates, daily oral care and whitening. Drafts require clinical review before publication."
        media={
          <div className="group arch-tl overflow-hidden bg-pale">
            <img
              src={images.clinicRoom2}
              alt="Bright modern dental clinic setting for oral health education at DADC"
              width={1200}
              height={900}
              loading="lazy"
              className="zoom-img aspect-[4/3] w-full object-cover"
            />
          </div>
        }
      />

      <section className="py-12 md:py-16" aria-labelledby="articles-title">
        <div className="shell">
          {all.some((a) => a.status === "draft") && (
            <p role="note" className="mb-8 rounded-[10px] border border-[#ecd9b4] bg-[#fdf6e9] px-5 py-4 text-[0.92rem] text-[#5c4a26]">
              <strong>Content preview:</strong> Draft articles are available to review, but their clinical content and publication details still need approval.
            </p>
          )}
          <h2 id="articles-title" className="sr-only">
            Articles
          </h2>
          <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter by category"
              className="flex flex-wrap gap-2"
            >
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cat === c}
                  onClick={() => {
                    setCat(c)
                    setPage(1)
                  }}
                  className={`min-h-[44px] rounded-[8px] border px-4 text-[0.9rem] font-semibold transition-colors duration-150 active:scale-[0.98] ${
                    cat === c
                      ? "border-action bg-action text-white"
                      : "border-line bg-surface text-ink hover:border-action hover:text-action"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <input
                id="article-search"
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(1)
                }}
                placeholder="Search articles"
                className="min-h-[44px] w-full rounded-[8px] border border-line bg-surface px-4 text-[0.95rem] lg:w-72"
              />
              {filtered && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-link shrink-0"
                >
                  Reset
                </button>
              )}
            </form>
          </div>
          <p className="mt-4 text-sm text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "article" : "articles"}
            {filtered ? " match your filters" : ""}
          </p>

          {all.length === 0 ? (
            <p className="mt-10 rounded-[12px] border border-dashed border-[#b8cbd1] bg-surface p-8 text-muted">
              No articles have been published yet. Clinically reviewed articles
              will appear here.
            </p>
          ) : results.length === 0 ? (
            <div className="mt-10 rounded-[12px] border border-dashed border-[#b8cbd1] bg-surface p-8">
              <p className="font-serif text-2xl text-ink">No articles found.</p>
              <p className="mt-2 text-muted">
                Try a different search term or category.
              </p>
              <button
                type="button"
                onClick={reset}
                className="btn btn-secondary mt-5"
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <>
              {featured && (
                <Reveal
                  as="article"
                  className="group relative mt-10 grid overflow-hidden rounded-[12px] border border-line bg-surface md:grid-cols-2"
                >
                  <div className="overflow-hidden">
                    <img
                      src={featured.image}
                      alt={
                        featured.imageAlt ||
                        `${featured.title} — oral health guide`
                      }
                      width={featured.imageWidth || 1200}
                      height={featured.imageHeight || 900}
                      loading="lazy"
                      className="zoom-img aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="eyebrow !text-[0.72rem]">
                        {featured.status === "draft"
                          ? "Draft topic"
                          : "Featured"}{" "}
                        · {featured.category}
                      </span>
                      {featured.readingTimeMinutes && (
                        <span>· {featured.readingTimeMinutes} min read</span>
                      )}
                    </div>
                    <h3 className="h2 mt-3 text-ink">
                      <Link
                        to={`/blog/${featured.slug}/`}
                        className="after:absolute after:inset-0 group-hover:text-action"
                      >
                        {featured.title}
                      </Link>
                    </h3>
                    <p className="mt-4 text-muted">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted">
                      <span>By {featured.author || "DADC Clinical Team"}</span>
                      {featured.status === "reviewed" && featured.published && <span>{featured.published}</span>}
                    </div>
                    <span className="text-link mt-4" aria-hidden>
                      Read article{" "}
                      <ArrowRight size={16} className="arrow-move" />
                    </span>
                  </div>
                </Reveal>
              )}
              <Reveal className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {grid.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </Reveal>
              {pages > 1 && (
                <nav
                  aria-label="Article pages"
                  className="mt-12 flex justify-center gap-2"
                >
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-current={n === page ? "page" : undefined}
                      onClick={() => {
                        setPage(n)
                        window.scrollTo({ top: 0 })
                      }}
                      className={`h-11 w-11 rounded-full text-sm font-semibold ${
                        n === page
                          ? "bg-action text-white"
                          : "border border-line bg-surface hover:bg-pale"
                      }`}
                    >
                      <span className="sr-only">Page </span>
                      {n}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
          <div className="mt-16">
            <ContactPanel />
          </div>
        </div>
      </section>
    </>
  )
}
