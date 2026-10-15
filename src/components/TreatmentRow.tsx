import { Link } from "../lib/router"
import { ArrowRight } from "./Icons"

interface Props {
  index: number
  title: string
  summary: string
  to: string
  linkLabel: string
}

/** Numbered editorial treatment row with pale-blue hover and arrow nudge. */
export default function TreatmentRow({
  index,
  title,
  summary,
  to,
  linkLabel,
}: Props) {
  return (
    <li className="border-b border-line first:border-t">
      <Link
        to={to}
        aria-label={linkLabel}
        className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 px-2 py-6 transition-colors duration-200 hover:bg-pale focus-visible:bg-pale md:grid-cols-[5rem_1fr_1.2fr_auto] md:px-4 md:py-7"
      >
        <span className="font-serif text-3xl leading-none text-brand md:text-4xl">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-serif text-2xl leading-tight text-ink md:text-[1.9rem]">
          {title}
        </span>
        <span className="col-start-2 row-start-2 text-[0.95rem] text-muted md:col-start-3 md:row-start-1">
          {summary}
        </span>
        <span className="arrow-move col-start-3 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center rounded-full border border-line text-action md:col-start-4 md:row-span-1">
          <ArrowRight size={18} />
        </span>
      </Link>
    </li>
  )
}
