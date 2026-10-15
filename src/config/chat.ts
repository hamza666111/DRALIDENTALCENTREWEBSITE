/**
 * DADC Assistant configuration.
 *
 * mode:
 *   'preview' — deterministic sample replies only. Nothing leaves the browser.
 *   'live'    — POSTs to backendUrl. If backendUrl is null, the UI shows
 *               "The live assistant hasn't been connected yet." (no fake replies).
 *
 * backendUrl: a separately hosted backend you control. It must hold any AI
 * provider keys and enforce origin checks, rate limiting and input validation.
 * Never put provider secrets in this file or anywhere in frontend code.
 */
export const chatConfig = {
  mode: "preview" as "preview" | "live",
  backendUrl: null as string | null,
  maxLength: 1000,
  previewDelayMs: 700,
  requestTimeoutMs: 20000,
  welcome: "Hello! What would you like to know about DADC?",
  note: "For clinic information, not diagnosis. Please avoid sharing sensitive medical details.",
  whatsappMessage: "Hello DADC, I would like some help planning my visit.",
  quickActions: [
    "Explore treatments",
    "Treatment fees",
    "Opening hours & location",
    "Request an appointment",
  ],
}
