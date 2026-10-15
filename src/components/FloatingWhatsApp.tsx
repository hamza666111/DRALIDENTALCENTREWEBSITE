import { buildWhatsAppUrl } from "../lib/whatsapp"
import { WhatsApp } from "./Icons"

/**
 * Floating WhatsApp contact button positioned below the AI assistant launcher.
 * Provides instant 1-tap WhatsApp consultation access on both mobile and desktop.
 */
export default function FloatingWhatsApp() {
  const url = buildWhatsAppUrl(
    "Hello Dr Ali Dental Centre, I would like to inquire about an appointment.",
  )
  if (!url) return null

  return (
    <aside aria-label="WhatsApp quick contact">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dr Ali Dental Centre on WhatsApp"
        className="group fixed z-[35] flex h-[52px] w-[52px] min-[1200px]:h-[56px] min-[1200px]:w-[56px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_-3px_rgba(37,211,102,0.5)] transition-all duration-200 hover:scale-105 hover:bg-[#20ba5a] hover:shadow-[0_10px_24px_-2px_rgba(37,211,102,0.6)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]
          bottom-[calc(80px+env(safe-area-inset-bottom))] right-4 min-[1200px]:bottom-6 min-[1200px]:right-6"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-ink px-3 py-1.5 text-[0.8rem] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Chat on WhatsApp
        </span>
        <WhatsApp size={26} />
      </a>
    </aside>
  )
}
