import { useEffect, useRef, type ReactNode } from "react"
import { clinic, clinicAddress, navItems, services } from "../config/site"
import { Link } from "../lib/router"
import { buildWhatsAppUrl } from "../lib/whatsapp"
import ArchLine from "./ArchLine"
import { Clock, Facebook, Instagram, Mail, Phone, Pin, WhatsApp } from "./Icons"
import Logo from "./Logo"

const pending = <span className="text-[#8a9aa1]">To be confirmed</span>

function FooterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const sync = () => {
      if (ref.current) ref.current.open = mq.matches
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return (
    <details ref={ref} className="footer-group" open>
      <summary>{title}</summary>
      {children}
    </details>
  )
}

export default function SiteFooter() {
  const linkCls =
    "inline-flex min-h-[36px] items-center text-[#c9d4d8] hover:text-white hover:underline"
  return (
    <footer className="site-footer relative overflow-hidden bg-night text-[0.92rem] text-[#c9d4d8]">
      <ArchLine
        className="absolute -right-1/4 -top-10 h-72 w-[90%] opacity-20"
        stroke="#5f7d88"
      />
      <div className="shell relative pb-36 pt-16">
        <div className="grid-layout gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-3">
            <Link
              to="/"
              aria-label={`${clinic.name} home`}
              className="inline-flex min-h-[44px] items-center"
            >
              <Logo inverted />
            </Link>
            <p className="mt-4 max-w-[30ch]">{clinic.tagline}</p>
            <div className="mt-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-white/70">
                Connect with us
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={
                    clinic.social?.facebook ||
                    "https://facebook.com/dr.alidentalcentre"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Dr Ali Dental Centre on Facebook (@dr.alidentalcentre)"
                  title="Facebook: @dr.alidentalcentre"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors duration-150 hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={
                    clinic.social?.instagram ||
                    "https://instagram.com/dr.alidentalcentre"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Dr Ali Dental Centre on Instagram (@dr.alidentalcentre)"
                  title="Instagram: @dr.alidentalcentre"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors duration-150 hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={
                    buildWhatsAppUrl(
                      "Hello Dr Ali Dental Centre, I would like to connect.",
                    ) || "https://wa.me/923282333999"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Dr Ali Dental Centre on WhatsApp"
                  title="WhatsApp: 03282333999"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#25D366]/40 bg-[#25D366]/20 text-[#25D366] transition-colors duration-150 hover:bg-[#25D366]/30 hover:text-white"
                >
                  <WhatsApp size={18} />
                </a>
              </div>
              <p className="mt-2 text-[0.75rem] text-white/60">
                @dr.alidentalcentre
              </p>
            </div>
          </div>
          <FooterGroup title="Treatments">
            <nav aria-label="Treatments">
              <ul>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link className={linkCls} to={`/services/${s.slug}/`}>
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className={linkCls} to="/services/">
                    All treatments and fees
                  </Link>
                </li>
              </ul>
            </nav>
          </FooterGroup>
          <FooterGroup title="Clinic">
            <nav aria-label="Clinic">
              <ul>
                {navItems.slice(2).map((n) => (
                  <li key={n.to}>
                    <Link className={linkCls} to={n.to}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </FooterGroup>
          <FooterGroup title="Visit us">
            <div>
              <ul className="space-y-3">
                <li>
                  {clinicAddress && clinic.mapUrl ? (
                    <a
                      href={clinic.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-[44px] items-start gap-3 rounded-[4px] transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Get directions to ${clinicAddress} (opens in a new tab)`}
                    >
                      <Pin size={18} className="mt-1 shrink-0 text-white/80" />
                      <span>
                        <span className="underline decoration-line underline-offset-2 group-hover:decoration-white">
                          {clinicAddress} ↗
                        </span>
                        <span className="block text-[0.78rem] text-white/65 group-hover:text-white/85">
                          Get directions
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex gap-3">
                      <Pin size={18} className="mt-1 shrink-0 text-white/80" />
                      {clinicAddress || <>Address: {pending}</>}
                    </span>
                  )}
                </li>
                <li className="flex gap-3">
                  <Phone size={18} className="mt-1 shrink-0" />
                  {clinic.phone ? (
                    <a
                      className="hover:text-white"
                      href={`tel:${clinic.phone}`}
                    >
                      {clinic.phone}
                    </a>
                  ) : (
                    <span>Phone: {pending}</span>
                  )}
                </li>
                <li className="flex gap-3">
                  <Mail size={18} className="mt-1 shrink-0 text-white/80" />
                  {clinic.email ? (
                    <a
                      className="underline decoration-line hover:text-white hover:decoration-white transition-colors duration-150"
                      href={`mailto:${clinic.email}`}
                    >
                      {clinic.email}
                    </a>
                  ) : (
                    <span>Email: {pending}</span>
                  )}
                </li>
                <li className="flex gap-3">
                  <Clock size={18} className="mt-1 shrink-0" />
                  {clinic.openingHours ? (
                    <ul>
                      {clinic.openingHours.map((h) => (
                        <li key={h.days}>
                          {h.days}: {h.hours}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Opening hours: {pending}</span>
                  )}
                </li>
              </ul>
            </div>
          </FooterGroup>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.82rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link className={linkCls} to="/privacy/">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/accessibility/">
                Accessibility statement
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
