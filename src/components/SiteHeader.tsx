import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { clinic, clinicAddress, navItems } from "../config/site"
import { isActive, Link, useRouter } from "../lib/router"
import { Close, Clock, Menu, Pin } from "./Icons"
import Logo from "./Logo"
import WhatsAppCTA from "./WhatsAppCTA"

export default function SiteHeader() {
  const { path } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [path])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1400px)")
    const closeDesktop = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener("change", closeDesktop)
    return () => mq.removeEventListener("change", closeDesktop)
  }, [])

  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    const focusables = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>("a, button") ?? [])
    focusables()[0]?.focus()
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key === "Tab") {
        const els = focusables()
        const first = els[0]
        const last = els[els.length - 1]
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
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <header
      className={`site-header sticky top-0 z-40 border-b bg-surface/95 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled
          ? "border-line shadow-[0_6px_24px_-12px_rgba(17,23,25,0.18)]"
          : "border-transparent"
      }`}
    >
      {
        <div className="site-header-top">
          <span>
            <Pin size={12} />
            {clinicAddress || clinic.city}
          </span>
          {clinic.openingHours?.map((h) => (
            <span key={h.days}>
              <Clock size={12} />
              {h.days} · {h.hours}
            </span>
          ))}
        </div>
      }
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center shrink-0"
          aria-label={`${clinic.name} home`}
        >
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden min-[1400px]:block">
          <ul className="flex items-center gap-1">
            {navItems.map((n) => {
              const active = isActive(path, n.to)
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-[44px] items-center px-3 text-[0.92rem] font-medium transition-colors hover:text-action ${
                      active
                        ? "text-action after:absolute after:inset-x-3 after:bottom-2 after:h-px after:bg-action"
                        : "text-ink"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="hidden min-[1400px]:block">
          {path === "/" ? (
            <a href="#home-booking" className="btn btn-primary header-booking">
              Request appointment
            </a>
          ) : (
            <Link
              to="/contact/#appointment"
              className="btn btn-primary header-booking"
            >
              Request appointment
            </Link>
          )}
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-ink hover:bg-pale min-[1400px]:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
        >
          <Menu />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {/* Portal: the header's backdrop-filter would otherwise trap this fixed overlay inside the 72px header. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[65] min-[1400px]:hidden">
            <div
              className="absolute inset-0 bg-ink/30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              ref={drawerRef}
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="enter absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col bg-surface px-6 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl"
            >
              <div className="flex h-[72px] items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] hover:bg-pale"
                >
                  <Close />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <nav aria-label="Main" className="mt-4 flex-1 overflow-y-auto">
                <ul>
                  {navItems.map((n) => {
                    const active = isActive(path, n.to)
                    return (
                      <li key={n.to} className="border-b border-line">
                        <Link
                          to={n.to}
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-[56px] items-center justify-between font-serif text-[1.7rem] ${
                            active ? "text-action" : "text-ink"
                          }`}
                        >
                          {n.label}
                          {active && (
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-action"
                              aria-hidden
                            />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <WhatsAppCTA full label="Book appointment" showIcon={false} />
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
