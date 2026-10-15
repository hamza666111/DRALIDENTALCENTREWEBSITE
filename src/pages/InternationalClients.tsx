import { clinic } from "../config/site"
import { international } from "../config/international"
import InternationalForm from "../components/InternationalForm"
import FAQAccordion from "../components/FAQAccordion"
import VisitDetails from "../components/VisitDetails"
const steps = [
  [
    "Tell us your plans",
    "Share your treatment interests, time zone and proposed travel dates.",
  ],
  [
    "Discuss options online",
    "Request an initial discussion with the team before arranging your visit.",
  ],
  [
    "Agree a provisional schedule",
    "Explore appointment options around your stay, subject to assessment.",
  ],
  [
    "Attend assessment & plan follow-up",
    "Agree your treatment plan, estimate and follow-up with your clinician.",
  ],
]
export default function InternationalClients() {
  return (
    <>
      <header className="international-hero">
        <div className="shell feature-grid">
          <div>
            <p className="eyebrow">International clients · Lahore, Pakistan</p>
            <h1 className="display mt-5">
              Plan your dental visit before you travel.
            </h1>
            <p className="lead mt-6">
              Coordinate your visit to {clinic.name} from abroad. Start with an
              online consultation request or plan an appointment for your time
              in Pakistan.
            </p>
            <div className="action-row">
              <a href="#online-consultation" className="btn btn-primary">
                Request online consultation
              </a>
              <a href="#in-clinic-visit" className="btn btn-secondary">
                Plan an in-clinic visit
              </a>
            </div>
            <p className="text-sm text-muted mt-5">
              Final suitability, fees and treatment schedules depend on clinical
              assessment.
            </p>
          </div>
          <div className="travel-art" aria-hidden="true">
            <div className="travel-orbit" />
            <div className="travel-orbit orbit-two" />
            <span className="travel-mark">✦</span>
            <span className="travel-label">
              Your journey.
              <br />
              Our care.<small>Lahore · Pakistan</small>
            </span>
          </div>
        </div>
      </header>
      <section className="section-pad bg-white">
        <div className="shell">
          <p className="eyebrow">How it works</p>
          <h2 className="h2 mt-3">A simple path to your dental care.</h2>
          <ol className="steps-grid">
            {steps.map(([title, body], i) => (
              <li key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3 className="h3 mt-5">{title}</h3>
                <p className="mt-3 text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-pad">
        <div className="shell international-body">
          <div className="international-information">
            <div className="content-card stay-card">
              <p className="eyebrow">Plan around your stay</p>
              <h2 className="h2 mt-3">Leave room for thoughtful care.</h2>
              <p className="mt-5 text-muted">
                Some treatments require multiple visits, laboratory work,
                healing time and follow-up. The number of visits and timing will
                be discussed individually after assessment.
              </p>
              <p className="mt-4 text-muted">
                Speak with the clinic before committing to a treatment schedule
                around your flights. Coordination here relates to clinic
                appointments.
              </p>
            </div>
            <div className="mt-10">
              <h2 className="h2 mb-6">Before you travel</h2>
              <FAQAccordion items={international.faqs} />
            </div>
          </div>
          <InternationalForm />
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="shell">
          <VisitDetails />
        </div>
      </section>
    </>
  )
}
