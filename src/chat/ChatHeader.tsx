import { Close, Tooth } from "../components/Icons"
import WhatsAppHandoff from "./WhatsAppHandoff"

interface Props {
  titleId: string
  onClose: () => void
  onClear: () => void
  canClear: boolean
}

export default function ChatHeader({
  titleId,
  onClose,
  onClear,
  canClear,
}: Props) {
  return (
    <div className="shrink-0 border-b border-line bg-surface px-4 pb-2 pt-[calc(10px+env(safe-area-inset-top))] sm:pt-3">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 hidden h-10 w-10 min-[360px]:flex shrink-0 items-center justify-center rounded-full bg-pale text-brand"
          aria-hidden
        >
          <Tooth size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="font-serif text-[1.3rem] leading-tight text-ink sm:text-[1.45rem]"
          >
            DADC Assistant
          </h2>
          <p className="text-[0.8rem] leading-snug text-muted">
            Treatments, fees &amp; planning your visit
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-pale"
        >
          <Close size={22} />
          <span className="sr-only">Close chat</span>
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1">
        <WhatsAppHandoff compact label="Chat on WhatsApp" />
        {canClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-[44px] items-center rounded-[8px] px-3 text-[0.85rem] font-semibold text-muted transition-colors hover:bg-pale hover:text-ink"
          >
            Clear chat<span className="sr-only"> conversation</span>
          </button>
        )}
      </div>
    </div>
  )
}
