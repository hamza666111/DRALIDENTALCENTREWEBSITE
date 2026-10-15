import { useState } from "react"
import BeforeAfter from "../components/BeforeAfter"
import BookingPanel from "../components/BookingPanel"
import PageIntro from "../components/PageIntro"
import {
  cases,
  categories,
  getService,
  images,
  type Category,
} from "../config/site"
import { Link } from "../lib/router"
export default function Work() {
  const [filter, setFilter] = useState<Category | "all">("all")
  const published = cases.filter((c) => c.consentConfirmed)
  const shown = published.filter(
    (c) => filter === "all" || getService(c.treatment)?.category === filter,
  )
  const featured = shown[0]
  return (
    <>
      <PageIntro
        eyebrow="Our work"
        title="Real treatment journeys. Clearly explained."
        intro="A place to see how we approach thoughtful, personalised dental care—shown only with patient consent. Individual outcomes vary."
        media={
          <figure className="relative arch-tl overflow-hidden bg-pale">
            <img
              src={images.clinicRoom2}
              alt="Illustrative dental treatment room"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="image-caption">
              Illustrative clinic image
            </figcaption>
          </figure>
        }
      />
      <section className="section-pad">
        <div className="shell">
          {published.length > 0 && (
            <div
              className="filter-chips mb-8"
              role="group"
              aria-label="Filter cases"
            >
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {featured ? (
            <div className="case-featured">
              <div>
                <p className="eyebrow">Featured case</p>
                <h2 className="h2 mt-3 mb-6">{featured.title}</h2>
                <BeforeAfter
                  label={`${featured.title} — Individual outcomes vary.`}
                  before={{
                    src: featured.before,
                    alt: `Before: ${featured.title}`,
                  }}
                  after={{
                    src: featured.after,
                    alt: `After: ${featured.title}`,
                  }}
                />
              </div>
              <aside className="content-card">
                <h3 className="h3">Case details</h3>
                <dl className="case-facts">
                  <div>
                    <dt>Treatment</dt>
                    <dd>
                      {getService(featured.treatment)?.name ||
                        featured.treatment}
                    </dd>
                  </div>
                  <div>
                    <dt>Clinician</dt>
                    <dd>{featured.clinician}</dd>
                  </div>
                  {featured.timeline && (
                    <div>
                      <dt>Timeline</dt>
                      <dd>{featured.timeline}</dd>
                    </div>
                  )}
                  {featured.context && (
                    <div>
                      <dt>Context</dt>
                      <dd>{featured.context}</dd>
                    </div>
                  )}
                  {featured.followUp && (
                    <div>
                      <dt>Follow-up</dt>
                      <dd>{featured.followUp}</dd>
                    </div>
                  )}
                </dl>
                <p className="text-sm text-muted mt-6">
                  Individual outcomes vary; suitability is assessed during
                  consultation. Case images are published with patient consent.
                </p>
                <Link
                  to={`/services/${featured.treatment}/`}
                  className="text-link mt-5"
                >
                  Explore treatment →
                </Link>
              </aside>
            </div>
          ) : (
            <div className="empty-panel">
              <p className="eyebrow">Patient stories</p>
              <h2 className="h2">
                {published.length
                  ? "No cases in this category."
                  : "Every smile has a story."}
              </h2>
              <p>
                {published.length
                  ? "Choose another category to explore published cases."
                  : "Consented cases will be published here with treatment context and follow-up information. No patient results have been published on this website yet."}
              </p>
              {published.length ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => setFilter("all")}
                >
                  Show all cases
                </button>
              ) : (
                <Link className="btn btn-secondary" to="/services/">
                  Explore our treatments
                </Link>
              )}
            </div>
          )}
          {shown.length > 1 && (
            <>
              <h2 className="h2 mt-14">More treatment journeys</h2>
              <div className="media-grid">
                {shown.slice(1).map((c, i) => (
                  <article key={`${c.title}-${i}`} className="content-card">
                    <BeforeAfter
                      label={c.title}
                      before={{ src: c.before, alt: `Before: ${c.title}` }}
                      after={{ src: c.after, alt: `After: ${c.title}` }}
                    />
                    <h3 className="h3 mt-5">{c.title}</h3>
                    <p className="text-muted mt-2">{c.clinician}</p>
                    {c.context && <p className="mt-3">{c.context}</p>}
                    <Link
                      className="text-link"
                      to={`/services/${c.treatment}/`}
                    >
                      {getService(c.treatment)?.name || c.treatment} →
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <BookingPanel
        eyebrow="Your next step"
        title="Discuss your own treatment options."
        body="Have questions or want to discuss your options? Get in touch with our team on WhatsApp."
        image={images.waiting}
        imageAlt="Illustrative patient reception area"
        imageWidth={1000}
        imageHeight={750}
      />
    </>
  )
}
