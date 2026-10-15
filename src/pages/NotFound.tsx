import { Link } from "../lib/router"
import PageIntro from "../components/PageIntro"

export default function NotFound() {
  return (
    <PageIntro
      eyebrow="Page not found"
      title="We couldn’t find that page."
      intro="The link may be out of date, or the page may have moved. These pages may help:"
      actions={
        <>
          <Link to="/" className="btn btn-primary">
            Go to home
          </Link>
          <Link to="/services/" className="btn btn-secondary">
            Browse treatments
          </Link>
          <Link to="/contact/" className="btn btn-secondary">
            Contact the clinic
          </Link>
        </>
      }
    />
  )
}
