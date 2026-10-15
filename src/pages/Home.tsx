import { useEffect } from "react"
import ArchLine from "../components/ArchLine"
import ArticleCard from "../components/ArticleCard"
import AppointmentForm from "../components/AppointmentForm"
import BeforeAfter from "../components/BeforeAfter"
import FAQAccordion from "../components/FAQAccordion"
import {
  ArrowRight,
  Clock,
  Heart,
  Leaf,
  Mail,
  Phone,
  Pin,
  Tooth,
} from "../components/Icons"
import WhatsAppCTA from "../components/WhatsAppCTA"
import {
  cases,
  clinic,
  images,
  pricing,
  reviews,
  services,
} from "../config/site"
import { Link } from "../lib/router"
import { visibleArticles } from "../lib/articles"
import ContentStatus from "../components/ContentStatus"
import { publishedClinicians } from "../lib/clinicians"
import { srcSet } from "../lib/images"
import "./home.css"

const reassurance = [
  {
    icon: Heart,
    title: "A calm, welcoming visit",
    body: "Time to settle in, ask questions and go at a pace that suits you.",
  },
  {
    icon: Tooth,
    title: "Care that fits you",
    body: "Options explained clearly, so decisions about treatment stay yours.",
  },
  {
    icon: Leaf,
    title: "Focused on the long term",
    body: "Preventive, restorative and cosmetic care with lasting oral health in mind.",
  },
]
const steps = [
  {
    title: "Send a request",
    body: "Message us on WhatsApp with what you need and times that may suit you.",
  },
  {
    title: "Discuss your needs",
    body: "Our team replies to understand your concern and suggest the right type of visit.",
  },
  {
    title: "Confirm your appointment",
    body: "Once a time is agreed, the clinic confirms your appointment with you directly.",
  },
]
const featuredSlugs = [
  "scaling-and-polishing",
  "dental-implants",
  "braces-and-alignment",
  "rct-root-canal",
  "crowns-and-bridges",
  "teeth-whitening",
]
const address = [clinic.address, clinic.city].filter(Boolean).join(", ")
// Optimized copies of the existing portraits; new content still uses its supplied image.
const portraitWidths: Record<string, number> = {
  "/team/dr-ali-azhar.png": 365,
  "/team/dr-maria-khan.png": 477,
  "/team/dr-usman-tariq.png": 477,
}
function portraitSources(src: string) {
  const width = portraitWidths[src]
  if (!width) return { src }
  const base = src.replace("/team/", "/team/home/").replace(".png", "")
  return {
    src: `${base}-${width}.webp`,
    srcSet: `${base}-160.webp 160w, ${base}-${width}.webp ${width}w`,
    sizes: "(max-width: 767px) 72px, (max-width: 1199px) 30vw, 400px",
  }
}
const faqs = [
  { question: "Where is the clinic?", answer: address },
  {
    question: "How do I request an appointment?",
    answer:
      "Message us on WhatsApp with what you need and times that may suit you. Once a time is agreed, the clinic confirms your appointment with you directly.",
  },
  {
    question: "Who can I contact before travelling?",
    answer:
      "Contact the clinic on WhatsApp to discuss your needs and preferred dates before planning your visit.",
  },
  { question: "How are treatment fees confirmed?", answer: pricing.note },
]
function Directions() {
  return clinic.mapUrl ? (
    <a
      href={clinic.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      Get directions <ArrowRight size={17} />
      <span className="sr-only"> (Google Maps, opens in a new tab)</span>
    </a>
  ) : null
}
export default function Home() {
  useEffect(() => {
    // Keep floating controls away from the form and accordion touch targets.
    const section = document.querySelector(".home-booking-section")
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle(
        "home-booking-visible",
        entry.isIntersecting,
      )
    })
    observer.observe(section)
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove("home-booking-visible")
    }
  }, [])
  const featured = featuredSlugs.flatMap((slug) =>
    services.filter((s) => s.slug === slug),
  )
  const remaining = services.filter((s) => !featuredSlugs.includes(s.slug))
  const team = publishedClinicians().sort(
    (a, b) => a.displayOrder - b.displayOrder,
  )
  const articles = visibleArticles()
  const consentedCases = cases.filter((c) => c.consentConfirmed)
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-shell home-hero-grid">
          <div className="home-hero-copy">
            <h1 id="hero-title">
              <span className="home-h1-context">Dental care in Lahore</span>Feel
              at ease.
              <br />
              Smile with confidence.
            </h1>
            <p className="home-lead">
              Tell us what you need. We’ll help you understand your options and
              plan your next visit.
            </p>
            <div className="home-actions">
              <a href="#home-booking" className="btn btn-primary">
                Request an appointment <ArrowRight size={18} />
              </a>
              <WhatsAppCTA variant="secondary" label="Chat on WhatsApp" />
            </div>
            <Link to="/services/" className="text-link home-explore">
              Explore treatments <ArrowRight size={16} />
            </Link>
          </div>
          <figure className="home-hero-media">
            <img
              src={images.clinicRoom}
              srcSet={srcSet(images.clinicRoom)}
              sizes="(min-width: 1200px) 620px, (min-width: 768px) 50vw, 100vw"
              width={1600}
              height={1200}
              fetchPriority="high"
              alt="Illustrative bright dental treatment room; not a photograph of our clinic"
            />
            <figcaption>
              Concept imagery — to be replaced with clinic photography
            </figcaption>
          </figure>
        </div>
      </section>
      <ContentStatus />
      <section
        className="home-location"
        aria-label="Clinic location and opening hours"
      >
        <div className="home-shell home-location-grid">
          <div>
            <Pin />
            <p>{address}</p>
          </div>
          <div>
            <Clock />
            <div>
              {clinic.openingHours?.map((h) => (
                <p key={h.days}>
                  {h.days}
                  <br />
                  <span>{h.hours}</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <Directions />
          </div>
        </div>
      </section>
      <section
        className="home-section home-treatments"
        aria-labelledby="treatments-title"
      >
        <div className="home-shell">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow">Our treatments</p>
              <h2 id="treatments-title">Find the right care for your smile.</h2>
              <p className="home-section-intro">
                A considered range of dental care.
              </p>
            </div>
            <Link to="/services/" className="text-link">
              Explore all {services.length} treatments <ArrowRight size={16} />
            </Link>
          </div>
          <div className="home-treatment-grid">
            {featured.map((s) => (
              <article key={s.slug} className="home-treatment-card">
                {s.image && (
                  <div className="home-treatment-media">
                    <img
                      src={s.image}
                      srcSet={srcSet(s.image)}
                      sizes="(min-width: 1200px) 380px, (min-width: 640px) 45vw, 1px"
                      alt="Illustrative dental care environment"
                      width={s.imageWidth || 1200}
                      height={s.imageHeight || 900}
                      loading="lazy"
                    />
                    <span>Illustrative image</span>
                  </div>
                )}
                <div className="home-treatment-copy">
                  <span className="home-icon">
                    <Tooth size={26} />
                  </span>
                  <div>
                    <h3>
                      <Link to={`/services/${s.slug}/`}>{s.name}</Link>
                    </h3>
                    <p>{s.summary}</p>
                    <Link
                      to={`/services/${s.slug}/`}
                      className="text-link"
                      aria-label={`View treatment: ${s.name}`}
                    >
                      View treatment <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {remaining.length > 0 && (
            <div className="home-more-treatments">
              <h3>More ways to care for your smile</h3>
              <div>
                {remaining.map((s) => (
                  <article key={s.slug}>
                    <Tooth size={22} />
                    <div>
                      <h4>
                        <Link to={`/services/${s.slug}/`} className="text-link">
                          {s.name} <ArrowRight size={16} />
                        </Link>
                      </h4>
                      <p>{s.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
          <Link to="/services/" className="text-link home-all-treatments">
            View all treatments and fees <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      {team.length > 0 && (
        <section
          className="home-section home-team"
          aria-labelledby="team-title"
        >
          <div className="home-shell">
            <div className="home-section-heading">
              <div>
                <p className="eyebrow">Our team</p>
                <h2 id="team-title">Meet the people behind your care.</h2>
              </div>
              <Link to="/team/" className="text-link">
                Meet our team <ArrowRight size={16} />
              </Link>
            </div>
            <div className="home-team-grid">
              {team.map((c) => (
                <article key={c.id} className="home-team-card">
                  {c.portrait && (
                    <img
                      {...portraitSources(c.portrait.src)}
                      alt={c.portraitAlt || c.name || ""}
                      width={c.portrait.width}
                      height={c.portrait.height}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h3>
                      <Link to={`/team/#${c.slug}`}>{c.name}</Link>
                    </h3>
                    {c.role && <p className="home-team-role">{c.role}</p>}
                    <p className="home-team-focus">{c.clinicalFocus[0]}</p>
                    <Link
                      to={`/team/#${c.slug}`}
                      className="text-link"
                      aria-label={`View profile: ${c.name}`}
                    >
                      View profile <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section
        className="home-international"
        aria-labelledby="international-title"
      >
        <div className="home-shell home-international-grid">
          <div>
            <p className="eyebrow">International clients</p>
            <h2 id="international-title">
              Visiting Pakistan?
              <br />
              Plan your dental care before you travel.
            </h2>
            <p>
              Contact our Lahore clinic to discuss your dental needs and
              preferred dates before planning your visit.
            </p>
            <div className="home-actions">
              <Link
                to="/international-clients/#online-consultation"
                className="btn btn-light"
              >
                Request online consultation
              </Link>
              <Link
                to="/international-clients/#in-clinic-visit"
                className="btn home-outline-light"
              >
                Plan a visit <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="home-globe" aria-hidden="true">
            <svg viewBox="0 0 440 340" fill="none">
              <circle cx="245" cy="190" r="142" />
              <ellipse cx="245" cy="190" rx="68" ry="142" />
              <ellipse cx="245" cy="190" rx="117" ry="142" />
              <ellipse cx="245" cy="190" rx="142" ry="52" />
              <ellipse cx="245" cy="190" rx="142" ry="105" />
              <path d="M103 190h284M245 48v284" />
              <path
                className="home-flight-path"
                d="M35 104C150-55 370 20 294 170"
              />
              <circle className="home-globe-dot" cx="294" cy="170" r="6" />
              <text x="307" y="175">
                LAHORE
              </text>
              <path
                className="home-plane"
                d="m41 102-23-6 4-5 15 1 9-15 5 1-4 17 11 7-1 4-14-3-8 6-4-2z"
              />
            </svg>
          </div>
        </div>
      </section>
      <section className="home-section home-care" aria-labelledby="care-title">
        <div className="home-shell">
          <div className="home-care-intro">
            <p className="eyebrow">Clinic Overview &amp; Care Philosophy</p>
            <h2 id="care-title">Care that puts you at ease.</h2>
            <p data-geo-answer="true">
              Dr Ali Dental Centre provides modern dentistry with gentle care
              across preventive, restorative, and cosmetic oral care in Lahore.
              Located at Galaxy Mall on Airport Road, we offer transparent fee
              estimates, unhurried consultations, and patient-first treatment.
            </p>
          </div>
          <ul className="home-reassurance">
            {reassurance.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="home-section home-booking-section"
        aria-label="Plan and request your appointment"
      >
        <div className="home-shell home-booking-grid">
          <div className="home-steps">
            <p className="eyebrow">How to book</p>
            <h2>A clearer path to your next appointment.</h2>
            <p className="home-section-intro">
              From your first message to your visit, we keep things simple and
              supportive.
            </p>
            <ol>
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span>{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <WhatsAppCTA label="Send a request on WhatsApp" />
          </div>
          <div className="home-faq">
            <p className="eyebrow">Before you book</p>
            <h2>Common questions.</h2>
            <FAQAccordion items={faqs} />
          </div>
          <section className="home-visit" aria-labelledby="visit-title">
            <p className="eyebrow">Plan your visit</p>
            <h2 id="visit-title">Practical details, in one place.</h2>
            <p>
              Visit our Lahore clinic at Galaxy Mall, Airport Road, or get in
              touch on WhatsApp.
            </p>
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
              <div>
                <Pin />
                <Directions />
              </div>
            </dl>
          </section>
          <div id="home-booking" className="home-form" tabIndex={-1}>
            <AppointmentForm />
          </div>
        </div>
      </section>
        <section className="home-section" aria-labelledby="stories-title">
          <div className="home-shell">
            <p className="eyebrow">Patient stories</p>
            <h2 id="stories-title">
              Real experiences, shared with permission.
            </h2>
            <p>
              We only publish genuine reviews and cases with documented patient
              consent.
            </p>
            <div className="home-stories-grid">
              {reviews.map((r, i) => (
                <figure key={`${r.author}-${i}`}>
                  <blockquote>{r.text}</blockquote>
                  <figcaption>
                    {r.author} · {r.source} · <time>{r.date}</time>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                      >
                        View original <ArrowRight size={16} />
                      </a>
                    )}
                  </figcaption>
                </figure>
              ))}
              {reviews.length === 0 && (
                <article>
                  <h3 className="font-serif text-xl">Patient reviews to add</h3>
                  <p className="mt-2">No genuine patient reviews are on the website yet. Add reviews with permission and their original source.</p>
                  <Link to="/reviews/" className="text-link mt-4 inline-flex">View review page →</Link>
                </article>
              )}
              {consentedCases.map((c) => (
                <article key={c.title}>
                  <h3>{c.title}</h3>
                  <p>{c.clinician}</p>
                  <BeforeAfter
                    label={c.title}
                    before={{
                      src: c.before,
                      alt: `${c.title}: before treatment`,
                    }}
                    after={{ src: c.after, alt: `${c.title}: after treatment` }}
                  />
                  <p>
                    Results vary.{" "}
                    <Link to="/work/" className="text-link">
                      View cases <ArrowRight size={16} />
                    </Link>
                  </p>
                </article>
              ))}
              {consentedCases.length === 0 && (
                <article>
                  <h3 className="font-serif text-xl">Treatment cases to add</h3>
                  <p className="mt-2">No consented before-and-after cases are on the website yet. Add real images, treatment context and follow-up details.</p>
                  <Link to="/work/" className="text-link mt-4 inline-flex">View case page →</Link>
                </article>
              )}
            </div>
            {reviews.length > 0 && (
              <Link to="/reviews/" className="text-link">
                Read patient reviews <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>

        <section
          className="home-section home-journal"
          aria-labelledby="journal-title"
        >
          <div className="home-shell">
            <div className="home-section-heading">
              <div>
                <p className="eyebrow">Oral-care journal</p>
                <h2 id="journal-title">
                  A little knowledge, a healthier smile.
                </h2>
              </div>
              <Link to="/blog/" className="text-link">
                Browse all articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="home-article-grid">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>

      <section className="home-final-cta" aria-label="Book a visit">
        <div className="home-shell">
          <div>
            <h2>Ready to take the next step?</h2>
            <p>
              Send us a message on WhatsApp to request a visit or ask a
              question. We’re here to help.
            </p>
          </div>
          <div className="home-actions">
            <a href="#home-booking" className="btn btn-primary">
              Request an appointment <ArrowRight size={18} />
            </a>
            <WhatsAppCTA variant="secondary" label="Chat on WhatsApp" />
          </div>
        </div>
      </section>
    </div>
  )
}

export function BookingBand({
  title = "Ready to take the next step?",
  treatment,
}: {
  title?: string
  treatment?: string
}) {
  return (
    <section
      className="relative overflow-hidden bg-brand text-white"
      aria-label="Book a visit"
    >
      <ArchLine
        className="absolute left-1/3 top-0 h-full w-[900px] opacity-30"
        stroke="#ffffff"
      />
      <div className="shell relative flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <h2 className="h2 max-w-[18ch]">{title}</h2>
        <div className="max-w-md">
          <p className="mb-5 text-white/85">
            Send us a message on WhatsApp to request a visit or ask a question.
            We’re here to help.
          </p>
          <WhatsAppCTA variant="light" treatment={treatment} arrow />
        </div>
      </div>
    </section>
  )
}
