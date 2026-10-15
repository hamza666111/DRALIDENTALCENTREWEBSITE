import { clinic, integrations } from "../config/site"
import { Clock, Pin, Phone, Mail, ArrowRight } from "./Icons"
export default function VisitDetails({ map = false }: { map?: boolean }) {
  const directions = clinic.mapUrl || integrations.directionsUrl
  return (
    <div className="visit-card">
      <p className="eyebrow">Visit our clinic</p>
      <h2 className="h3 mt-3">Our location in Lahore</h2>
      <dl className="visit-list">
        <div>
          <Pin />
          <div>
            <dt>Clinic address</dt>
            <dd>
              {[clinic.address, clinic.city, clinic.postcode]
                .filter(Boolean)
                .join(", ")}
            </dd>
          </div>
        </div>
        <div>
          <Clock />
          <div>
            <dt>Opening hours · Pakistan time</dt>
            <dd>
              {clinic.openingHours?.map((h) => (
                <p key={h.days}>
                  {h.days}
                  <br />
                  {h.hours} (PKT, UTC+5)
                </p>
              ))}
            </dd>
          </div>
        </div>
        {clinic.phone && (
          <div>
            <Phone />
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
              </dd>
            </div>
          </div>
        )}
        {clinic.email && (
          <div>
            <Mail />
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              </dd>
            </div>
          </div>
        )}
      </dl>
      {directions && (
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Get directions <ArrowRight size={16} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {map && clinic.mapEmbedUrl && (
        <iframe
          title={`Map showing ${clinic.name}`}
          src={clinic.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="visit-map"
        />
      )}
    </div>
  )
}
