import { useState } from "react"
import PageIntro from "../components/PageIntro"
import { Link } from "../lib/router"
import {
  publishedVideos,
  durationLabel,
  type ClinicVideo,
} from "../config/videos"
import { ArrowRight } from "../components/Icons"
const categories = [
  "All",
  "Clinic & team",
  "Procedures",
  "Oral health",
  "Patient stories",
]
function Card({
  video: v,
  featured = false,
}: {
  video: ClinicVideo
  featured?: boolean
}) {
  return (
    <article className={`video-card ${featured ? "video-featured" : ""}`}>
      <Link
        to={`/videos/${v.slug}/`}
        className="video-poster"
        aria-label={`Watch ${v.title}`}
      >
        <img
          src={v.thumbnail}
          alt={v.thumbnailAlt}
          width={960}
          height={540}
          loading={featured ? "eager" : "lazy"}
        />
        <span className="play-mark" aria-hidden="true">
          ▶
        </span>
      </Link>
      <div className="video-copy">
        <p className="eyebrow">{v.category}</p>
        <h2 className={featured ? "h2 mt-3" : "h3 mt-3"}>
          <Link to={`/videos/${v.slug}/`}>{v.title}</Link>
        </h2>
        <p className="text-muted mt-3">{v.summary}</p>
        <div className="video-meta">
          {v.duration && <span>{durationLabel(v.duration)}</span>}
          <Link className="text-link" to={`/videos/${v.slug}/`}>
            Watch video <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
export default function Videos() {
  const [q, setQ] = useState(""),
    [cat, setCat] = useState("All")
  const all = publishedVideos()
  const shown = all.filter(
    (v) =>
      (cat === "All" || v.category === cat) &&
      `${v.title} ${v.summary}`.toLowerCase().includes(q.trim().toLowerCase()),
  )
  const [first, ...rest] = shown
  return (
    <>
      <PageIntro
        eyebrow="Videos"
        title="Dental care, explained on video."
        intro="Explore clinic introductions, procedure explainers and oral-health information from our team."
        actions={
          <Link to="/contact/#appointment" className="btn btn-primary">
            Ask the clinic
          </Link>
        }
        media={
          <div className="video-hero-art" aria-hidden="true">
            <span className="play-mark">▶</span>
            <span>
              Watch. Understand.
              <br />
              Feel prepared.
            </span>
          </div>
        }
      />
      <section className="section-pad">
        <div className="shell">
          <div className="collection-tools">
            <div
              className="filter-chips"
              role="group"
              aria-label="Video category"
            >
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="search-field">
              <span className="sr-only">Search videos</span>
              <input
                type="search"
                placeholder="Search videos"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
          </div>
          <p className="text-sm text-muted mt-4" aria-live="polite">
            {shown.length} {shown.length === 1 ? "video" : "videos"}
          </p>
          {first ? (
            <>
              <Card video={first} featured />
              <div className="media-grid">
                {rest.map((v) => (
                  <Card key={v.slug} video={v} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-panel">
              <span className="empty-symbol" aria-hidden="true">
                ▷
              </span>
              <h2 className="h2">
                {all.length
                  ? "No matching videos"
                  : "Our video library is taking shape."}
              </h2>
              <p>
                {all.length
                  ? "Try another category or search term."
                  : "Published clinic videos and dental explainers will appear here. In the meantime, explore our treatments or ask the team a question."}
              </p>
              {all.length ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setQ("")
                    setCat("All")
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <Link className="btn btn-secondary" to="/services/">
                  Explore treatments
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
