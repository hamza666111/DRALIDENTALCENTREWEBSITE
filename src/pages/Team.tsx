import BookingPanel from "../components/BookingPanel"
import ClinicianProfile, { displayName } from "../components/ClinicianProfile"
import PageIntro from "../components/PageIntro"
import { images } from "../config/site"
import { visibleClinicians } from "../lib/clinicians"
import { ArrowRight } from "../components/Icons"
export default function Team() {
  const team = visibleClinicians()
  return (
    <>
      <PageIntro
        eyebrow="The people behind your care"
        title="Meet your dental team in Lahore."
        intro="Get to know our clinicians, their qualifications and the areas of care they focus on."
        media={
          <nav className="team-directory" aria-label="Jump to a clinician">
            {team.map((c, i) => (
              <a key={c.id} href={`#${c.slug}`}>
                {c.portrait && (
                  <img src={c.portrait.src} width={64} height={64} alt="" />
                )}
                <span>
                  <strong>{displayName(c, i)}</strong>
                  <small>{c.role}</small>
                </span>
                <ArrowRight size={18} />
              </a>
            ))}
          </nav>
        }
      />
      <section
        className="shell clinician-profiles"
        aria-label="Clinician profiles"
      >
        {team.length ? (
          team.map((c, i) => (
            <ClinicianProfile key={c.id} c={c} index={i} priority={i === 0} />
          ))
        ) : (
          <div className="empty-panel">
            <h2 className="h2">Meet the team soon.</h2>
            <p>Clinician profiles will appear once approved by the clinic.</p>
          </div>
        )}
      </section>
      <BookingPanel
        eyebrow="Choosing an appointment"
        title="Not sure who to book with?"
        body="Tell us what you need, and our team can help you arrange the right appointment."
        ctaLabel="Ask the clinic on WhatsApp"
        image={images.waiting}
        imageAlt="Illustrative patient reception area"
        imageWidth={1000}
        imageHeight={750}
      />
    </>
  )
}
