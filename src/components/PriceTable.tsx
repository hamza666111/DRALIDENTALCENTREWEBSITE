import type { Service } from "../config/site"
import { formatFee } from "../lib/whatsapp"
import { Link } from "../lib/router"

/** Fee overview. Table on md+, labelled blocks on small screens so nothing is dropped. */
export default function PriceTable({
  items,
  caption,
}: {
  items: Service[]
  caption: string
}) {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-[12px] border border-line bg-surface md:block">
        <table className="w-full border-collapse text-left text-[0.95rem]">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-pale text-[0.8rem] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Treatment
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Fee
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Pricing basis
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                What is included
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.slug} className="border-t border-line align-top">
                <th scope="row" className="px-6 py-5 font-semibold text-ink">
                  <Link
                    to={`/services/${s.slug}/`}
                    className="inline-flex min-h-[44px] items-center hover:text-action hover:underline"
                  >
                    {s.name}
                  </Link>
                </th>
                <td className="px-6 py-5 font-semibold text-action">
                  {formatFee(s.fee)}
                </td>
                <td className="px-6 py-5 text-muted">
                  {s.fee.basis ?? "To be confirmed"}
                </td>
                <td className="px-6 py-5 text-muted">
                  {s.included.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden" aria-label={caption}>
        {items.map((s) => (
          <li
            key={s.slug}
            className="rounded-[12px] border border-line bg-surface p-5"
          >
            <Link
              to={`/services/${s.slug}/`}
              className="inline-flex min-h-[44px] items-center font-serif text-2xl text-ink hover:text-action"
            >
              {s.name}
            </Link>
            <dl className="mt-3 space-y-2 text-[0.95rem]">
              <div className="flex justify-between gap-4 border-t border-line pt-2">
                <dt className="text-muted">Fee</dt>
                <dd className="text-right font-semibold text-action">
                  {formatFee(s.fee)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2">
                <dt className="text-muted">Pricing basis</dt>
                <dd className="text-right">
                  {s.fee.basis ?? "To be confirmed"}
                </dd>
              </div>
              <div className="border-t border-line pt-2">
                <dt className="text-muted">What is included</dt>
                <dd className="mt-1">{s.included.join(", ")}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
