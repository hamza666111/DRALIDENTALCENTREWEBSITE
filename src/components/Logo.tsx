import { clinic } from "../config/site"

interface LogoProps {
  inverted?: boolean
  className?: string
  showText?: boolean
}

/**
 * Brand logo component rendering the Dr Ali Dental Centre icon followed
 * by the clinic name in the signature serif typography.
 * Responsive on all screens including mobile, with rounded logo corners.
 */
export default function Logo({
  inverted = false,
  className = "",
  showText = true,
}: LogoProps) {
  const { src, alt, width, height } = clinic.logo

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {src && (
        <img
          src={src}
          alt={alt || `${clinic.name} logo icon`}
          width={width || 48}
          height={height || 48}
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-[8px] sm:rounded-[10px] object-cover shrink-0 shadow-xs"
        />
      )}
      {showText && (
        <span
          className={`font-serif text-[1.12rem] xs:text-[1.28rem] sm:text-[1.55rem] md:text-[1.75rem] leading-none tracking-tight whitespace-nowrap ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          {clinic.name}
        </span>
      )}
    </span>
  )
}
