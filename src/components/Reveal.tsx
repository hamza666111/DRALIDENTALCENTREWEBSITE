import type { ElementType, ReactNode } from "react"
import { useReveal } from "../lib/useReveal"

export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  id,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
  id?: string
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
