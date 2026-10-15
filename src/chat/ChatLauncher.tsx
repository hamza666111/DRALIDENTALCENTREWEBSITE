import { forwardRef, useEffect, useState, type ReactNode } from "react"

/**
 * Mascot artwork. The supplied PNG is a single flattened layer, so the hand
 * cannot wave on its own; the launcher uses a gentle whole-character greeting
 * sway instead (see .mascot-greet in index.css). To use true arm animation later,
 * pass an animated asset (e.g. layered SVG or Lottie) as `art`.
 */
const asset = (f: string) => `${import.meta.env.BASE_URL}chat/${f}`

export function MascotArt() {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${asset("mascot-176.webp")} 176w, ${asset("mascot-264.webp")} 264w`}
        sizes="(min-width: 1200px) 56px, 52px"
      />
      <img
        src={asset("mascot-176.png")}
        alt=""
        width={56}
        height={63}
        draggable={false}
        className="block h-auto w-[52px] select-none min-[1200px]:w-[56px]"
      />
    </picture>
  )
}

interface Props {
  onOpen: () => void
  hidden: boolean
  art?: ReactNode
}

/** Floating mascot launcher. No auto-open, sounds, badges or presence claims. */
const ChatLauncher = forwardRef<HTMLButtonElement, Props>(function ChatLauncher(
  { onOpen, hidden, art = <MascotArt /> },
  ref,
) {
  // Pause the greeting while the tab is hidden.
  const [pageHidden, setPageHidden] = useState(false)
  useEffect(() => {
    const on = () => setPageHidden(document.hidden)
    document.addEventListener("visibilitychange", on)
    return () => document.removeEventListener("visibilitychange", on)
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label="Open DADC assistant"
      aria-haspopup="dialog"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : 0}
      className={`group fixed z-[35] flex items-center justify-center rounded-full p-0.5 transition-[opacity,transform] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action
        bottom-[calc(88px+env(safe-area-inset-bottom))] right-4 min-[1200px]:bottom-[94px] min-[1200px]:right-6 ${
          hidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-ink px-3 py-1.5 text-[0.8rem] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Ask AI assistant
      </span>
      <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-[2px] group-focus-visible:-translate-y-[2px]">
        <span
          className={`mascot-greet mascot-shadow block ${
            hidden || pageHidden ? "mascot-paused" : ""
          }`}
        >
          {art}
        </span>
      </span>
    </button>
  )
})
export default ChatLauncher
