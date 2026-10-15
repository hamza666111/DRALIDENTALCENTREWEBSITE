import WhatsAppCTA from "./WhatsAppCTA"

export default function ContactPanel({
  title = "Have a question for the clinic?",
  treatment,
  compact,
}: {
  title?: string
  treatment?: string
  compact?: boolean
}) {
  return (
    <aside
      className={`rounded-[12px] bg-pale ${
        compact
          ? "p-6"
          : "flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10"
      }`}
      aria-label="Ask the clinic"
    >
      <div>
        <h2 className={compact ? "h3 text-ink" : "h2 text-ink"}>{title}</h2>
        <p className="mt-2 max-w-[44ch] text-[0.95rem] text-muted">
          Send your question on WhatsApp and the team will get back to you.
          Please do not share detailed medical information in messages.
        </p>
      </div>
      <div className={compact ? "mt-5" : "shrink-0"}>
        <WhatsAppCTA
          label="Ask the clinic on WhatsApp"
          treatment={treatment}
          full={compact}
        />
      </div>
    </aside>
  )
}
