import type { Category } from "../config/site"

/** Line-drawn tooth illustration, varied gently by category. Decorative only. */
export default function ToothIllustration({
  variant = "preventive",
  className = "",
}: {
  variant?: Category | "implant"
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="#E8F3F6" />
      <path d="M60 104c0 0 0 0 0 0" />
      {variant === "implant" ? (
        <>
          <path
            d="M40 30c-6 0-10 5-10 11 0 6 4 9 6 13h48c2-4 6-7 6-13 0-6-4-11-10-11-5 0-7 3-20 3s-15-3-20-3z"
            fill="#fff"
            stroke="#0788B8"
            strokeWidth="1.6"
          />
          <path
            d="M50 54h20l-2 8H52z"
            fill="#fff"
            stroke="#526169"
            strokeWidth="1.4"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${51 + i * 0.6} ${66 + i * 7}h${18 - i * 1.2}`}
              stroke="#526169"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <path d="M53 66l2 34h10l2-34" stroke="#526169" strokeWidth="1.4" />
        </>
      ) : (
        <path
          d="M42 26c-9 0-15 7-15 16 0 10 5 15 7 25 1.5 9 3.5 25 9 25 5.5 0 5-18 17-18s11.5 18 17 18c5.5 0 7.5-16 9-25 2-10 7-15 7-25 0-9-6-16-15-16-6 0-9 3.5-18 3.5S48 26 42 26z"
          fill="#fff"
          stroke="#0788B8"
          strokeWidth="1.6"
        />
      )}
      {variant === "cosmetic" && (
        <path d="M88 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#0788B8" />
      )}
      {variant === "restorative" && (
        <path
          d="M50 44c4 4 16 4 20 0"
          stroke="#0788B8"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
      {variant === "preventive" && (
        <path
          d="M45 40c2-5 6-7 10-7"
          stroke="#0788B8"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity=".6"
        />
      )}
    </svg>
  )
}
