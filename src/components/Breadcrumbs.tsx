import { Link } from "../lib/router"

export default function Breadcrumbs({
  items,
}: {
  items: { label: string ; to?: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.to ? (
              <Link
                to={it.to}
                className="inline-flex min-h-[44px] items-center hover:text-action hover:underline"
              >
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span aria-hidden className="text-line">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
