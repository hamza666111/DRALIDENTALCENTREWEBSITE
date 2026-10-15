import { renderToString } from "react-dom/server"
import App from "./App"
import { matchRoute } from "./lib/router"
import { metaFor, renderPaths, generateSitemapXml, robotsText } from "./lib/seo"
export { renderPaths, generateSitemapXml, robotsText }
export function render(path: string) {
  return {
    html: renderToString(<App initialPath={path} />),
    meta: metaFor(matchRoute(path), path),
  }
}
