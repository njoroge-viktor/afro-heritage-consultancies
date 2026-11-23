import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { IcArrowRight, IcClock, IcMapPin, IcMenu, IcPhone, IcWhatsapp } from "./icons";
import { Container, Logo, ThemeToggle, btn, cx, useTooltip } from "./ui";
import { SITE, whatsappLink } from "../lib/site";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/programs", label: "Programs" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const drawer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bootstrap Offcanvas for the mobile menu; close it whenever the route changes.
  useEffect(() => {
    const el = drawer.current;
    const oc = Offcanvas.getOrCreateInstance(el);
    return () => oc.dispose();
  }, []);
  useEffect(() => {
    Offcanvas.getInstance(drawer.current)?.hide();
  }, [pathname]);

  return (
    <header className={cx("tw:sticky tw:top-0 tw:z-50 tw:transition tw:duration-300", scrolled ? "tw:bg-cream/90 tw:shadow-sm tw:backdrop-blur" : "tw:bg-cream")}>
      <Container className={cx("tw:flex tw:items-center tw:justify-between tw:gap-4 tw:transition-all tw:duration-300", scrolled ? "tw:h-16" : "tw:h-20")}>
        <Link to="/" aria-label={`${SITE.name} home`} className="tw:shrink-0 tw:transition tw:hover:opacity-80">
          <Logo className={cx("tw:w-auto tw:transition-all tw:duration-300", scrolled ? "tw:h-10" : "tw:h-12 tw:sm:h-14")} />
        </Link>
        <nav aria-label="Main" className="tw:hidden tw:items-center tw:gap-6 tw:md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => cx("link-slide tw:py-1 tw:text-sm tw:font-medium tw:transition", isActive ? "active tw:text-rust" : "tw:text-ink/70 tw:hover:text-ink")}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="tw:flex tw:items-center tw:gap-2">
          <ThemeToggle />
          <Link to="/enroll" className={btn("primary", "md", "tw:max-md:hidden")}>Enrol now <IcArrowRight className="nudge" /></Link>
          <button type="button" data-bs-toggle="offcanvas" data-bs-target="#mobile-nav" aria-controls="mobile-nav" aria-label="Open menu"
            className="tw:flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-full tw:transition tw:hover:bg-ink/5 tw:md:hidden">
            <IcMenu className="tw:h-6 tw:w-6" />
          </button>
        </div>
      </Container>

      {/* Bootstrap offcanvas drawer (mobile) */}
      <div ref={drawer} className="offcanvas offcanvas-end" tabIndex={-1} id="mobile-nav" aria-labelledby="mobile-nav-title">
        <div className="offcanvas-header">
          <h2 id="mobile-nav-title" className="offcanvas-title tw:text-xl tw:font-semibold">Menu</h2>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu" />
        </div>
        <div className="offcanvas-body tw:flex tw:flex-col tw:gap-1">
          {links.map((l, i) => (
            <NavLink key={l.to} to={l.to} end={l.end} style={{ transitionDelay: `${i * 40}ms` }}
              className={({ isActive }) => cx("tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:px-4 tw:py-3 tw:font-medium tw:transition tw:hover:translate-x-1", isActive ? "tw:bg-sage-300" : "tw:hover:bg-ink/5")}>
              {l.label} <IcArrowRight className="tw:opacity-40" />
            </NavLink>
          ))}
          <div className="tw:mt-4 tw:grid tw:gap-2">
            <Link to="/enroll" className={btn("primary", "md")}>Enrol now</Link>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btn("whatsapp", "md")}><IcWhatsapp /> WhatsApp us</a>
          </div>
          <p className="tw:mt-auto tw:pt-6 tw:text-sm tw:text-ink/60">{SITE.address}<br />{SITE.hours}</p>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="tw:mt-24 tw:bg-night tw:text-paper">
      <Container className="tw:grid tw:gap-10 tw:py-14 tw:md:grid-cols-[1.4fr_1fr_1fr]">
        <div data-reveal>
          <div className="tw:flex tw:items-center tw:gap-3">
            <img src="/images/eagle.png" alt="" width="72" height="47" className="tw:h-11 tw:w-auto tw:animate-float" />
            <div>
              <p className="tw:font-display tw:text-xl tw:font-semibold">{SITE.name}</p>
              <p className="tw:text-sm tw:italic tw:text-leaf">{SITE.tagline}</p>
            </div>
          </div>
          <p className="tw:mt-5 tw:max-w-sm tw:text-sm tw:leading-relaxed tw:text-paper/70">
            A Kenyan community education organization helping learners and families across Ngong learn, earn and connect.
          </p>
        </div>
        <div data-reveal>
          <h2 className="tw:font-sans tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wider tw:text-leaf">Explore</h2>
          <ul className="tw:mt-4 tw:space-y-2 tw:text-sm tw:text-paper/80">
            {[["Programs", "/programs"], ["Events", "/events"], ["Enrol", "/enroll"], ["About us", "/about"], ["Contact", "/contact"]].map(([l, to]) => (
              <li key={to}><Link to={to} className="slide-right tw:hover:text-leaf">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h2 className="tw:font-sans tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wider tw:text-leaf">Visit or call</h2>
          <ul className="tw:mt-4 tw:space-y-3 tw:text-sm tw:text-paper/80">
            <li className="tw:flex tw:gap-2"><IcMapPin className="tw:mt-0.5 tw:text-leaf" />{SITE.address}</li>
            <li className="tw:flex tw:gap-2"><IcClock className="tw:mt-0.5 tw:text-leaf" />{SITE.hours}</li>
            <li className="tw:flex tw:gap-2"><IcPhone className="tw:mt-0.5 tw:text-leaf" /><a href={SITE.phoneHref} className="slide-right tw:hover:text-leaf">{SITE.phone}</a></li>
            <li className="tw:flex tw:gap-2"><IcWhatsapp className="tw:mt-0.5 tw:text-leaf" /><a href={whatsappLink()} target="_blank" rel="noreferrer" className="slide-right tw:hover:text-leaf">Chat on WhatsApp</a></li>
          </ul>
        </div>
      </Container>
      <div className="tw:border-t tw:border-paper/10">
        <Container className="tw:flex tw:flex-col tw:items-center tw:justify-between tw:gap-2 tw:py-5 tw:text-xs tw:text-paper/60 tw:sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <Link to="/admin" className="link-slide tw:hover:text-leaf">Staff login</Link>
        </Container>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  const { pathname } = useLocation();
  const ref = useTooltip("Chat with us on WhatsApp", "left");
  if (pathname.startsWith("/admin")) return null;
  return (
    <a ref={ref} href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"
      className="tw:fixed tw:bottom-5 tw:right-5 tw:z-40 tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-whatsapp tw:text-3xl tw:text-white tw:shadow-lg tw:shadow-black/25 tw:transition tw:duration-300 tw:hover:scale-110 tw:hover:-rotate-12">
      <span className="tw:absolute tw:inset-0 tw:animate-ping tw:rounded-full tw:bg-whatsapp tw:opacity-30" aria-hidden />
      <IcWhatsapp className="tw:relative" />
    </a>
  );
}

/** Adds .is-visible to [data-reveal] elements as they scroll into view (staggered per batch). */
function useReveal(pathname) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.style.setProperty("--reveal-delay", `${Math.min(i++, 6) * 90}ms`);
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useReveal(pathname);
  return (
    <>
      <a href="#main" className="tw:sr-only tw:focus:not-sr-only tw:focus:fixed tw:focus:left-4 tw:focus:top-4 tw:focus:z-[100] tw:focus:rounded-full tw:focus:bg-ink tw:focus:px-4 tw:focus:py-2 tw:focus:text-cream">Skip to content</a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
