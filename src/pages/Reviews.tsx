import { useId, useState } from "react"
import BookingPanel from "../components/BookingPanel"
import PageIntro from "../components/PageIntro"
import { images, integrations, reviews, type Review } from "../config/site"
function ReviewCard({
  review: r,
  featured = false,
}: {
  review: Review
  featured?: boolean
}) {
  const [expanded, setExpanded] = useState(false),
    id = useId(),
    long = r.text.length > 360
  return (
    <figure className={`review-card ${featured ? "review-featured" : ""}`}>
      <span className="quote-mark" aria-hidden="true">
        “
      </span>
      <blockquote>
        <p id={id}>{long && !expanded ? `${r.text.slice(0, 360)}…` : r.text}</p>
        {long && (
          <button
            type="button"
            className="text-link"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Read full review"}
          </button>
        )}
      </blockquote>
      <figcaption>
        <strong>{r.author}</strong>
        <span>
          {r.source} · <time>{r.date}</time>
        </span>
        {r.url && (
          <a
            className="text-link"
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read at source ↗
          </a>
        )}
      </figcaption>
    </figure>
  )
}
const expectations = [
  ["A warm welcome", "Time to settle in and tell us what brought you here."],
  [
    "A clear conversation",
    "We listen, explain your options in plain language and answer your questions.",
  ],
  [
    "Gentle, considered care",
    "Treatment is planned with your comfort and long-term health in mind.",
  ],
]
export default function Reviews() {
  const [featured, ...rest] = reviews,
    s = integrations.reviewSummary
  return (
    <>
      <PageIntro
        eyebrow="Patient reviews"
        title="Patient feedback, in their own words."
        intro="Read genuine patient experiences and follow their original sources where available."
        actions={
          s?.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Read reviews at source ↗
            </a>
          ) : undefined
        }
        media={
          <div className="review-hero-art" aria-hidden="true">
            <span>“</span>
            <p>
              Care begins
              <br />
              with listening.
            </p>
          </div>
        }
      />
      <section className="section-pad">
        <div className="shell">
          {s && (
            <p className="mb-6">
              Rated <strong>{s.score}</strong> from {s.count} reviews on{" "}
              <a
                className="text-link"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.source}
              </a>
              .
            </p>
          )}
          {featured ? (
            <>
              <ReviewCard review={featured} featured />
              <div className="media-grid">
                {rest.map((r, i) => (
                  <ReviewCard review={r} key={`${r.author}-${r.date}-${i}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-panel">
              <p className="eyebrow">Patient experiences</p>
              <h2 className="h2">Genuine feedback belongs here.</h2>
              <p>
                We have not published patient reviews on this website yet.
                Reviews will appear with attribution and a link to their
                original source where available.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="shell">
          <p className="eyebrow">How we share feedback</p>
          <h2 className="h2 mt-3">A transparent approach.</h2>
          <div className="three-grid mt-8">
            {[
              [
                "Original source",
                "Attributable reviews, with links to the original where available.",
              ],
              [
                "Clear context",
                "The source and date accompany each published review.",
              ],
              [
                "Patient privacy",
                "Feedback is shared with respect for patient privacy and permission.",
              ],
            ].map(([a, b]) => (
              <div className="content-card" key={a}>
                <h3 className="h3">{a}</h3>
                <p className="text-muted mt-3">{b}</p>
              </div>
            ))}
          </div>
          {integrations.reviewSubmitUrl && (
            <div className="soft-cta mt-10">
              <div>
                <h2 className="h3">Share your experience.</h2>
                <p className="text-muted mt-2">
                  Already visited? Your honest feedback is welcome.
                </p>
              </div>
              <a
                className="btn btn-primary"
                href={integrations.reviewSubmitUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Leave a review ↗
              </a>
            </div>
          )}
        </div>
      </section>
      <section className="section-pad">
        <div className="shell">
          <p className="eyebrow">Your visit</p>
          <h2 className="h2 mt-3">What to expect at your visit.</h2>
          <ol className="steps-grid three">
            {expectations.map(([title, body], i) => (
              <li key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3 className="h3 mt-4">{title}</h3>
                <p className="text-muted mt-3">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <BookingPanel
        title="Ready to book your visit?"
        body="Get in touch with our team. We’re here to help and look forward to welcoming you to DADC."
        image={images.clinicRoom2}
        imageAlt="Illustrative dental treatment room"
        imageWidth={1200}
        imageHeight={900}
      />
    </>
  )
}
