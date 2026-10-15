import { clinic, pricing, type Fee } from "../config/site"

/** Builds https://wa.me/NUMBER?text=MESSAGE, or null if no verified number is configured. */
export function buildWhatsAppUrl(message: string): string | null {
  let digits = clinic.whatsapp?.replace(/\D/g, "")
  if (!digits) return null
  if (digits.startsWith("03") && digits.length === 11) {
    digits = "92" + digits.slice(1)
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** A request, never a confirmation. */
export function appointmentMessage(treatment?: string) {
  const about = treatment ? ` about ${treatment}` : ""
  return `Hello ${clinic.name}, I would like to request an appointment${about}. Could you let me know which times may be available? Thank you.`
}

/** Request (never a confirmation) to see a named clinician. */
export function clinicianMessage(name: string) {
  return `Hello ${clinic.name}, I would like to request an appointment with ${name}. Please let me know their availability.`
}

export function formatFee(fee: Fee): string {
  if (fee.amount === null || !pricing.currency) return "Fee to be confirmed"
  const value = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(fee.amount)
  return fee.from ? `From ${value}` : value
}
