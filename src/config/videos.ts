/** Add only real, publishable media. Keep unpublished records with published:false.
 * embedUrl must be a supported HTTPS YouTube/Vimeo embed URL; or use a local/HTTPS video file.
 * thumbnail is a local path or HTTPS URL. Transcript is visible text, captions is a WebVTT URL.
 */
export interface ClinicVideo {
  slug: string
  title: string
  summary: string
  category: "Clinic & team" | "Procedures" | "Oral health" | "Patient stories"
  thumbnail: string
  thumbnailAlt: string
  published: boolean
  uploadDate?: string
  duration?: string
  embedUrl?: string
  src?: string
  captions?: string
  transcript?: string
  reviewer?: string
  reviewedOn?: string
  relatedServices?: string[]
}
export const videos: ClinicVideo[] = []
export function safeMediaUrl(value?: string): string | undefined {
  if (!value) return undefined
  if (value.startsWith("/") && !value.startsWith("//")) return value
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.href : undefined
  } catch {
    return undefined
  }
}
export function safeEmbed(value?: string): string | undefined {
  if (!value) return undefined
  try {
    const u = new URL(value)
    const host = u.hostname
    return u.protocol === "https:" &&
      ((["www.youtube.com", "www.youtube-nocookie.com"].includes(host) &&
        u.pathname.startsWith("/embed/")) ||
        (host === "player.vimeo.com" && u.pathname.startsWith("/video/")))
      ? u.href
      : undefined
  } catch {
    return undefined
  }
}
export const publishedVideos = () =>
  videos.filter(
    (v) =>
      v.published &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug) &&
      safeMediaUrl(v.thumbnail) &&
      (safeMediaUrl(v.src) || safeEmbed(v.embedUrl)),
  )
export const findVideo = (slug: string) =>
  publishedVideos().find((v) => v.slug === slug)
export function durationLabel(iso?: string) {
  if (!iso) return ""
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!m) return ""
  return [m[1] && `${m[1]} hr`, m[2] && `${m[2]} min`, m[3] && `${m[3]} sec`]
    .filter(Boolean)
    .join(" ")
}
