import { useEffect, useMemo, useRef } from "react"
import MobileBookingBar from "./components/MobileBookingBar"
import FloatingWhatsApp from "./components/FloatingWhatsApp"
import ChatWidget from "./chat/ChatWidget"
import SiteFooter from "./components/SiteFooter"
import SiteHeader from "./components/SiteHeader"
import { getService, pageLaunch } from "./config/site"
import { useSeo } from "./lib/useSeo"
import { matchRoute, RouterProvider, useRouter, type Route } from "./lib/router"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Work from "./pages/Work"
import Reviews from "./pages/Reviews"
import About from "./pages/About"
import Team from "./pages/Team"
import Blog from "./pages/Blog"
import Article from "./pages/Article"
import Contact from "./pages/Contact"
import { Accessibility, Privacy } from "./pages/Legal"
import ServiceDetail from "./pages/ServiceDetail"
import Services from "./pages/Services"
import InternationalClients from "./pages/InternationalClients"
import Videos from "./pages/Videos"
import Video from "./pages/Video"

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Home />
    case "services":
      return <Services />
    case "service":
      return <ServiceDetail slug={route.slug} />
    case "work":
      return <Work />
    case "reviews":
      return <Reviews />
    case "team":
      return <Team />
    case "about":
      return <About />
    case "international-clients":
      return pageLaunch.internationalClients ? (
        <InternationalClients />
      ) : (
        <NotFound />
      )
    case "videos":
      return pageLaunch.videos ? <Videos /> : <NotFound />
    case "video":
      return <Video slug={route.slug} />
    case "blog":
      return <Blog />
    case "article":
      return <Article slug={route.slug} />
    case "contact":
      return <Contact />
    case "privacy":
      return <Privacy />
    case "accessibility":
      return <Accessibility />
    default:
      return <NotFound />
  }
}

function Shell() {
  const { path } = useRouter()
  const route = useMemo(() => matchRoute(path), [path])
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)
  useSeo(route, path)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [path])

  const treatment =
    route.name === "service" ? getService(route.slug)?.name : undefined

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[8px] focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold focus:text-action"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className={`outline-none page-${route.name}`}
      >
        <Page key={path} route={route} />
      </main>
      <SiteFooter />
      <MobileBookingBar treatment={treatment} />
      <FloatingWhatsApp />
      <ChatWidget />
    </>
  )
}

export default function App({ initialPath }: { initialPath?: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <Shell />
    </RouterProvider>
  )
}
