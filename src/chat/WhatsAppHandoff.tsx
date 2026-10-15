import { chatConfig } from "../config/chat"
import { buildWhatsAppUrl } from "../lib/whatsapp"
import { WhatsApp } from "../components/Icons"

/** "Continue on WhatsApp" with the default planning message only — never the transcript. */
export default function WhatsAppHandoff({
  compact = false,
  label = "Continue on WhatsApp",
}: {
  compact?: boolean
  label?: string
}) {
  const url = buildWhatsAppUrl(chatConfig.whatsappMessage)
  const cls = compact
    ? "inline-flex min-h-[44px] items-center gap-2 rounded-[8px] border border-line bg-surface px-3 text-[0.85rem] font-semibold text-action transition-colors duration-150 hover:bg-pale active:scale-[0.98]"
    : "btn btn-primary !min-h-[44px] w-full !text-[0.9rem]"
  if (url)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
        <WhatsApp size={18} />
        {label}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    )
  // No verified number: disabled control that says so, never a made-up link.
  if (compact)
    return (
      <button
        type="button"
        disabled
        title="The clinic's WhatsApp number has not been configured yet"
        className={`${cls} cursor-not-allowed opacity-60`}
      >
        <WhatsApp size={18} />
        {label}
        <span className="sr-only">
          {" "}
          — not available: WhatsApp number not configured yet
        </span>
      </button>
    )
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled
        className={`${cls} cursor-not-allowed opacity-60`}
      >
        <WhatsApp size={18} />
        {label}
      </button>
      <span className="text-[0.75rem] text-muted">
        WhatsApp number not configured yet.
      </span>
    </span>
  )
}
