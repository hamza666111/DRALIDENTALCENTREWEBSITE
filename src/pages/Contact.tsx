import AppointmentForm from "../components/AppointmentForm"
import VisitDetails from "../components/VisitDetails"
import WhatsAppCTA from "../components/WhatsAppCTA"
import FAQAccordion from "../components/FAQAccordion"
import { Link } from "../lib/router"
import { clinic } from "../config/site"
import { Phone } from "../components/Icons"
const steps = [
  [
    "Send request",
    "Use the form or WhatsApp to tell us what you need and when suits you.",
  ],
  [
    "Team confirms availability",
    "The clinic contacts you to agree a time. Your appointment is only booked once confirmed.",
  ],
  [
    "Attend appointment",
    "Come to the clinic at the agreed time. We look forward to welcoming you.",
  ],
]
const faqs = [
  {
    question: "How do I request an appointment?",
    answer:
      "Use the form, call the clinic or send a WhatsApp message. The team will confirm availability with you. A request alone does not reserve an appointment.",
  },
  {
    question: "Can I change my appointment?",
    answer:
      "Contact the clinic with your appointment details so the team can discuss available alternatives.",
  },
  {
    question: "Can I arrange a consultation before travelling?",
    answer:
      "Use the International Clients page to share your time zone and visit plans, and request an initial online consultation.",
  },
]
export default function Contact() {
  return (
    <>
      <header className="contact-hero">
        <div className="shell">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-4">Let’s plan your visit.</h1>
          <p className="lead mt-5">
            We’re here to help you take the next step towards a healthier,
            brighter smile.
          </p>
          <div className="action-row">
            <WhatsAppCTA label="Chat on WhatsApp" />
            {clinic.phone && (
              <a className="btn btn-secondary" href={`tel:${clinic.phone}`}>
                <Phone size={18} />
                Call the clinic
              </a>
            )}
          </div>
        </div>
      </header>
      <section
        className="shell contact-grid"
        aria-label="Appointment request and clinic details"
      >
        <div id="appointment">
          <AppointmentForm />
        </div>
        <VisitDetails map />
      </section>
      <section className="section-pad bg-white">
        <div className="shell">
          <p className="eyebrow">How it works</p>
          <h2 className="h2 mt-3">Your visit in three simple steps.</h2>
          <ol className="steps-grid three">
            {steps.map(([title, body], i) => (
              <li key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3 className="h3 mt-4">{title}</h3>
                <p className="text-muted mt-3">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-pad">
        <div className="shell two-grid">
          <div className="international-callout">
            <p className="eyebrow">International clients</p>
            <h2 className="h2 mt-3">Visiting from abroad?</h2>
            <p className="mt-4">
              Discuss your dental care before travelling and coordinate
              appointments around your visit to Pakistan.
            </p>
            <Link className="btn btn-light mt-6" to="/international-clients/">
              Plan your visit →
            </Link>
          </div>
          <div>
            <p className="eyebrow">Before you get in touch</p>
            <h2 className="h2 mt-3 mb-6">Common questions.</h2>
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  )
}
