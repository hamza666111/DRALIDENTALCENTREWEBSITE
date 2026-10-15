import type { ReactNode } from "react"

interface Props {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  as?: "h1" | "h2"
  id?: string
  inverted?: boolean
}

/** Eyebrow + serif heading, with optional intro set to the right on large screens. */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  aside,
  as: H = "h2",
  id,
  inverted,
}: Props) {
  return (
    <div className="grid-layout items-end gap-y-5">
      <div className="col-span-4 md:col-span-8 lg:col-span-7">
        {eyebrow && (
          <p className={`eyebrow mb-4 ${inverted ? "!text-[#8fd3ec]" : ""}`}>
            {eyebrow}
          </p>
        )}
        <H
          id={id}
          className={`${H === "h1" ? "display" : "h2"} ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </H>
      </div>
      {(intro || aside) && (
        <div
          className={`col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9 ${
            inverted ? "text-[#b9c7cc]" : "text-muted"
          }`}
        >
          {intro && <p>{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  )
}
