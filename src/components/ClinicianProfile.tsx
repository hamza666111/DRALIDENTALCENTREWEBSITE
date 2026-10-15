import type { ReactNode } from "react"
import { getService, type Clinician } from "../config/site"
import { Link } from "../lib/router"
import { useReveal } from "../lib/useReveal"
import { clinicianMessage } from "../lib/whatsapp"
import ArchLine from "./ArchLine"
import { ArrowRight, Check, Clock, Leaf, Tooth } from "./Icons"
import WhatsAppCTA from "./WhatsAppCTA"

/** Neutral silhouette: never a generated face. */
export function PortraitPlaceholder({
  label = "Portrait to be supplied",
}: {
  label?: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-end bg-[#e4ebee]">
      <svg
        viewBox="0 0 100 100"
        className="w-2/3 text-[#c9d6db]"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="50" cy="38" r="18" />
        <path d="M14 100c0-22 16-36 36-36s36 14 36 36z" />
      </svg>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-white/90 px-2.5 py-1 text-[0.72rem] font-semibold text-muted">
        {label}
      </span>
    </div>
  )
}

export const displayName = (c: Clinician, index: number) =>
  c.name ?? `Clinician profile ${index + 1}`

function Row({
  icon,
  label,
  step,
  children,
}: {
  icon: ReactNode
  label: string
  step: number
  children: ReactNode
}) {
  return (
    <div
      data-step
      style={{ ["--d" as string]: `${step}ms` }}
      className="grid gap-1 border-t border-line py-4 sm:grid-cols-[13rem_1fr] sm:gap-6"
    >
      <dt className="flex items-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-muted">
        <span className="text-brand" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  )
}

const Pending = () => <span className="text-muted italic">To be supplied</span>

const List = ({ items }: { items: string[] }) =>
  items.length === 1 ? (
    <>{items[0]}</>
  ) : (
    <ul className="space-y-1">
      {items.map((q) => (
        <li key={q}>{q}</li>
      ))}
    </ul>
  )

/**
 * Editorial clinician profile with a one-time, sequential introduction.
 * All text is in the HTML from the start; CSS only animates its presentation.
 */
export default function ClinicianProfile({
  c,
  index,
  priority,
}: {
  c: Clinician
  index: number
  priority: boolean
}) {
  // Plays once when the profile scrolls into view (no timed fallback, so it isn't spent off-screen).
  const ref = useReveal<HTMLElement>(null)
  const ph = !!c.placeholder
  const name = displayName(c, index)
  const flip = index % 2 === 1
  const related = c.relatedServiceSlugs.map(getService).filter((s) => !!s)
  const registration = [c.registrationBody, c.registrationNumber]
    .filter(Boolean)
    .join(" · ")

  // Delays (ms): portrait 0, name 150, role 450, then rows every 140ms.
  let step = 650
  const next = () => (step += 140) - 140

  return (
    <article
      ref={ref}
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className="intro-seq scroll-mt-28 border-t border-line py-14 first:border-t-0 md:py-20"
    >
      <div className="grid-layout items-start gap-y-8">
        <figure
          data-step
          data-portrait
          style={{ ["--d" as string]: "0ms" }}
          className={`relative col-span-4 mx-auto w-full max-w-[360px] md:col-span-4 md:max-w-none lg:col-span-5 ${
            flip ? "md:order-2 md:col-start-5 lg:col-start-8" : ""
          }`}
        >
          <ArchLine className="absolute -top-6 left-0 h-40 w-full opacity-80 md:-left-6 md:w-[calc(100%+3rem)]" />
          <div className="arch-top relative aspect-[4/5] overflow-hidden bg-pale">
            {c.portrait ? (
              <img
                src={c.portrait.src}
                width={c.portrait.width}
                height={c.portrait.height}
                alt={c.portraitAlt ?? `Portrait of ${name}`}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : undefined}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 360px"
                className="h-full w-full object-cover"
              />
            ) : (
              <PortraitPlaceholder />
            )}
          </div>
        </figure>

        <div
          className={`col-span-4 md:col-span-4 lg:col-span-7 ${
            flip ? "md:order-1 lg:col-span-6 lg:col-start-1" : "lg:pl-8"
          }`}
        >
          {ph && (
            <p
              data-step
              style={{ ["--d" as string]: "100ms" }}
              className="mb-4 inline-flex rounded-[6px] border border-[#ecd9b4] bg-[#fdf6e9] px-3 py-1.5 text-[0.8rem] font-semibold text-[#5c4a26]"
            >
              Placeholder profile — awaiting approved clinician details
            </p>
          )}
          <h2
            id={`${c.slug}-name`}
            data-step
            data-type
            style={{ ["--d" as string]: "150ms" }}
            className="h2 text-ink"
          >
            {c.name ?? (
              <span className="text-muted">Clinician name to be supplied</span>
            )}
          </h2>
          <p
            data-step
            style={{ ["--d" as string]: "450ms" }}
            className="mt-2 text-[1.05rem] font-semibold text-brand"
          >
            {c.role ??
              (ph ? (
                <span className="font-normal text-muted italic">
                  Role to be supplied
                </span>
              ) : null)}
          </p>

          <dl className="mt-8 border-b border-line">
            {(ph || c.qualifications.length > 0) && (
              <Row
                icon={<Check size={18} />}
                label="Qualifications"
                step={next()}
              >
                {c.qualifications.length ? (
                  <List items={c.qualifications} />
                ) : (
                  <Pending />
                )}
              </Row>
            )}
            {(ph || c.clinicalFocus.length > 0) && (
              <Row
                icon={<Tooth size={18} />}
                label="Areas of clinical focus"
                step={next()}
              >
                {c.clinicalFocus.length ? (
                  <List items={c.clinicalFocus} />
                ) : (
                  <Pending />
                )}
              </Row>
            )}
            {(ph || c.experienceText) && (
              <Row icon={<Clock size={18} />} label="Experience" step={next()}>
                {c.experienceText ?? <Pending />}
              </Row>
            )}
            {(ph || registration) && (
              <Row icon={<Leaf size={18} />} label="Registration" step={next()}>
                {registration || <Pending />}
              </Row>
            )}
          </dl>

          {c.bio && (
            <p
              data-step
              style={{ ["--d" as string]: `${next()}ms` }}
              className="mt-6 max-w-[62ch] text-muted"
            >
              {c.bio}
            </p>
          )}

          {(c.approachToCare || ph) && (
            <div
              data-step
              style={{ ["--d" as string]: `${next()}ms` }}
              className="mt-8 max-w-[62ch] border-l-2 border-brand/40 pl-5"
            >
              <h3 className="font-serif text-[1.6rem] leading-tight text-ink">
                My approach to care
              </h3>
              {c.approachToCare ? (
                <p className="mt-2 text-ink">{c.approachToCare}</p>
              ) : (
                <p className="mt-2 text-muted italic">
                  Placeholder: a short, clinician-approved note (about 40–70
                  words) will appear here.
                </p>
              )}
            </div>
          )}

          <div
            data-step
            style={{ ["--d" as string]: `${next()}ms` }}
            className="mt-8"
          >
            {related.length > 0 && (
              <p className="text-[0.95rem] text-muted">
                Explore related treatments:{" "}
                {related.map((s, i) => (
                  <span key={s!.slug}>
                    {i > 0 && ", "}
                    <Link
                      to={`/services/${s!.slug}/`}
                      className="inline-flex min-h-[44px] items-center font-semibold text-action underline-offset-4 hover:underline"
                    >
                      {s!.name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
            {ph && related.length === 0 && (
              <p className="text-[0.92rem] text-muted">
                Related treatments will be linked once the clinician’s areas of
                focus are confirmed.
              </p>
            )}
            <div className="mt-4">
              {c.name ? (
                <WhatsAppCTA
                  label={`Request an appointment with ${c.name}`}
                  message={clinicianMessage(c.name)}
                  arrow
                />
              ) : (
                <p className="max-w-md rounded-[8px] border border-dashed border-[#b8cbd1] bg-surface px-4 py-3 text-[0.9rem] text-muted">
                  Requests for a named clinician will be available once this
                  profile is complete. You can still{" "}
                  <Link
                    to="/contact/"
                    className="font-semibold text-action underline"
                  >
                    contact the clinic
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
