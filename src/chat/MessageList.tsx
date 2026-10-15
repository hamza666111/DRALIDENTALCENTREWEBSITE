import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import MessageBubble from "./MessageBubble"
import type { ChatMessage } from "./types"

/** Scrolls to new messages only when the reader is already near the bottom. */
export default function MessageList({
  messages,
  children,
  footer,
  onNavigate,
}: {
  messages: ChatMessage[]
  children?: ReactNode
  footer?: ReactNode
  onNavigate?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const atBottom = useRef(true)
  const [unseen, setUnseen] = useState(false)
  const scrollDown = () => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
    setUnseen(false)
  }

  useLayoutEffect(() => {
    if (!messages.length && !footer) {
      if (ref.current) ref.current.scrollTop = 0
      return
    }
    if (atBottom.current) scrollDown()
    else if (
      messages.length &&
      messages[messages.length - 1].role === "assistant"
    )
      setUnseen(true)
  }, [messages, footer])

  // Keep the latest reply visible when the mobile keyboard resizes the viewport.
  useEffect(() => {
    const vv = window.visualViewport
    const on = () => {
      if (atBottom.current) scrollDown()
    }
    vv?.addEventListener("resize", on)
    return () => vv?.removeEventListener("resize", on)
  }, [])

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget
          atBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 48
          if (atBottom.current) setUnseen(false)
        }}
        className="h-full overflow-y-auto overscroll-contain px-4 py-4"
        tabIndex={0}
        role="log"
        aria-label="Conversation"
        aria-live="off"
      >
        {children}
        <div className="space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} onNavigate={onNavigate} />
          ))}
        </div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
      {unseen && (
        <button
          type="button"
          onClick={scrollDown}
          className="absolute bottom-3 left-1/2 inline-flex min-h-[40px] -translate-x-1/2 items-center rounded-full bg-ink px-4 text-[0.82rem] font-semibold text-white shadow-md"
        >
          New message ↓
        </button>
      )}
    </div>
  )
}
