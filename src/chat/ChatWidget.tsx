import { useCallback, useEffect, useRef, useState } from "react"
import ChatLauncher from "./ChatLauncher"
import ChatPanel, { emptySession, type ChatSession } from "./ChatPanel"

const MOBILE = "(max-width: 639px)"

/**
 * Mounts the launcher and panel. Conversation history lives in memory only —
 * never in localStorage, analytics or logs — and is lost on page reload.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [session, setSessionState] = useState<ChatSession>(emptySession)
  const [mobile, setMobile] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollY = useRef(0)
  const setSession = useCallback(
    (fn: (s: ChatSession) => ChatSession) => setSessionState(fn),
    [],
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE)
    setMobile(mq.matches)
    const on = () => setMobile(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  const close = useCallback(() => {
    setClosing(true)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.setTimeout(
      () => {
        setOpen(false)
        setClosing(false)
        launcherRef.current?.focus()
      },
      reduce ? 0 : 190,
    )
  }, [])

  // Focus in on open, Escape, focus trap (mobile modal).
  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    )
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.getElementById("chat-confirm-flag")?.dataset.confirm) {
          ;(document.querySelector(
            "[role=alertdialog] button:last-child",
          ) as HTMLElement | null)?.click()
          return
        }
        e.preventDefault()
        close()
        return
      }
      if (e.key === "Tab" && mobile && panelRef.current) {
        const els = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, summary, [tabindex="0"]',
          ),
        ).filter((el) => el.offsetParent !== null)
        const first = els[0],
          last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, mobile, close])

  // Mobile: lock background scroll, hide booking bar, follow the visual viewport (keyboard).
  useEffect(() => {
    const root = document.documentElement
    if (!open) return
    root.classList.add("chat-open")
    if (!mobile) return () => root.classList.remove("chat-open")
    scrollY.current = window.scrollY
    const b = document.body.style
    Object.assign(b, {
      position: "fixed",
      top: `-${scrollY.current}px`,
      left: "0",
      right: "0",
      width: "100%",
    })
    const vv = window.visualViewport
    const fit = () =>
      vv && root.style.setProperty("--chat-vh", `${vv.height}px`)
    fit()
    vv?.addEventListener("resize", fit)
    return () => {
      vv?.removeEventListener("resize", fit)
      root.style.removeProperty("--chat-vh")
      Object.assign(b, {
        position: "",
        top: "",
        left: "",
        right: "",
        width: "",
      })
      window.scrollTo({
        top: scrollY.current,
        behavior: "instant" as ScrollBehavior,
      })
      root.classList.remove("chat-open")
    }
  }, [open, mobile])

  return (
    <>
      <ChatLauncher
        ref={launcherRef}
        onOpen={() => setOpen(true)}
        hidden={open}
      />
      {open && (
        <ChatPanel
          session={session}
          setSession={setSession}
          onClose={close}
          onNavigate={() => {
            if (mobile) close()
          }}
          modal={mobile}
          closing={closing}
          panelRef={panelRef}
          inputRef={inputRef}
        />
      )}
    </>
  )
}
