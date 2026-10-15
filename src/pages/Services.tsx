import { useMemo, useState } from "react"
import FAQAccordion from "../components/FAQAccordion"
import {
  ArrowRight,
  Check,
  Clock,
  Mail,
  Phone,
  Pin,
  Tooth,
} from "../components/Icons"
import ToothIllustration from "../components/ToothIllustration"
import WhatsAppCTA from "../components/WhatsAppCTA"
import {
  categories,
  clinic,
  images,
  pricing,
  services,
  type Category,
  type Service,
} from "../config/site"
import { servicesPageFaqs } from "../config/servicesPage"
import { Link } from "../lib/router"
import { srcSet } from "../lib/images"
import { formatFee } from "../lib/whatsapp"
import "./services.css"

type Filter = Category | "all" | "alignment"
const alignmentSlugs = new Set(["clear-aligners", "braces-and-alignment"])
const filters: { id: Filter ; label: string }[] = [
  ...categories.map((c) => ({ ...c, label: c.id === "all" ? "All" : c.label })),
  { id: "alignment", label: "Alignment" },
]
const matches = (s: Service, filter: Filter) =>
  filter === "all" ||
  (filter === "alignment" ? alignmentSlugs.has(s.slug) : s.category === filter)
const feeLabel = (s: Service) =>
  pricing.currency
    ? formatFee(s.fee)
    : `${s.fee.from ? "From " : ""}${s.fee.amount} — currency to be confirmed`

