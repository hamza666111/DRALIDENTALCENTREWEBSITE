import { useRef, useState, type FormEvent } from "react"
import { clinic, integrations, treatmentOptions } from "../config/site"
import { Link } from "../lib/router"
import { buildWhatsAppUrl } from "../lib/whatsapp"
import { ArrowRight, WhatsApp } from "./Icons"

type Status = "pristine" | "invalid" | "pending" | "received" | "failed" | "handoff"
interface Values {
  name: string
  phone: string
  email: string
  date: string
  time: string
  treatment: string
  consent: boolean
}
const empty: Values = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  treatment: "Not sure",
  consent: false,
}

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {}
  if (!v.name.trim()) e.name = "Please enter your name."
  if (!v.phone.trim()) e.phone = "Please enter a phone number."
  else if (v.phone.replace(/\D/g, "").length < 7)
    e.phone = "Please enter a valid phone number, including area code."
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email))
    e.email = "Please enter a valid email address, or leave it blank."
  if (
    v.date &&
    v.date <
      new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" })
  )
    e.date = "Please choose today or a future date."
  if (!v.consent)
    e.consent = "Please confirm you agree to be contacted about this request."
  return e
}

const message = (v: Values) =>
  [
    `Hello ${clinic.name}, I would like to request an appointment.`,
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    ...(v.email ? [`Email: ${v.email}`] : []),
    `Treatment interest: ${v.treatment}`,
    `Preferred day: ${v.date || "Flexible"}${
      v.time ? ` (${v.time}, Pakistan time)` : ""
    }`,
    "Please let me know which times may be available. Thank you.",
  ].join("\n")

/**
 * Appointment request form. With a configured endpoint it POSTs and reports real
 * delivery; otherwise it hands off to WhatsApp, or explains that it is a prototype.
 * It never claims an appointment is booked.
 */
