import { useId, useState } from "react"
import type { FAQ } from "../config/site"
import { Plus } from "./Icons"

export default function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()
  return (
    <div className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i
        const btn = `${base}-b${i}`
        const panel = `${base}-p${i}`
        return (
          <div key={f.question} className="border-b border-line">
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[60px] w-full items-center justify-between gap-6 py-4 text-left font-semibold text-ink transition-colors hover:text-action"
              >
                <span>{f.question}</span>
                <Plus
                  size={20}
                  className={`shrink-0 text-action transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div
                className={`overflow-hidden transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="max-w-[60ch] pb-6 text-muted">{f.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
