/** Responsive srcset for Unsplash URLs (auto=format serves AVIF/WebP where supported). */
export const srcSet = (src: string) =>
  src.includes("images.unsplash.com")
    ? [480, 800, 1200, 1600]
        .map((w) => `${src.replace(/w=\d+/, `w=${w}`)} ${w}w`)
        .join(", ")
    : undefined
