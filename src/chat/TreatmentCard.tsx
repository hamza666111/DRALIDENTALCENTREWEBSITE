import { getService } from "../config/site"
import { Link } from "../lib/router"
import {
  appointmentMessage,
  buildWhatsAppUrl,
  formatFee,
} from "../lib/whatsapp"
import { ArrowRight } from "../components/Icons"

/** Reusable treatment summary, built only from real configured services and routes. */
export default function TreatmentCard({
  slug,
  onNavigate,
}: {
  slug: string
  onNavigate?: () => void
}) {
  const s = getService(slug)
  if (!s) return null
  const wa = buildWhatsAppUrl(appointmentMessage(s.name))
  return (
    <article className="rounded-[10px] border border-line bg-surface p-4">
      <h3 className="font-serif text-[1.3rem] leading-tight text-ink">
        {s.name}
      </h3>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">
        {s.summary}
      </p>
      <p className="mt-2 text-[0.85rem]">
        <span className="text-muted">Fee: </span>
        <span className="font-semibold text-action">{formatFee(s.fee)}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4">
        <Link
          to={`/services/${s.slug}/`}
          onClick={onNavigate}
          className="text-link !text-[0.88rem]"
        >
          View treatment<span className="sr-only">: {s.name}</span>{" "}
          <ArrowRight size={15} />
        </Link>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link !text-[0.88rem]"
          >
            Ask the clinic
            <span className="sr-only">
              {" "}
              about {s.name} on WhatsApp (opens in new tab)
            </span>
          </a>
        )}
      </div>
    </article>
  )
}