export default function AppointmentForm({ treatment }: { treatment?: string }) {
  const [v, setV] = useState<Values>(() => ({
    ...empty,
    treatment: treatment || "Not sure",
  }))
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [status, setStatus] = useState<Status>("pristine")
  const inFlight = useRef(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const endpoint = integrations.appointmentEndpoint
  const waUrl = buildWhatsAppUrl(message(v))
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Karachi",
  })

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (inFlight.current || status === "received") return
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus("invalid")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    if (!endpoint) {
      setStatus("handoff")
      return
    }
    inFlight.current = true
    setStatus("pending")
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus("received")
    } catch {
      setStatus("failed")
    } finally {
      inFlight.current = false
    }
  }

  if (status === "received")
    return (
      <div
        role="status"
        className="rounded-[12px] border border-line bg-surface p-8"
      >
        <h2 className="h3 text-ink">Request received</h2>
        <p className="mt-3 text-muted">
          Thank you, {v.name.split(" ")[0]}. Your request has been sent to the
          clinic. This is not yet a confirmed appointment — the team will
          contact you to confirm availability.
        </p>
      </div>
    )

  const field =
    "mt-1.5 block min-h-[48px] w-full rounded-[8px] border bg-surface px-4 text-[1rem] text-ink transition-colors focus:border-action focus:outline-none focus:ring-2 focus:ring-action/25"
  const errCls = (k: keyof Values) =>
    errors[k] ? "border-[#b42318]" : "border-line"
  const Err = ({ k }: { k: keyof Values }) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1.5 text-sm font-medium text-[#b42318]">
        {errors[k]}
      </p>
    ) : null
  const desc = (k: keyof Values) => (errors[k] ? `${k}-err` : undefined)
  const errList = Object.entries(errors).filter(([, m]) => m)

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="form-title"
      className="rounded-[12px] border border-line bg-surface p-6 md:p-8"
    >
      <h2 id="form-title" className="h3 text-ink">
        Request an appointment
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        Share a few details and the team will be in touch to confirm
        availability. Please don’t include medical history here.
      </p>
      <p className="mt-2 text-sm text-muted">
        Fields marked{" "}
        <span aria-hidden className="text-[#b42318]">
          *
        </span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {status === "invalid" && errList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-[8px] border border-[#f1c4bf] bg-[#fdf2f1] p-4 text-sm text-[#7a1b12]"
        >
          <p className="font-semibold">
            Please check{" "}
            {errList.length === 1 ? "one field" : `${errList.length} fields`}:
          </p>
          <ul className="mt-1 list-disc pl-5">
            {errList.map(([k, m]) => (
              <li key={k}>
                <a href={`#f-${k}`} className="underline">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="f-name" className="text-sm font-semibold text-ink">
            Name{" "}
            <span aria-hidden className="text-[#b42318]">
              *
            </span>
          </label>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={desc("name")}
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            className={`${field} ${errCls("name")}`}
          />
          <Err k="name" />
        </div>
        <div>
          <label htmlFor="f-phone" className="text-sm font-semibold text-ink">
            Phone{" "}
            <span aria-hidden className="text-[#b42318]">
              *
            </span>
          </label>
          <input
            id="f-phone"
            placeholder="e.g. +92 300 1234567"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={desc("phone")}
            value={v.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={`${field} ${errCls("phone")}`}
          />
          <Err k="phone" />
        </div>
        <div>
          <label htmlFor="f-email" className="text-sm font-semibold text-ink">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={desc("email")}
            value={v.email}
            onChange={(e) => set("email", e.target.value)}
            className={`${field} ${errCls("email")}`}
          />
          <Err k="email" />
        </div>
        <div>
          <label htmlFor="f-date" className="text-sm font-semibold text-ink">
            Preferred day{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="f-date"
            name="date"
            type="date"
            min={today}
            aria-invalid={!!errors.date}
            aria-describedby={desc("date")}
            value={v.date}
            onChange={(e) => set("date", e.target.value)}
            className={`${field} ${errCls("date")}`}
          />
          <Err k="date" />
        </div>
        <div>
          <label htmlFor="f-time" className="text-sm font-semibold text-ink">
            Time window{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <select
            id="f-time"
            name="time"
            value={v.time}
            onChange={(e) => set("time", e.target.value)}
            className={`${field} border-line`}
          >
            <option value="">No preference</option>
            <option>Afternoon (Pakistan time)</option>
            <option>Evening (Pakistan time)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="f-treatment"
            className="text-sm font-semibold text-ink"
          >
            Treatment interest
          </label>
          <select
            id="f-treatment"
            name="treatment"
            value={v.treatment}
            onChange={(e) => set("treatment", e.target.value)}
            className={`${field} border-line`}
          >
            {treatmentOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id="f-consent"
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={!!errors.consent}
              aria-describedby={desc("consent")}
              checked={v.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-[#006B91]"
            />
            <label htmlFor="f-consent" className="text-[0.95rem] text-ink">
              I agree to be contacted by {clinic.name} about this appointment
              request, as described in the{" "}
              <Link to="/privacy/" className="text-action underline">
                privacy policy
              </Link>
              .{" "}
              <span aria-hidden className="text-[#b42318]">
                *
              </span>
            </label>
          </div>
          <Err k="consent" />
        </div>
      </div>

      {status === "failed" && (
        <div
          role="alert"
          className="mt-6 rounded-[8px] border border-[#f1c4bf] bg-[#fdf2f1] p-4 text-sm text-[#7a1b12]"
        >
          Your request could not be sent. Your details are still here — please
          try again, or contact the clinic on WhatsApp.
        </div>
      )}

      {status === "handoff" ? (
        <div
          role="status"
          className="mt-6 rounded-[8px] border border-line bg-pale p-5"
        >
          {waUrl ? (
            <>
              <p className="text-[0.95rem] text-ink">
                Online requests are not connected yet. Continue on WhatsApp to
                send these details to the clinic — nothing has been sent so far.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-4"
              >
                <WhatsApp size={19} />
                Continue on WhatsApp
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </>
          ) : (
            <p className="text-[0.95rem] text-ink">
              <strong>Prototype — not submitted.</strong> No booking system or
              WhatsApp number is connected yet, so your details have not been
              sent anywhere.
            </p>
          )}
          <button
            type="button"
            onClick={() => setStatus("pristine")}
            className="text-link mt-2"
          >
            Edit details
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === "pending"}
          aria-disabled={status === "pending"}
          className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70"
        >
          {status === "pending"
            ? "Sending request…"
            : status === "failed"
              ? "Try again"
              : "Request appointment"}
          {status !== "pending" && <ArrowRight size={18} />}
        </button>
      )}
      {!endpoint && status !== "handoff" && (
        <p className="mt-3 text-center text-xs text-muted">
          No booking system is connected yet. You’ll be offered WhatsApp to send
          your request.
        </p>
      )}
    </form>
  )
}
