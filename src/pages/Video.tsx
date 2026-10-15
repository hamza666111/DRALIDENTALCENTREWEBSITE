import { useState } from "react"
import {
  findVideo,
  safeEmbed,
  safeMediaUrl,
  durationLabel,
} from "../config/videos"
import { getService } from "../config/site"
import { Link } from "../lib/router"
import Breadcrumbs from "../components/Breadcrumbs"
import WhatsAppCTA from "../components/WhatsAppCTA"
import NotFound from "./NotFound"
export default function Video({ slug }: { slug: string }) {
  const v = findVideo(slug)
  const [play, setPlay] = useState(false)
  if (!v) return <NotFound />
  const src = safeMediaUrl(v.src),
    embed = safeEmbed(v.embedUrl)
  return (
    <div className="shell video-watch section-pad">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Videos", to: "/videos/" },
          { label: v.title },
        ]}
      />
      <p className="eyebrow mt-8">{v.category}</p>
      <h1 className="display mt-3">{v.title}</h1>
      <p className="lead mt-5">{v.summary}</p>
      <div className="video-player mt-8">
        {src ? (
          <video
            controls
            preload="metadata"
            poster={v.thumbnail}
            playsInline
            crossOrigin={v.captions ? "anonymous" : undefined}
          >
            <source src={src} />
            {v.captions && (
              <track
                kind="captions"
                src={v.captions}
                srcLang="en"
                label="English"
                default
              />
            )}
            Your browser does not support video playback.
          </video>
        ) : play ? (
          <iframe
            title={v.title}
            src={embed}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            className="video-load"
            onClick={() => setPlay(true)}
            aria-label={`Load player for ${v.title}`}
          >
            <img src={v.thumbnail} alt={v.thumbnailAlt} />
            <span className="play-mark" aria-hidden="true">
              ▶
            </span>
            <span className="player-notice">
              Load video player · third-party provider
            </span>
          </button>
        )}
      </div>
      <div className="watch-layout">
        <article>
          <dl className="watch-facts">
            {v.uploadDate && (
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={v.uploadDate}>
                    {v.uploadDate.slice(0, 10)}
                  </time>
                </dd>
              </div>
            )}
            {v.duration && (
              <div>
                <dt>Duration</dt>
                <dd>{durationLabel(v.duration)}</dd>
              </div>
            )}
            {v.reviewer && (
              <div>
                <dt>Reviewed by</dt>
                <dd>{v.reviewer}</dd>
              </div>
            )}
            {v.reviewedOn && (
              <div>
                <dt>Review date</dt>
                <dd>{v.reviewedOn}</dd>
              </div>
            )}
          </dl>
          {v.transcript && (
            <details className="transcript" open>
              <summary>Video transcript</summary>
              <div>{v.transcript}</div>
            </details>
          )}
          <Link to="/videos/" className="text-link mt-6">
            ← Back to all videos
          </Link>
        </article>
        <aside className="content-card">
          <p className="eyebrow">Your next step</p>
          <h2 className="h3 mt-3">Questions about your care?</h2>
          <p className="text-muted mt-3">
            Our team can help you plan a consultation.
          </p>
          <div className="mt-5">
            <WhatsAppCTA label="Ask on WhatsApp" />
          </div>
          {v.relatedServices
            ?.map(getService)
            .filter(Boolean)
            .map((s) => (
              <Link
                key={s!.slug}
                to={`/services/${s!.slug}/`}
                className="text-link mt-3"
              >
                {s!.name} →
              </Link>
            ))}
        </aside>
      </div>
    </div>
  )
}
