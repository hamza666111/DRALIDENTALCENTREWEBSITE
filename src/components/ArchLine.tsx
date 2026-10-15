/** Thin dental-arch curve used as a quiet decorative device. */
export default function ArchLine({
  className = "",
  stroke = "#D6E0E3",
}: {
  className?: string
  stroke?: string
}) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 800 240"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 238C120 70 270 6 400 6s280 64 400 232"
        stroke={stroke}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M60 238C170 100 290 46 400 46s230 54 340 192"
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="2 7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