function TreatmentCard({ service: s }: { service: Service }) {
  return (
    <li className="services-card">
      {s.image && (
        <figure className="services-card-image">
          <img
            src={s.image}
            srcSet={srcSet(s.image)}
            sizes="(min-width: 1200px) 400px, (min-width: 640px) 45vw, 72px"
            alt={
              s.image.startsWith("https://images.unsplash.com/")
                ? "Illustrative dental care environment"
                : s.imageAlt || s.name
            }
            width={s.imageWidth || 1200}
            height={s.imageHeight || 900}
            loading="lazy"
          />
          {s.image.startsWith("https://images.unsplash.com/") && (
            <figcaption>Concept imagery</figcaption>
          )}
        </figure>
      )}
      <div className="services-card-body">
        <div className="services-card-title">
          <ToothIllustration
            variant={s.slug === "dental-implants" ? "implant" : s.category}
            className="services-tooth"
          />
          <div>
            <p className="services-category">
              {categories.find((c) => c.id === s.category)?.label}
            </p>
            <h3>
              <Link to={`/services/${s.slug}/`}>{s.name}</Link>
            </h3>
          </div>
        </div>
        <p className="services-summary">{s.summary}</p>
        {s.fee.amount !== null && (
          <p className="services-price">{feeLabel(s)}</p>
        )}
        <Link
          to={`/services/${s.slug}/`}
          className="text-link"
          aria-label={`${s.name}: overview and fees`}
        >
          View treatment <ArrowRight size={16} />
        </Link>
        <WhatsAppCTA
          label="Request appointment"
          treatment={s.name}
          showIcon={false}
          variant="secondary"
          className="services-card-book"
        />
        {(s.fee.basis || s.included.length > 0 || s.additional.length > 0) && (
          <details className="services-inclusions">
            <summary>
              Estimate details<span className="sr-only"> for {s.name}</span>
            </summary>
            <div>
              {s.fee.basis && (
                <p>
                  <strong>Pricing basis:</strong> {s.fee.basis}
                </p>
              )}
              {s.included.length > 0 && (
                <>
                  <h4>What is included</h4>
                  <ul>
                    {s.included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {s.additional.length > 0 && (
                <>
                  <h4>Possible additional care</h4>
                  <ul>
                    {s.additional.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              <Link to={`/services/${s.slug}/`} className="text-link">
                Full treatment details <ArrowRight size={15} />
              </Link>
            </div>
          </details>
        )}
      </div>
    </li>
  )
}

export default function Services() {
  const [filter, setFilter] = useState<Filter>("all")
  const shown = useMemo(
    () => services.filter((s) => matches(s, filter)),
    [filter],
  )
  const activeLabel = filters.find((c) => c.id === filter)?.label
  const address = [clinic.address, clinic.city].filter(Boolean).join(", ")
  return (
    <div className="services-page">
      <section className="services-hero" aria-labelledby="services-title">
        <div className="services-shell services-hero-grid">
          <div>
            <p className="eyebrow">Care for every stage of life</p>
            <h1 id="services-title">
              Dental treatments in Lahore, explained clearly.
            </h1>
            <p className="services-lead">
              From prevention to restorative treatment, we’re here to help you
              understand your options and feel confident in your next step.
            </p>
            <WhatsAppCTA label="Request a consultation" arrow />
            <a href="#treatments" className="text-link">
              Explore all {services.length} treatments <ArrowRight size={16} />
            </a>
          </div>
          <figure className="services-hero-image">
            <img
              src={images.clinicRoom2}
              srcSet={srcSet(images.clinicRoom2)}
              sizes="(min-width: 1200px) 640px, (min-width: 768px) 50vw, 100vw"
              alt="Illustrative bright dental treatment chair and operatory room; not a photograph of our clinic"
              width={1200}
              height={900}
              fetchPriority="high"
            />
            <figcaption>Concept imagery</figcaption>
          </figure>
        </div>
      </section>

      <section
        id="treatments"
        className="services-section services-collection"
        aria-labelledby="list-title"
      >
        <div className="services-shell">
          <div className="services-section-heading">
            <div>
              <p className="eyebrow">Our dental services</p>
              <h2 id="list-title">Find the care your smile needs.</h2>
            </div>
            <p>
              Explore our complete range of preventive, restorative, and
              aesthetic dental treatments designed for long-term oral health.
            </p>
          </div>
          <details className="services-overview">
            <summary>
              What dental treatments and services are offered at DADC?
            </summary>
            <p data-geo-answer="true">
              Dr Ali Dental Centre provides modern dentistry with gentle care
              across preventive, restorative, and cosmetic disciplines—including
              scaling &amp; polishing, extractions, composite fillings, crowns
              &amp; bridges, removable dentures, veneers, dental implants, clear
              aligners, braces, RCT (root canal treatment), and teeth whitening.
              Every treatment begins with a thorough examination and transparent
              fee disclosure.
            </p>
          </details>
          <div className="services-filter-bar">
            <div
              role="group"
              aria-label="Filter treatments by category"
              className="services-filters"
            >
              {filters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={filter === c.id}
                  aria-controls="treatment-results"
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                  <span>
                    {" "}
                    ({services.filter((s) => matches(s, c.id)).length})
                  </span>
                </button>
              ))}
            </div>
            <p role="status" aria-live="polite" aria-atomic="true">
              Showing {shown.length}{" "}
              {shown.length === 1 ? "treatment" : "treatments"}
              {filter !== "all" ? ` in ${activeLabel}` : ""}
            </p>
            {filter !== "all" && (
              <button
                type="button"
                className="text-link"
                onClick={() => setFilter("all")}
              >
                Clear filter
              </button>
            )}
          </div>
          <div id="treatment-results">
            {shown.length ? (
              <ul className="services-grid">
                {shown.map((s) => (
                  <TreatmentCard key={s.slug} service={s} />
                ))}
              </ul>
            ) : (
              <div className="services-empty">
                <h3>No treatments in this category yet.</h3>
                <p>Choose another category or browse all treatments.</p>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setFilter("all")}
                >
                  Show all treatments
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="services-section services-estimate"
        aria-labelledby="fees-title"
      >
        <div className="services-shell">
          <div className="services-section-heading">
            <div>
              <p className="eyebrow">Fees and transparent pricing</p>
              <h2 id="fees-title">Understand your treatment estimate.</h2>
            </div>
            <p>{pricing.note}</p>
          </div>
          <div className="services-estimate-grid">
            <article>
              <span className="services-step-icon">
                <Tooth />
              </span>
              <h3>1. Clinical assessment</h3>
              <p>
                Every treatment begins with a thorough examination and
                transparent fee disclosure.
              </p>
            </article>
            <article>
              <span className="services-step-icon">
                <Check />
              </span>
              <h3>2. What is included</h3>
              <p>
                Explore the pricing basis and inclusions in each treatment’s
                estimate details above.
              </p>
            </article>
            <article>
              <span className="services-step-icon">
                <Tooth />
              </span>
              <h3>3. Additional care</h3>
              <p>
                Additional charges for each treatment are listed on its detail
                page.
              </p>
            </article>
            <article>
              <span className="services-step-icon">
                <Check />
              </span>
              <h3>4. Your estimate</h3>
              <p>
                Your plan and estimate are explained before any treatment
                begins.
              </p>
            </article>
          </div>
          <details className="services-fee-note">
            <summary>How much does dental treatment cost at DADC?</summary>
            <p>{servicesPageFaqs[1].answer}</p>
            <p>Currency: {pricing.currency ?? "to be confirmed"}.</p>
          </details>
        </div>
      </section>

      <section
        className="services-section services-guidance"
        aria-labelledby="consult-title"
      >
        <div className="services-shell services-guidance-grid">
          <div>
            <p className="eyebrow">Ready to get started?</p>
            <h2 id="consult-title">How do I book a dental consultation?</h2>
            <p>
              Not sure where to begin? Tell us about your concern and the team
              will help you choose the right first appointment.
            </p>
            <WhatsAppCTA label="Request a consultation" arrow />
          </div>
          <figure>
            <img
              src={images.clinicRoom2}
              srcSet={srcSet(images.clinicRoom2)}
              sizes="(min-width: 1200px) 600px, (min-width: 768px) 45vw, 100vw"
              width={1200}
              height={900}
              alt="Illustrative dental treatment room"
              loading="lazy"
            />
            <figcaption>Concept imagery</figcaption>
          </figure>
        </div>
      </section>

      <section
        className="services-section services-faq"
        aria-labelledby="faq-title"
      >
        <div className="services-shell">
          <p className="eyebrow">Frequently asked questions</p>
          <h2 id="faq-title">Frequently asked questions about dental visits</h2>
          <FAQAccordion items={servicesPageFaqs} />
        </div>
      </section>

      <section
        className="services-section services-visit"
        aria-labelledby="visit-title"
      >
        <div className="services-shell services-visit-grid">
          <div>
            <p className="eyebrow">Visit our clinic</p>
            <h2 id="visit-title">Find us at Galaxy Mall, Airport Road.</h2>
            <dl>
              <div>
                <Pin />
                <div>
                  <dt>Address</dt>
                  <dd>{address}</dd>
                </div>
              </div>
              <div>
                <Clock />
                <div>
                  <dt>Opening hours</dt>
                  <dd>
                    {clinic.openingHours?.map((h) => (
                      <p key={h.days}>
                        {h.days}
                        <br />
                        {h.hours}
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
          </div>
          <div className="services-directions">
            <Pin size={36} />
            <h3>Plan your visit.</h3>
            <p>{address}</p>
            {clinic.mapUrl && (
              <a
                href={clinic.mapUrl}
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions <ArrowRight size={17} />
                <span className="sr-only">
                  {" "}
                  (opens Google Maps in a new tab)
                </span>
              </a>
            )}
            <Link to="/contact/" className="text-link">
              Contact the clinic <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="services-closing" aria-label="Request a consultation">
        <div className="services-shell">
          <div>
            <h2>Ready to take the next step?</h2>
            <p>
              Request a consultation on WhatsApp. Your appointment is confirmed
              only when the clinic agrees a time with you.
            </p>
          </div>
          <WhatsAppCTA label="Request a consultation" arrow />
        </div>
      </section>
    </div>
  )
}
