import { chatConfig } from "../config/chat"
import { getService } from "../config/site"
import type { ChatAdapter, ChatReply, ChatRequest, ChatResult } from "./types"

const FALLBACK =
  "This is an interface preview. The live assistant will be connected later. You can browse our services or contact the clinic on WhatsApp."

const samples: Record<string, ChatReply> = {
  "explore treatments": {
    text: "Preview reply — AI not connected.\n\nDr Ali Dental Centre provides a full range of care including Scaling & Polishing, Extractions, Composite Fillings, Crowns & Bridges, Removable Dentures, Veneers, Dental Implants, Clear Aligners, Braces, RCT, and Teeth Whitening. Two examples are shown below.",
    treatments: ["scaling-and-polishing", "dental-implants"],
    sources: [{ label: "All treatments", href: "/services/" }],
  },
  "treatment fees": {
    text: "Preview reply — AI not connected.\n\nFees are confirmed after a personal clinical assessment so you receive an accurate, transparent estimate with no hidden costs. You can explore treatment details and pricing guidance on the Services page.",
    sources: [{ label: "Treatment fees at a glance", href: "/services/" }],
  },
  "opening hours & location": {
    text: "Dr Ali Dental Centre is located at Shop# 2 Ground Floor, Galaxy Mall, Airport Rd, Lahore.\n\nWorking Hours:\n- Days: Monday – Saturday\n- Time: 3:00 PM – 10:00 PM\n- Phone / WhatsApp: 03282333999",
    sources: [{ label: "Contact and visit details", href: "/contact/" }],
  },
  "request an appointment": {
    text: "Preview reply — AI not connected.\n\nTo request an appointment you can:\n- Use the request form on the Contact page\n- Continue on WhatsApp\n\nThe clinic team confirms availability with you directly. Nothing is booked from this chat.",
    sources: [{ label: "Request an appointment", href: "/contact/" }],
    handoff: true,
  },
}

const longSample: ChatReply = {
  text: "Preview reply — AI not connected. This longer sample shows how extended answers, lists and long links wrap inside the panel.\n\nA first visit usually starts with a conversation about your dental history and any concerns, followed by an examination. Your dentist then explains what they found and any options, with time for questions.\n\n- Bring a list of medications you take\n- Mention any allergies or medical conditions\n- Ask about costs before agreeing to treatment\n\nA very long link wraps safely: https://example.invalid/this-is-a-deliberately-long-sample-address-that-should-wrap-without-causing-horizontal-scrolling/first-dental-visit\n\nآپ اردو میں بھی لکھ سکتے ہیں۔ یہ متن دائیں سے بائیں دکھایا جاتا ہے۔",
  sources: [
    {
      label: "What to expect at your first visit",
      href: "/blog/first-dental-visit/",
    },
  ],
}

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t)
        reject(new DOMException("Aborted", "AbortError"))
      },
      { once: true },
    )
  })

/** Deterministic, offline sample replies. Never sends data anywhere. */
export const previewAdapter: ChatAdapter = {
  kind: "preview",
  async sendMessage(req: ChatRequest): Promise<ChatResult> {
    await wait(chatConfig.previewDelayMs, req.signal)
    if (
      req.simulate === "network" ||
      req.simulate === "limit" ||
      req.simulate === "unavailable"
    )
      return { ok: false, error: req.simulate }
    if (req.simulate === "long") return { ok: true, reply: longSample }
    if (req.simulate === "card")
      return {
        ok: true,
        reply: {
          text: "Preview reply — AI not connected. Example treatment card:",
          treatments: ["teeth-whitening"],
          sources: [
            { label: "Teeth whitening", href: "/services/teeth-whitening/" },
          ],
        },
      }
    const hit = samples[req.message.trim().toLowerCase()]
    return {
      ok: true,
      reply: hit ?? {
        text: FALLBACK,
        sources: [{ label: "Browse services", href: "/services/" }],
        handoff: true,
      },
    }
  },
}

/** Live adapter for a separately hosted backend. Validation, origin checks and rate limits belong on that backend. */
export function httpAdapter(url: string): ChatAdapter {
  return {
    kind: "http",
    async sendMessage({
      message,
      history,
      pagePath,
      locale,
      signal,
    }): Promise<ChatResult> {
      const timeout = AbortSignal.timeout(chatConfig.requestTimeoutMs)
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history, pagePath, locale }),
          signal: AbortSignal.any([signal, timeout]),
        })
        if (res.status === 429) return { ok: false, error: "limit" }
        if (res.status === 503) return { ok: false, error: "unavailable" }
        if (!res.ok) return { ok: false, error: "network" }
        const data = (await res.json()) as Partial<ChatReply>
        if (typeof data.text !== "string")
          return { ok: false, error: "network" }
        return { ok: true, reply: sanitizeReply(data as ChatReply) }
      } catch (e) {
        if ((e as Error).name === "AbortError" && signal.aborted) throw e
        return { ok: false, error: "network" }
      }
    },
  }
}

/** Keep only internal routes or https links, and known treatment slugs. */
export function sanitizeReply(r: ChatReply): ChatReply {
  return {
    text: r.text.slice(0, 8000),
    sources: (r.sources ?? [])
      .filter(
        (s) =>
          typeof s.href === "string" &&
          typeof s.label === "string" &&
          (/^\/(?!\/)/.test(s.href) || /^https:\/\//.test(s.href)),
      )
      .slice(0, 5),
    treatments: (r.treatments ?? []).filter((t) => !!getService(t)).slice(0, 3),
    handoff: !!r.handoff,
  }
}

const unavailableAdapter: ChatAdapter = {
  kind: "unavailable",
  async sendMessage() {
    return { ok: false, error: "unavailable" }
  },
}

/** Single switch point between preview, live backend and the honest unavailable state. */
export function getChatAdapter(): ChatAdapter {
  if (chatConfig.mode === "preview") return previewAdapter
  if (chatConfig.backendUrl) return httpAdapter(chatConfig.backendUrl)
  return unavailableAdapter
}
