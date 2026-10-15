import { useId, useRef, useState, type KeyboardEvent } from "react"
import { chatConfig } from "../config/chat"

interface Props {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled?: boolean
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

export default function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
  inputRef,
}: Props) {
  const id = useId()
  const composing = useRef(false)
  const [tried, setTried] = useState(false)
  const max = chatConfig.maxLength
  const empty = value.trim().length === 0
  const over = value.length > max
  const blocked = disabled || empty || over

  const submit = () => {
    if (blocked) {
      setTried(true)
      return
    }
    setTried(false)
    onSend()
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends except on touch-only devices (where Enter adds a line); never during IME composition (e.g. Urdu, Chinese).
    if (
      e.key !== "Enter" ||
      e.shiftKey ||
      composing.current ||
      e.nativeEvent.isComposing ||
      e.keyCode === 229
    )
      return
    if (
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(any-pointer: fine)").matches
    )
      return
    e.preventDefault()
    submit()
  }

  const hint = over
    ? `Message is too long: ${value.length} of ${max} characters. Please shorten it.`
    : tried && empty
      ? "Type a question before sending."
      : null
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="shrink-0 border-t border-line bg-surface px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-3 sm:pb-2"
    >
      <label htmlFor={id} className="sr-only">
        Message to DADC Assistant
      </label>
      <div
        className={`flex items-end gap-2 rounded-[10px] border bg-canvas p-1.5 transition-colors focus-within:border-action ${
          over ? "border-[#b42318]" : "border-line"
        }`}
      >
        <textarea
          id={id}
          ref={inputRef}
          dir="auto"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={() => (composing.current = false)}
          placeholder="Ask about treatments, fees or your visit…"
          aria-invalid={over || undefined}
          aria-describedby={`${id}-hint`}
          enterKeyHint="send"
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2.5 py-2.5 text-[16px] leading-snug text-ink placeholder:text-[#6b7a81] focus:outline-none [field-sizing:content]"
        />
        <button
          type="submit"
          aria-disabled={blocked}
          className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[8px] px-4 text-[0.88rem] font-semibold transition-colors duration-150 active:scale-[0.97] ${
            blocked
              ? "bg-line text-muted"
              : "bg-action text-white hover:bg-action-hover"
          }`}
        >
          Send
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p
        id={`${id}-hint`}
        aria-live="polite"
        className={`mt-1 min-h-[1.1rem] px-1 text-[0.75rem] ${
          over ? "font-semibold text-[#b42318]" : "text-muted"
        }`}
      >
        {hint ??
          (value.length > max - 100
            ? `${value.length} / ${max} characters`
            : "Clinic information only — not for diagnosis.")}
      </p>
    </form>
  )
}
