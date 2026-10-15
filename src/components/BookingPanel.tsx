import type { ReactNode } from "react"
import ArchLine from "./ArchLine"
import Reveal from "./Reveal"
import WhatsAppCTA from "./WhatsAppCTA"

/** Pale-blue consultation band with optional image, used at the end of inner pages. */
export default function BookingPanel({
  eyebrow = "Book your visit",
  title,
  body,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  treatment,
  extra,
  ctaLabel,
  message,
}: {
  ctaLabel?: string
  message?: string
  eyebrow?: string
  title: string
  body: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  treatment?: string
  extra?: ReactNode
}) {
  return (
    <section className="py-16 md:py-24" aria-label={title}>
      <Reveal className="shell">
        <div className="relative grid overflow-hidden rounded-[12px] bg-pale md:grid-cols-2">
          <ArchLine
            className="absolute -left-20 top-0 h-full w-[700px] opacity-60"
            stroke="#c4dbe2"
          />
          <div className="relative p-8 md:p-12">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="h2 text-ink">{title}</h2>
            <p className="mt-4 max-w-[40ch] text-muted">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppCTA
                treatment={treatment}
                label={ctaLabel}
                message={message}
                arrow
              />
              {extra}
            </div>
          </div>
          {image && (
            <div className="group relative min-h-[240px] overflow-hidden md:min-h-0">
              <img
                src={image}
                alt={imageAlt || "DADC Dental Clinic consultation environment"}
                width={imageWidth || 1200}
                height={imageHeight || 800}
                loading="lazy"
                className="zoom-img absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
