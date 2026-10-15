import { useEffect, useId, useRef, useState } from "react"
import { chatConfig } from "../config/chat"
import { useRouter } from "../lib/router"
import ChatComposer from "./ChatComposer"
import ChatHeader from "./ChatHeader"
import ChatStatus, { Typing } from "./ChatStatus"
import MessageList from "./MessageList"
import QuickActions from "./QuickActions"
import { getChatAdapter } from "./service"
import type { ChatErrorKind, ChatMessage, ChatRequest } from "./types"

let seq = 0
const nextId = () => `m${++seq}`
const adapter = getChatAdapter()

const previewStates: {
  label: string
  simulate: NonNullable<ChatRequest["simulate"]>
}[] = [
  { label: "Long reply", simulate: "long" },
  { label: "Treatment card", simulate: "card" },
  { label: "Connection error", simulate: "network" },
  { label: "Usage limit", simulate: "limit" },
  { label: "Unavailable", simulate: "unavailable" },
]

export interface ChatSession {
  messages: ChatMessage[]
  draft: string
  status: ChatErrorKind | null
}
export const emptySession = (): ChatSession => ({
  messages: [],
  draft: "",
  status: adapter.kind === "unavailable" ? "unavailable" : null,
})

interface Props {
  session: ChatSession
  setSession: (fn: (s: ChatSession) => ChatSession) => void
  onClose: () => void
  onNavigate: () => void
  modal: boolean
  closing: boolean
  panelRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function ChatPanel({
  session,
  setSession,
  onClose,
  onNavigate,
  modal,
  closing,
  panelRef,
  inputRef,
}: Props) {
  const { path } = useRouter()
  const titleId = useId()
  const [pending, setPending] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [announce, setAnnounce] = useState("")
  const lastFailed = useRef<{
    text: string
    simulate?: ChatRequest["simulate"]
  } | null>(null)
  const ctrl = useRef<AbortController | null>(null)
  const { messages, draft, status } = session
  const isUnavailable = adapter.kind === "unavailable"

  useEffect(() => () => ctrl.current?.abort(), [])

  async function send(text: string, simulate?: ChatRequest["simulate"]) {
    if (pending || isUnavailable) return
    const userMsg: ChatMessage = { id: nextId(), role: "user", text }
    const history = messages
      .filter((m) => !m.status)
      .map((m) => ({ role: m.role, text: m.text }))
      .slice(-12)
    setSession((s) => ({
      ...s,
      messages: [...s.messages, userMsg],
      draft: s.draft === text ? "" : s.draft,
      status: null,
    }))
    setPending(true)
    const c = new AbortController()
    ctrl.current = c
    try {
      const res = await adapter.sendMessage({
        message: text,
        history,
        pagePath: path,
        locale: document.documentElement.lang || "en",
        signal: c.signal,
        simulate,
      })
      if (res.ok) {
        setSession((s) => ({
          ...s,
          messages: [
            ...s.messages,
            { id: nextId(), role: "assistant", ...res.reply },
          ],
        }))
        setAnnounce(`Assistant replied: ${res.reply.text.slice(0, 280)}`)
        lastFailed.current = null
      } else if (res.error === "network") {
        // Remove the failed message and give the text back to the composer.
        lastFailed.current = { text, simulate }
        setSession((s) => ({
          ...s,
          messages: s.messages.filter((m) => m.id !== userMsg.id),
          draft: simulate ? s.draft : text,
          status: "network",
        }))
      } else {
        setSession((s) => ({ ...s, status: res.error }))
      }
    } catch {
      /* aborted on close — nothing to show */
    } finally {
      if (ctrl.current === c) {
        setPending(false)
        ctrl.current = null
      }
    }
  }

  // In preview, a retry after a simulated failure succeeds so recovery can be inspected.
  const retry = () => {
    const f = lastFailed.current
    if (f) send(f.text, f.simulate === "network" ? undefined : f.simulate)
  }
  const clear = () => {
    ctrl.current?.abort()
    setPending(false)
    setSession(() => emptySession())
    setConfirmClear(false)
    lastFailed.current = null
    inputRef.current?.focus()
  }

  const welcome = (
    <div className="mb-6">
      <div
        dir="auto"
        className="rounded-[12px] border border-line bg-surface px-4 py-4"
      >
        <p className="font-serif text-[1.6rem] leading-tight text-ink">
          {chatConfig.welcome}
        </p>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
          {chatConfig.note}
        </p>
      </div>
      {!isUnavailable && (
        <div className="mt-4">
          <QuickActions
            items={chatConfig.quickActions}
            onPick={(q) => send(q)}
            disabled={pending}
          />
        </div>
      )}
    </div>
  )

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={modal}
      aria-labelledby={titleId}
      className={`chat-panel fixed z-[70] flex flex-col overflow-hidden bg-canvas ${
        closing ? "chat-out" : "chat-in"
      }
        inset-x-0 top-0 h-[var(--chat-vh,100dvh)]
        sm:inset-auto sm:right-6 sm:bottom-[calc(84px+env(safe-area-inset-bottom))] sm:h-[min(640px,calc(100dvh-108px))] min-[1200px]:bottom-6 min-[1200px]:h-[min(640px,calc(100dvh-48px))] sm:w-[400px] sm:rounded-[14px] sm:border sm:border-line sm:shadow-[0_24px_60px_-24px_rgba(17,23,25,0.35)]`}
    >
      <ChatHeader
        titleId={titleId}
        onClose={onClose}
        onClear={() => setConfirmClear(true)}
        canClear={messages.length > 0}
      />

      {chatConfig.mode === "preview" && (
        <div className="shrink-0 border-b border-line bg-[#fdf6e9] px-4 py-2 text-[0.8rem] text-[#5c4a26]">
          <details>
            <summary className="flex min-h-[32px] cursor-pointer list-none flex-wrap items-center gap-x-2 [&::-webkit-details-marker]:hidden">
              <strong className="font-semibold">
                Interface preview — AI not connected.
              </strong>
              <span className="font-semibold underline underline-offset-2">
                Preview states
              </span>
            </summary>
            <p className="pt-1">
              Replies are fixed samples; nothing is sent anywhere.
            </p>
            <div className="flex flex-wrap gap-1.5 pb-1 pt-1">
              {previewStates.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    send(`Preview: ${p.label.toLowerCase()}`, p.simulate)
                  }
                  className="min-h-[36px] rounded-[6px] border border-[#e3cf9f] bg-white px-2.5 text-[0.78rem] font-semibold text-[#5c4a26] hover:bg-[#fff8e8] disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}

      {confirmClear && (
        <div
          role="alertdialog"
          aria-labelledby="clear-q"
          className="shrink-0 border-b border-line bg-surface px-4 py-3"
        >
          <p id="clear-q" className="text-[0.9rem] font-semibold text-ink">
            Clear this conversation? This can’t be undone.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              autoFocus
              onClick={clear}
              className="inline-flex min-h-[44px] items-center rounded-[8px] bg-action px-4 text-[0.85rem] font-semibold text-white hover:bg-action-hover"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="inline-flex min-h-[44px] items-center rounded-[8px] border border-line px-4 text-[0.85rem] font-semibold text-ink hover:bg-pale"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <MessageList
        messages={messages}
        onNavigate={onNavigate}
        footer={
          pending ? (
            <Typing />
          ) : status ? (
            <ChatStatus
              kind={status}
              onRetry={lastFailed.current ? retry : undefined}
            />
          ) : null
        }
      >
        {welcome}
      </MessageList>

      <ChatComposer
        inputRef={inputRef}
        value={draft}
        onChange={(v) => setSession((s) => ({ ...s, draft: v }))}
        onSend={() => send(draft.trim())}
        disabled={pending || isUnavailable}
      />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>
      {/* Escape is handled by ChatWidget */}
      <span
        hidden
        data-confirm={confirmClear ? "1" : ""}
        id="chat-confirm-flag"
      />
    </div>
  )
}
