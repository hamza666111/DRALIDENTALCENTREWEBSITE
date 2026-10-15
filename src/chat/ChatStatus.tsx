import type { ChatErrorKind } from "./types"
import WhatsAppHandoff from "./WhatsAppHandoff"

export const statusText: Record<ChatErrorKind, string> = {
  network: "We couldn’t connect. Please try again.",
  limit:
    "The assistant is temporarily unavailable. Please contact the clinic on WhatsApp.",
  unavailable: "The live assistant hasn’t been connected yet.",
}

export default function ChatStatus({
  kind,
  onRetry,
}: {
  kind: ChatErrorKind
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className={`rounded-[10px] border px-4 py-3 text-[0.9rem] ${
        kind === "network"
          ? "border-[#f1c4bf] bg-[#fdf2f1] text-[#7a1b12]"
          : "border-line bg-pale text-ink"
      }`}
    >
      <p className="font-semibold">{statusText[kind]}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {kind === "network" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] items-center rounded-[8px] bg-action px-4 text-[0.85rem] font-semibold text-white transition-colors hover:bg-action-hover active:scale-[0.98]"
          >
            Retry
          </button>
        )}
        {kind !== "network" && <WhatsAppHandoff compact />}
      </div>
    </div>
  )
}

export function Typing() {
  return (
    <div
      className="flex items-center gap-2 text-[0.85rem] text-muted"
      role="status"
    >
      <span
        className="inline-flex gap-1 rounded-[12px] border border-line bg-surface px-3 py-3"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="chat-dot h-1.5 w-1.5 rounded-full bg-muted"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span>Preparing a reply…</span>
    </div>
  )
}
