import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./redesign.css"

// JS is running, so reveal/introduction start states may apply. Without JS (or if this
// never runs) all content stays visible. Elements are always revealed within 2.5s.
document.documentElement.classList.add("reveal-ready")

// Missing or blocked images fall back to their pale frame instead of showing broken-image text.
document.addEventListener(
  "error",
  (e) => {
    const t = e.target as HTMLElement
    if (t instanceof HTMLImageElement) t.classList.add("img-failed")
  },
  true,
)

const root = document.getElementById("root")!
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
