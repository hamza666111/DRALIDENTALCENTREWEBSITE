import { clinic } from "../config/site"
import { Link, useRouter } from "../lib/router"
import { appointmentMessage, buildWhatsAppUrl } from "../lib/whatsapp"
import { Phone, WhatsApp } from "./Icons"

export default function MobileBookingBar({
  treatment,
}: {
  treatment?: string
}) {
  const { path } = useRouter()
  const whatsapp = buildWhatsAppUrl(appointmentMessage(treatment))
  const book =
    path === "/"
      ? "/#home-booking"
      : path === "/international-clients/"
        ? "/international-clients/#online-consultation"
        : "/contact/#appointment"
  return (
    <nav
      aria-label="Quick appointment actions"
      className="booking-bar unified-booking"
    >
      {clinic.phone && (
        <a href={`tel:${clinic.phone}`}>
          <Phone size={20} />
          <span>Call</span>
        </a>
      )}
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          <WhatsApp size={20} />
          <span>
            WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </span>
        </a>
      )}
      <Link to={book}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 2v6m10-6v6M3 11h18" />
        </svg>
        <span>Book visit</span>
      </Link>
    </nav>
  )
}
