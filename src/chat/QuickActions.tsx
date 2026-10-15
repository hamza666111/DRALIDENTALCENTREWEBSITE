export default function QuickActions({
  items,
  onPick,
  disabled,
}: {
  items: string[]
  onPick: (q: string) => void
  disabled?: boolean
}) {
  return (
    <ul className="grid gap-2" aria-label="Suggested questions">
      {items.map((q) => (
        <li key={q}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-[10px] border border-line bg-surface px-4 text-left text-[0.92rem] font-semibold text-ink transition-colors duration-150 hover:border-action hover:bg-pale hover:text-action active:scale-[0.99] disabled:opacity-50"
          >
            {q}
            <span aria-hidden className="text-action">
              →
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
