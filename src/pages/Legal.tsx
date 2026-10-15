import Breadcrumbs from "../components/Breadcrumbs"
import PageIntro from "../components/PageIntro"
import { clinic } from "../config/site"

type Section = { title: string ; body: string ; review?: string }

function LegalPage({
  title,
  eyebrow,
  intro,
  sections,
}: {
  title: string
  eyebrow: string
  intro: string
  sections: Section[]
}) {
  return (
    <>
      <PageIntro
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: title }]} />
        }
      />
      <div className="shell py-14">
        <p
          role="note"
          className="max-w-[720px] rounded-[10px] border border-[#ecd9b4] bg-[#fdf6e9] px-5 py-4 text-[0.92rem] text-[#5c4a26]"
        >
          <strong>Owner review required.</strong> Highlighted items describe
          practices the clinic must confirm before publication. Last updated: to
          be confirmed.
        </p>
        <div className="mt-10 max-w-[720px] space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="h3 text-ink">{s.title}</h2>
              <p className="mt-3 text-muted">{s.body}</p>
              {s.review && (
                <p className="mt-3 rounded-[8px] border border-dashed border-[#d9b96f] bg-[#fffaf0] px-4 py-3 text-sm text-[#5c4a26]">
                  To confirm: {s.review}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

export function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      intro={`How ${clinic.name} handles personal information shared through this website.`}
      sections={[
        {
          title: "Who we are",
          body: `${clinic.name} is responsible for information submitted through this website.`,
          review:
            "Registered business name, address and data-protection contact.",
        },
        {
          title: "Information we collect",
          body: "If you request an appointment we ask for your name, phone number, preferred day and treatment interest. Email and time window are optional. We do not ask for medical history through this website.",
        },
        {
          title: "How we use it",
          body: "We use your details only to respond to your request and arrange a visit.",
          review: "Legal basis for processing and any other uses.",
        },
        {
          title: "WhatsApp",
          body: "If you contact us via WhatsApp, your messages are handled by WhatsApp (Meta) under its own privacy policy as well as ours.",
        },
        {
          title: "How long we keep it",
          body: "Information is kept only as long as needed for the purpose it was provided.",
          review: "Specific retention periods.",
        },
        {
          title: "Your rights",
          body: "You can ask to access, correct or delete your personal information.",
          review: "Applicable law and how to make a request.",
        },
      ]}
    />
  )
}

export function Accessibility() {
  return (
    <LegalPage
      eyebrow="Accessibility"
      title="Accessibility statement"
      intro="We want this website to be usable by as many people as possible."
      sections={[
        {
          title: "Our approach",
          body: "The site is designed to work with keyboards and screen readers, respects reduced-motion settings, uses readable text sizes and colour contrast, and provides alternatives such as a side-by-side view for image comparisons.",
        },
        {
          title: "Known limitations",
          body: "Some content, such as clinic photography and map details, is still being added.",
          review:
            "Results of a formal accessibility audit, and the standard targeted (e.g. WCAG 2.2 AA).",
        },
        {
          title: "Visiting the clinic",
          body: "Information about physical access at the clinic will be shared here.",
          review: "Step-free access, parking and other on-site facilities.",
        },
        {
          title: "Feedback",
          body: "If you have difficulty using this website, please let us know so we can help.",
          review: "Preferred contact method for accessibility feedback.",
        },
      ]}
    />
  )
}
