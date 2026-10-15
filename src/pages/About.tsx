import VisitDetails from "../components/VisitDetails"
import BookingPanel from "../components/BookingPanel"
import { ArrowRight, Chat, Heart, Tooth } from "../components/Icons"
import PageIntro from "../components/PageIntro"
import Reveal from "../components/Reveal"
import SectionHeading from "../components/SectionHeading"
import WhatsAppCTA from "../components/WhatsAppCTA"
import { images, services } from "../config/site"
import { visibleArticles } from "../lib/articles"
import { visibleClinicians } from "../lib/clinicians"
import {
  displayName,
  PortraitPlaceholder,
} from "../components/ClinicianProfile"
import { Link } from "../lib/router"

const chapters = [
  {
    icon: Chat,
    title: "Listen",
    body: "We take time to understand your needs, concerns and goals before suggesting anything.",
  },
  {
    icon: Tooth,
    title: "Explain",
    body: "We set out your options clearly, including what is involved, so you never feel rushed.",
  },
  {
    icon: Heart,
    title: "Care",
    body: "We provide gentle, careful treatment with your long-term oral health in mind.",
  },
]

export default function About() {
  const team = visibleClinicians()
  const first = visibleArticles().find((a) => a.slug === "first-dental-visit")
  return (
    <>
      <PageIntro
        eyebrow="A modern dental clinic"
        title={
          <>
            Thoughtful dentistry.{" "}
            <span className="text-brand">Personal care.</span>
          </>
        }
        intro="Gentle, considered dental care for healthier smiles and brighter days."
        directAnswer="Dr Ali Dental Centre is dedicated to compassionate, relationship-driven oral health care. Founded by Dr. Ali Azhar, our experienced clinicians deliver personalized treatments with clear communication, modern technology, and unhurried appointments."
        actions={<WhatsAppCTA arrow />}
        media={
          <figure className="group relative">
            <div className="arch-tl overflow-hidden bg-pale">
              <img
                src={images.clinicRoom}
                alt="A bright, modern dental operatory at Dr Ali Dental Centre"
                width={1600}
                height={1200}
                loading="lazy"
                className="zoom-img aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="absolute bottom-3 right-3 rounded-[6px] bg-surface/90 px-2.5 py-1 text-[0.72rem] font-medium text-muted">
              Concept imagery — to be replaced with clinic photos
            </figcaption>
          </figure>
        }
      />

      <section className="py-16 md:py-24" aria-labelledby="story-title">
        <div className="shell grid-layout items-center gap-y-10">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="eyebrow mb-4">Our story</p>
            <h2 id="story-title" className="h2 text-ink">
              Dentistry built around you.
            </h2>
            <p className="mt-5 text-muted">
              Dr. Ali Azhar founded Dr Ali Dental Centre with a vision to make
              world-class dental care accessible, comfortable, and stress-free.
              Combining clinical precision with gentle techniques, our team
              takes time to understand your goals and craft treatment plans that
              feel right for you.
            </p>
            <p className="mt-4 text-muted">
              Joined by specialist orthodontist Dr. Maria Khan, the practice
              delivers patient-centered cosmetic, restorative, and alignment
              care in the heart of Lahore.
            </p>
          </Reveal>
          <Reveal className="group col-span-4 overflow-hidden rounded-[12px] md:col-span-4 lg:col-span-3 lg:col-start-7">
            <img
              src={images.waiting}
              alt="Calm, unhurried patient waiting lounge at DADC Dental Clinic"
              width={1000}
              height={1333}
              loading="lazy"
              className="zoom-img aspect-[3/4] w-full object-cover"
            />
          </Reveal>
          <Reveal className="col-span-4 text-muted md:col-span-4 lg:col-span-3">
            <p>
              From routine care to restorative treatment, our focus is the same:
              clear communication, thoughtful care and long-term oral health.
            </p>
            <Link to="/services/" className="text-link mt-3">
              Explore our treatments <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        className="border-y border-line bg-surface py-16 md:py-24"
        aria-labelledby="principles-title"
      >
        <div className="shell">
          <p className="eyebrow mb-4">Our principles</p>
          <h2 id="principles-title" className="sr-only">
            Our principles
          </h2>
          <Reveal as="ol" className="grid gap-12 md:grid-cols-3 md:gap-8">
            {chapters.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative pt-4">
                <svg
                  aria-hidden
                  viewBox="0 0 300 80"
                  className="absolute left-0 top-0 h-16 w-full"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 78C60 10 240 10 298 78"
                    stroke="#D6E0E3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="font-serif text-6xl leading-none text-brand/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon size={26} className="mt-6 text-brand" />
                <h3 className="h2 mt-3 text-ink">{title}</h3>
                <p className="mt-3 max-w-[32ch] text-muted">{body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="care-title">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our services"
              id="care-title"
              title="Dental care for every smile."
              aside={
                <Link to="/services/" className="text-link">
                  View all treatments and fees <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <Reveal
            as="ul"
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line md:grid-cols-3 lg:grid-cols-6"
          >
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}/`}
                  className="flex h-full min-h-[120px] flex-col justify-between gap-4 bg-surface p-5 transition-colors hover:bg-pale focus-visible:bg-pale"
                >
                  <Tooth size={24} className="text-brand" />
                  <span className="font-semibold text-ink">{s.name}</span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="border-y border-line bg-surface py-16 md:py-24"
        aria-labelledby="team-title"
      >
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our team"
              id="team-title"
              title="Meet your care team."
              intro="Full profiles, with qualifications and areas of clinical focus, are on our Team page."
              aside={
                <Link to="/team/" className="text-link">
                  Meet your dentist <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          {team.length > 0 ? (
            <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {team.slice(0, 4).map((c, i) => (
                <Reveal as="li" key={c.id}>
                  <Link to={`/team/#${c.slug}`} className="group block">
                    <div className="arch-top relative aspect-[4/5] overflow-hidden bg-pale">
                      {c.portrait ? (
                        <img
                          src={c.portrait.src}
                          width={c.portrait.width}
                          height={c.portrait.height}
                          alt={
                            c.portraitAlt ??
                            `${displayName(c, i)} - ${c.role || "Dentist"} at DADC Dental Clinic`
                          }
                          loading="lazy"
                          className="zoom-img h-full w-full object-cover"
                        />
                      ) : (
                        <PortraitPlaceholder
                          label={
                            c.placeholder
                              ? "Placeholder"
                              : "Portrait to be supplied"
                          }
                        />
                      )}
                    </div>
                    <span className="mt-4 block font-semibold text-ink group-hover:text-action">
                      {displayName(c, i)}
                    </span>
                    {c.role && (
                      <span className="block text-sm text-muted">{c.role}</span>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-muted">
              Team profiles will be added once they have been approved.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="space-title">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our clinic"
              id="space-title"
              title="A calm, modern space for your comfort."
              intro="Photographs of the clinic will replace these concept images once supplied."
            />
          </Reveal>
          <Reveal className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              images.clinicRoom,
              images.waiting,
              images.clinicRoom2,
              images.clinicRoom,
            ].map((src, i) => (
              <div
                key={i}
                className={`group overflow-hidden rounded-[12px] bg-pale ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt={`DADC Dental Clinic facilities and patient comfort environment view ${i + 1}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="zoom-img h-full min-h-[160px] w-full object-cover"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="border-t border-line bg-surface py-16 md:py-24"
        aria-labelledby="first-title"
      >
        <div className="shell grid-layout gap-y-8">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="eyebrow mb-4">Your first visit</p>
            <h2 id="first-title" className="h2 text-ink">
              New to DADC?
            </h2>
          </Reveal>
          <Reveal className="col-span-4 text-muted md:col-span-8 lg:col-span-6 lg:col-start-7">
            <p>
              Your first appointment is a chance to talk about your oral health
              and goals. We examine your teeth and gums, explain what we find
              and discuss options — there is no pressure to decide on the day.
            </p>
            {first && (
              <Link to={`/blog/${first.slug}/`} className="text-link mt-3">
                Read: what to expect at your first visit{" "}
                <ArrowRight size={16} />
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="shell">
          <p className="eyebrow">Your first visit</p>
          <h2 className="h2 mt-3">A conversation, then a plan.</h2>
          <ol className="steps-grid">
            {[
              [
                "Discuss your concerns",
                "Tell us about your goals and what matters to you.",
              ],
              [
                "Assessment",
                "Your clinician explains the assessment and any investigations needed.",
              ],
              [
                "Options and estimate",
                "Discuss suitable options and the proposed fees.",
              ],
              [
                "Agree next steps",
                "Decide on a plan together, with time for your questions.",
              ],
            ].map(([title, body], i) => (
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
        <div className="shell">
          <VisitDetails />
        </div>
      </section>
      <BookingPanel
        eyebrow="Book an appointment"
        title="Ready for a healthier, brighter smile?"
        body="Get in touch on WhatsApp for a friendly, no-obligation chat."
        image={images.waiting}
        imageAlt="Calm patient reception area at DADC Dental Clinic"
        imageWidth={1000}
        imageHeight={750}
      />
    </>
  )
}
