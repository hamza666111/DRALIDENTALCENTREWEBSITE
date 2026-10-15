import type { ReactNode } from "react"
import ArchLine from "./ArchLine"

interface Props {
  eyebrow: string
  title: ReactNode
  intro: ReactNode
  directAnswer?: ReactNode
  actions?: ReactNode
  media?: ReactNode
  breadcrumbs?: ReactNode
}

/** Editorial split page header used on inner pages with optional Answer-First GEO summary. */
export default function PageIntro({
  eyebrow,
  title,
  intro,
  directAnswer,
  actions,
  media,
  breadcrumbs,
}: Props) {
  return (
    <header className="page-intro relative overflow-hidden border-b border-line bg-gradient-to-b from-surface to-canvas">
      <ArchLine className="absolute -left-1/4 top-6 h-[420px] w-[150%] opacity-70" />
      <div className="shell relative">
        {breadcrumbs && <div className="pt-4">{breadcrumbs}</div>}
        <div
          className={`grid-layout items-center gap-y-10 ${
            breadcrumbs ? "pb-14 pt-6" : "py-14"
          } md:pb-20 lg:min-h-[520px]`}
        >
          <div
            className={`col-span-4 md:col-span-8 ${
              media ? "lg:col-span-6" : "lg:col-span-8"
            }`}
          >
            <p className="eyebrow enter mb-5">{eyebrow}</p>
            <h1 className="display enter enter-2 max-w-[14ch] text-ink">
              {title}
            </h1>
            <p className="enter enter-3 mt-6 max-w-[46ch] text-muted">
              {intro}
            </p>
            {directAnswer && (
              <details className="intro-details mt-5">
                <summary>More about {eyebrow.toLowerCase()}</summary>
                <p className="mt-3 max-w-[56ch] text-muted">{directAnswer}</p>
              </details>
            )}
            {actions && (
              <div className="enter enter-4 mt-8 flex flex-wrap gap-3">
                {actions}
              </div>
            )}
          </div>
          {media && (
            <div className="enter enter-3 col-span-4 md:col-span-8 lg:col-span-6">
              {media}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
