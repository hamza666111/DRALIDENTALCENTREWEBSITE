import { useEffect, useRef, useState, type FormEvent } from "react"
import { clinic, treatmentOptions } from "../config/site"
import { international } from "../config/international"
import { buildWhatsAppUrl } from "../lib/whatsapp"
import { Link } from "../lib/router"
import { ArrowRight } from "./Icons"
type Mode = "online" | "visit"
type Values = {
  name: string
  email: string
  phone: string
  country: string
  timezone: string
  treatment: string
  time: string
  arrival: string
  departure: string
  flexible: boolean
  consent: boolean
}
const initial: Values = {
  name: "",
  email: "",
  phone: "",
  country: "",
  timezone: "",
  treatment: "Not sure",
  time: "",
  arrival: "",
  departure: "",
  flexible: true,
  consent: false,
}
export default function InternationalForm() {
  const [mode, setMode] = useState<Mode>("online"),
    [v, setV] = useState(initial),
    [status, setStatus] =
      useState<"idle" | "pending" | "received" | "failed" | "handoff">("idle"),
    [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const busy = useRef(false),
    errorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sync = () =>
      setMode(window.location.hash === "#in-clinic-visit" ? "visit" : "online")
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])
  const set = (key: keyof Values, value: string | boolean) => {
    setV((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
    if (status === "handoff") setStatus("idle")
  }
  const choose = (m: Mode) => {
    setMode(m)
    setStatus("idle")
    setErrors({})
    window.history.replaceState(
      {},
      "",
      m === "online" ? "#online-consultation" : "#in-clinic-visit",
    )
  }
  const details = [
    `Hello ${clinic.name}, I would like to request ${
      mode === "online" ? "an online consultation" : "an in-clinic visit"
    }.`,
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `WhatsApp: ${v.phone}`,
    `Country: ${v.country}`,
    `Time zone: ${v.timezone}`,
    `Treatment interest: ${v.treatment}`,
    `Preferred contact time: ${v.time || "Flexible"} (my time zone)`,
    ...(mode === "visit"
      ? [
          `Arrival: ${v.arrival || "Not decided"}`,
          `Departure: ${v.departure || "Not decided"}`,
          `Dates flexible: ${v.flexible ? "Yes" : "No"}`,
        ]
      : []),
    "Please contact me to discuss availability. I understand this is not a confirmed appointment.",
  ].join("\n")
  const whatsapp = buildWhatsAppUrl(details)
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy.current) return
    const err: Partial<Record<keyof Values, string>> = {}
    if (!v.name.trim()) err.name = "Enter your name."
    if (!/^\S+@\S+\.\S+$/.test(v.email))
      err.email = "Enter a valid email address."
    if (
      v.phone.replace(/\D/g, "").length < 7 ||
      v.phone.replace(/\D/g, "").length > 15
    )
      err.phone = "Enter your phone number including country code."
    if (!v.country.trim()) err.country = "Enter your country."
    if (!v.timezone.trim())
      err.timezone = "Enter your city/time zone or UTC offset."
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Karachi",
    })
    if (mode === "visit" && v.arrival && v.arrival < today)
      err.arrival = "Choose today or a future date."
    if (
      mode === "visit" &&
      v.departure &&
      (v.departure < today || (v.arrival && v.departure < v.arrival))
    )
      err.departure =
        "Departure must be on or after your arrival and not in the past."
    if (!v.consent)
      err.consent = "Please agree to be contacted about this request."
    setErrors(err)
    if (Object.keys(err).length) {
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    if (!international.endpoint) {
      setStatus("handoff")
      return
    }
    busy.current = true
    setStatus("pending")
    try {
      const payload = {
        ...v,
        mode,
        ...(mode === "online"
          ? { arrival: undefined, departure: undefined, flexible: undefined }
          : {}),
      }
      const res = await fetch(international.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) throw Error("Delivery failed")
      setStatus("received")
    } catch {
      setStatus("failed")
    } finally {
      busy.current = false
    }
  }
  if (status === "received")
    return (
      <div className="form-card" role="status">
        <h2 className="h3">Request received</h2>
        <p className="mt-4">
          Our team will contact you to discuss availability. Your consultation
          or appointment is not confirmed yet.
        </p>
      </div>
    )
  function field(
    key: keyof Values,
    label: string,
    type = "text",
    optional = false,
    placeholder?: string,
  ) {
    return (
      <div className="field">
        <label htmlFor={`intl-${key}`}>
          {label}
          {optional ? " (optional)" : " *"}
        </label>
        <input
          id={`intl-${key}`}
          name={key}
          type={type}
          required={!optional}
          autoComplete={
            ({
              name: "name",
              email: "email",
              phone: "tel",
              country: "country-name",
            } as Record<string, string>)[key]
          }
          value={String(v[key])}
          onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          maxLength={type === "date" ? undefined : 160}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `intl-${key}-error` : undefined}
        />
        {errors[key] && (
          <p id={`intl-${key}-error`} className="field-error">
            {errors[key]}
          </p>
        )}
      </div>
    )
  }
  return (
    <form
      className="form-card international-form"
      onSubmit={submit}
      noValidate
      aria-labelledby="international-form-title"
    >
      <span id="online-consultation" className="anchor-target" />
      <span id="in-clinic-visit" className="anchor-target" />
      <p className="eyebrow">Start a conversation</p>
      <h2 id="international-form-title" className="h2 mt-3">
        Plan your dental care
      </h2>
      <p className="mt-3 text-muted">
        Choose how you would like to start. Fields marked * are required.
      </p>
      <div className="mode-switch" role="group" aria-label="Enquiry type">
        <button
          type="button"
          aria-pressed={mode === "online"}
          onClick={() => choose("online")}
        >
          Online consultation
        </button>
        <button
          type="button"
          aria-pressed={mode === "visit"}
          onClick={() => choose("visit")}
        >
          In-clinic visit
        </button>
      </div>
      {Object.values(errors).some(Boolean) && (
        <div role="alert" tabIndex={-1} ref={errorRef} className="form-alert">
          <strong>Please check your details.</strong>
          <ul>
            {Object.entries(errors)
              .filter(([, error]) => error)
              .map(([key, error]) => (
                <li key={key}>
                  <a href={`#intl-${key}`}>{error}</a>
                </li>
              ))}
          </ul>
        </div>
      )}
      <fieldset disabled={status === "pending"} className="field-grid">
        {field("name", "Full name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone / WhatsApp", "tel", false, "+44 7700 900000")}
        {field("country", "Country")}
        {field(
          "timezone",
          "Your city / time zone",
          "text",
          false,
          "e.g. London / Europe/London",
        )}
        <div className="field">
          <label htmlFor="intl-treatment">Treatment interest</label>
          <select
            id="intl-treatment"
            value={v.treatment}
            onChange={(e) => set("treatment", e.target.value)}
          >
            {treatmentOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {field(
          "time",
          "Preferred contact time in your time zone",
          "text",
          true,
          "e.g. weekdays after 6 PM",
        )}
        {mode === "visit" && (
          <>
            {field("arrival", "Planned arrival", "date", true)}
            {field("departure", "Planned departure", "date", true)}
            <label className="check-label">
              <input
                type="checkbox"
                checked={v.flexible}
                onChange={(e) => set("flexible", e.target.checked)}
              />
              My travel dates are flexible
            </label>
          </>
        )}
        <div className="field-wide">
          <label className="check-label">
            <input
              id="intl-consent"
              type="checkbox"
              checked={v.consent}
              required
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={
                errors.consent ? "intl-consent-error" : undefined
              }
            />
            <span>
              I agree to be contacted about this request, as explained in the{" "}
              <Link to="/privacy/">privacy policy</Link>. *
            </span>
          </label>
          {errors.consent && (
            <p id="intl-consent-error" className="field-error">
              {errors.consent}
            </p>
          )}
        </div>
      </fieldset>
      {status === "failed" && (
        <p role="alert" className="form-alert">
          We could not send your request. Your details are still here. Please
          retry or contact the clinic directly.
        </p>
      )}
      {status === "handoff" ? (
        <div role="status" className="handoff-panel">
          <p>
            Nothing has been sent yet. Open WhatsApp and press Send to share
            your request with the clinic.
          </p>
          {whatsapp ? (
            <a
              className="btn btn-primary mt-4"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue on WhatsApp <ArrowRight size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p>
              Please use the clinic contact details; online delivery is not
              configured.
            </p>
          )}
        </div>
      ) : (
        <button
          disabled={status === "pending"}
          className="btn btn-primary w-full mt-6"
          type="submit"
        >
          {status === "pending"
            ? "Sending…"
            : international.endpoint
              ? "Send request"
              : "Prepare WhatsApp request"}{" "}
          <ArrowRight size={16} />
        </button>
      )}
      <p className="text-sm text-muted mt-4">
        {international.endpoint
          ? "Our team will confirm availability."
          : "Your request is sent only when you press Send in WhatsApp."}{" "}
        Please do not include medical records here.
      </p>
    </form>
  )
}
