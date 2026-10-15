export interface ChatLink {
  label: string
  /** Internal route ("/services/") or a verified absolute https URL. */
  href: string
}

export interface ChatReply {
  text: string
  sources?: ChatLink[]
  /** Service slugs from src/config/site.ts. Unknown slugs are dropped. */
  treatments?: string[]
  /** Suggest continuing with the clinic on WhatsApp. */
  handoff?: boolean
}

export type ChatErrorKind = "network" | "limit" | "unavailable"

export type ChatResult = { ok: true ; reply: ChatReply } | {
  ok: false
  error: ChatErrorKind
}

export interface HistoryItem {
  role: "user" | "assistant"
  text: string
}

export interface ChatRequest {
  message: string
  history: HistoryItem[]
  pagePath: string
  locale: string
  signal: AbortSignal
  /** Preview-only: force a specific state for inspection. Ignored by real backends. */
  simulate?: "long" | "card" | ChatErrorKind
}

export interface ChatAdapter {
  readonly kind: "preview" | "http" | "unavailable"
  sendMessage(req: ChatRequest): Promise<ChatResult>
}

export interface ChatMessage extends Partial<ChatReply> {
  id: string
  role: "user" | "assistant"
  text: string
  status?: ChatErrorKind
}
