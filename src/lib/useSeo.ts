import { useEffect } from "react"
import { seo } from "../config/site"
import { metaFor } from "./seo"
import type { Route } from "./router"
function setMeta(
  attr: "name" | "property",
  key: string,
  content: string | null,
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}
export function useSeo(route: Route, path: string) {
  useEffect(() => {
    const m = metaFor(route, path)
    document.title = m.title
    setMeta("name", "description", m.description)
    setMeta("name", "robots", m.noindex ? "noindex, follow" : "index, follow")
    for (const [key, value] of Object.entries({
      "og:site_name": seo.siteName,
      "og:locale": "en_PK",
      "og:title": m.title,
      "og:description": m.description,
      "og:type": m.ogType,
      "og:url": m.canonical,
      "og:image": m.ogImage,
    }))
      setMeta("property", key, value || null)
    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", m.title)
    setMeta("name", "twitter:description", m.description)
    setMeta("name", "twitter:image", m.ogImage || null)
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (m.canonical) {
      if (!link) {
        link = document.createElement("link")
        link.rel = "canonical"
        document.head.appendChild(link)
      }
      link.href = m.canonical
    } else link?.remove()
    document.head
      .querySelectorAll("script[data-seo]")
      .forEach((n) => n.remove())
    for (const data of m.jsonLd) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.dataset.seo = ""
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    }
  }, [route, path])
}
