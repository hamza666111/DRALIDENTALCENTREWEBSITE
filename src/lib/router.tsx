import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"

export const normalize = (p: string) => (p.endsWith("/") ? p : `${p}/`)

const Ctx = createContext<{ path: string ; navigate: (to: string) => void }>({
  path: "/",
  navigate: () => {},
})

export function RouterProvider({
  children,
  initialPath,
}: {
  children: ReactNode
  initialPath?: string
}) {
  const [path, setPath] = useState(() =>
    normalize(
      initialPath ??
        (typeof window !== "undefined" ? window.location.pathname : "/"),
    ),
  )

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname))
    if (window.location.hash)
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(window.location.hash.slice(1)))
          ?.scrollIntoView(),
      )
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    const [p, hash] = to.split("#")
    window.history.pushState({}, "", to)
    setPath(normalize(p || "/"))
    window.dispatchEvent(new HashChangeEvent("hashchange"))
    requestAnimationFrame(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    })
  }, [])

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>
}

export const useRouter = () => useContext(Ctx)

export function isActive(current: string, to: string) {
  return to === "/" ? current === "/" : current.startsWith(to)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

export type Route = { name: "home" } | { name: "services" } | {
  name: "service"
  slug: string
} | { name: "work" } | { name: "reviews" } | { name: "team" } | {
  name: "about"
} | { name: "international-clients" } | { name: "videos" } | {
  name: "video"
  slug: string
} | { name: "blog" } | { name: "article" ; slug: string } | {
  name: "contact"
} | { name: "privacy" } | { name: "accessibility" } | { name: "notFound" }

export function matchRoute(path: string): Route {
  const parts = path.split("/").filter(Boolean)
  if (parts.length === 0) return { name: "home" }
  const [a, b] = parts
  if (parts.length === 1) {
    const simple = [
      "services",
      "work",
      "reviews",
      "team",
      "about",
      "international-clients",
      "videos",
      "blog",
      "contact",
      "privacy",
      "accessibility",
    ] as const
    const hit = simple.find((s) => s === a)
    return hit ? { name: hit } as Route : { name: "notFound" }
  }
  if (parts.length === 2 && a === "services")
    return { name: "service", slug: b }
  if (parts.length === 2 && a === "videos") return { name: "video", slug: b }
  if (parts.length === 2 && a === "blog") return { name: "article", slug: b }
  return { name: "notFound" }
}
