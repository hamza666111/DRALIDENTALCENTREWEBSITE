import { useEffect, useRef } from "react"

/** One-time reveal. Elements are only hidden once JS has run, and are always shown after a fallback delay. */
/** fallbackMs: reveal anyway after this delay (null = only when scrolled into view). */
export function useReveal<T extends HTMLElement>(
  fallbackMs: number | null = 2500,
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    document.documentElement.classList.add("reveal-ready")
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible")
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )
    io.observe(el)
    const fallback =
      fallbackMs === null
        ? undefined
        : window.setTimeout(() => el.classList.add("is-visible"), fallbackMs)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [fallbackMs])
  return ref
}
