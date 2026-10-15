import { useId, useState } from "react"

interface Side {
  src: string | null
  alt: string
}

/**
 * Accessible before/after comparison. A native range input drives the split,
 * so keyboard, touch and mouse all work. Never auto-animates.
 */
export default function BeforeAfter({
  before,
  after,
  label,
}: {
  before: Side
  after: Side
  label: string
}) {
  const [pos, setPos] = useState(50)
  const [mode, setMode] = useState<"slider" | "side">("slider")
  const id = useId()

  const panel = (s: Side, tag: string) =>
    s.src ? (
      <img
        src={s.src}
        alt={s.alt}
        width={1200}
        height={900}
        loading="lazy"
        className="h-full w-full object-cover"
        draggable={false}
      />
    ) : (
      <div
        className={`relative h-full w-full ${
          tag === "Before" ? "bg-[#dfe7ea]" : "bg-[#edf3f5]"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-center ${
            mode === "side"
              ? "left-1/2"
              : tag === "Before"
                ? "left-1/4"
                : "left-3/4"
          } text-sm font-semibold text-muted`}
        >
          {tag} image
          <br />
          <span className="font-normal">placeholder</span>
        </span>
      </div>
    )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <div
          role="group"
          aria-label="Comparison view"
          className="flex gap-1 rounded-[8px] border border-line bg-surface p-1"
        >
          {(["slider", "side"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-[44px] rounded-[6px] px-4 text-sm font-semibold transition-colors ${
                mode === m ? "bg-action text-white" : "text-ink hover:bg-pale"
              }`}
            >
              {m === "slider" ? "Slider" : "Side by side"}
            </button>
          ))}
        </div>
      </div>

      {mode === "slider" ? (
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[16/7] select-none overflow-hidden rounded-[12px] border border-line focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-action">
          <div className="absolute inset-0">{panel(after, "After")}</div>
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            {panel(before, "Before")}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-action shadow-md">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </span>
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-[6px] bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
            Before
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-[6px] bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
            After
          </span>
          <label htmlFor={id} className="sr-only">
            Comparison position: amount of before image shown
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-valuetext={`${pos}% before image shown`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-0"
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Before", before],
            ["After", after],
          ].map(([t, s]) => (
            <figure key={t as string}>
              <div className="aspect-[16/10] overflow-hidden rounded-[12px] border border-line">
                {panel(s as Side, t as string)}
              </div>
              <figcaption className="mt-2 text-sm font-semibold text-ink">
                {t as string}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {mode === "slider" && (
        <p className="mt-3 text-center text-sm text-muted">
          Drag the handle, or focus it and use the arrow keys, to compare.
        </p>
      )}
    </div>
  )
}
