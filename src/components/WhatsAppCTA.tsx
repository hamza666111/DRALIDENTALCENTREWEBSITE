import { useId, useState } from "react"
import { appointmentMessage, buildWhatsAppUrl } from "../lib/whatsapp"
import { ArrowRight, WhatsApp } from "./Icons"

interface Props {
  label?: string
  treatment?: string
  variant?: "primary" | "secondary" | "light"
  className?: string
  arrow?: boolean
  full?: boolean
  noteAbove?: boolean
  showIcon?: boolean
  iconSize?: number
  /** Overrides the default appointment message. */
  message?: string
}

/**
 * Single entry point for all WhatsApp booking actions.
 * Without a verified number it renders an honest configuration state instead of a fake link.
 */
export default function WhatsAppCTA({
  label = "Book on WhatsApp",
  treatment,
  variant = "primary",
  className = "",
  arrow = false,
  full = false,
  noteAbove = false,
  showIcon = true,
  iconSize = 19,
  message,
}: Props) {
  const url = buildWhatsAppUrl(message ?? appointmentMessage(treatment))
  const [open, setOpen] = useState(false)
  const noteId = useId()
  const cls = `btn btn-${variant} ${full ? "w-full" : ""} ${className}`
  const inner = (
    <>
      {showIcon && <WhatsApp size={iconSize} />}
      <span>{label}</span>
      {arrow && <ArrowRight size={18} />}
    </>
  )

  if (url)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    )

  return (
    <span className={`relative inline-flex flex-col ${full ? "w-full" : ""}`}>
      <button
        type="button"
        className={cls}
        aria-describedby={open ? noteId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        {inner}
      </button>
      {open && (
        <span
          id={noteId}
          role="status"
          className={`absolute left-0 z-30 ${
            noteAbove ? "bottom-full mb-2" : "top-full mt-2"
          } w-64 max-w-[80vw] rounded-[8px] border border-line bg-surface p-3 text-left text-[0.8rem] font-medium leading-snug text-muted shadow-lg`}
        >
          Prototype: the clinic’s WhatsApp number has not been configured yet,
          so no message can be sent.
        </span>
      )}
    </span>
  )
}
