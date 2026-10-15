import type { ReactNode } from "react"
import { Link } from "../lib/router"
import type { ChatMessage } from "./types"
import TreatmentCard from "./TreatmentCard"
import WhatsAppHandoff from "./WhatsAppHandoff"

/** Plain-text rendering: blank lines -> paragraphs, "- " lines -> lists. No raw HTML. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n")
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i} className="my-2 list-disc space-y-1 ps-5">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          )
        return (
          <p key={i} className="my-2 first:mt-0 last:mb-0">
            {lines.reduce<ReactNode[]>(
              (acc, l, j) => (j ? [...acc, <br key={j} />, l] : [l]),
              [],
            )}
          </p>
        )
      })}
    </>
  )
}

export default function MessageBubble({
  m,
  onNavigate,
}: {
  m: ChatMessage
  onNavigate?: () => void
}) {
  if (m.role === "user")
    return (
      <div className="flex justify-end">
        <div
          dir="auto"
          className="max-w-[85%] whitespace-pre-wrap rounded-[12px] rounded-ee-[4px] bg-action px-4 py-2.5 text-[0.95rem] leading-relaxed text-white [overflow-wrap:anywhere]"
        >
          <span className="sr-only">You said: </span>
          {m.text}
        </div>
      </div>
    )
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        dir="auto"
        className="max-w-[92%] rounded-[12px] rounded-es-[4px] border border-line bg-surface px-4 py-3 text-[0.95rem] leading-relaxed text-ink [overflow-wrap:anywhere]"
      >
        <span className="sr-only">Assistant: </span>
        <RichText text={m.text} />
        {m.sources && m.sources.length > 0 && (
          <div className="mt-3 border-t border-line pt-2">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
              On this website
            </p>
            <ul className="mt-1">
              {m.sources.map((s) => (
                <li key={s.href + s.label}>
                  {s.href.startsWith("/") ? (
                    <Link
                      to={s.href}
                      onClick={onNavigate}
                      className="inline-flex min-h-[40px] items-center text-[0.9rem] font-semibold text-action underline-offset-4 hover:underline"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center text-[0.9rem] font-semibold text-action underline-offset-4 hover:underline"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {m.treatments && m.treatments.length > 0 && (
        <div className="grid w-[92%] gap-2">
          {m.treatments.map((t) => (
            <TreatmentCard key={t} slug={t} onNavigate={onNavigate} />
          ))}
        </div>
      )}
      {m.handoff && <WhatsAppHandoff compact />}
    </div>
  )
}
