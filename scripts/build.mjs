import { build } from "vite"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
const temp = ".prerender"
await build()
await build({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: temp,
    copyPublicDir: false,
    emptyOutDir: true,
  },
})
try {
  const { render, renderPaths, generateSitemapXml, robotsText } = await import(
    pathToFileURL(path.resolve(temp, "entry-server.js")).href
  )
  const template = await fs.readFile("dist/index.html", "utf8")
  const escape = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  const pages = [...renderPaths(), "/404/"]
  for (const url of pages) {
    const { html, meta: m } = render(url)
    const metas = [
      ["name", "description", m.description],
      ["name", "robots", m.noindex ? "noindex, follow" : "index, follow"],
      ["property", "og:title", m.title],
      ["property", "og:description", m.description],
      ["property", "og:type", m.ogType],
      ["property", "og:url", m.canonical],
      ["property", "og:image", m.ogImage],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", m.title],
      ["name", "twitter:description", m.description],
      ["name", "twitter:image", m.ogImage],
    ]
      .filter(([, , v]) => v)
      .map(([a, k, v]) => `<meta ${a}="${k}" content="${escape(v)}" />`)
      .join("\n")
    let out = template
      .replace(/<title>[\s\S]*?<\/title>/, "")
      .replace(/<meta name="(?:description|robots)"[^>]*>/g, "")
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
      .replace(
        "</head>",
        `<title>${escape(m.title)}</title>\n${metas}\n${
          m.canonical
            ? `<link rel="canonical" href="${escape(m.canonical)}" />`
            : ""
        }\n${m.jsonLd.map((d) => `<script type="application/ld+json" data-seo>${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`).join("\n")}\n</head>`,
      )
    const dest =
      url === "/404/" ? "dist/404.html" : path.join("dist", url, "index.html")
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, out)
  }
  await fs.writeFile("dist/sitemap.xml", generateSitemapXml())
  await fs.writeFile("dist/robots.txt", robotsText())
  console.log(
    `Pre-rendered ${pages.length} pages, including a real 404 document.`,
  )
} finally {
  await fs.rm(temp, { recursive: true, force: true })
}
