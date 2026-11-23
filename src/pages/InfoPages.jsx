import { Link } from "react-router-dom";
import { IcClock, IcHeart, IcHandshake, IcLightbulb, IcMapPin, IcPhone, IcSprout } from "../components/icons";
import { IcWhatsapp } from "../components/icons";
import { ButtonLink, Container, Eyebrow, Logo, SectionTitle } from "../components/ui";
import { ContactForm } from "../components/forms";
import { CATEGORIES, SITE, whatsappLink } from "../lib/site";

export function About() {
  return (
    <>
      <section className="tw:bg-sage-300 tw:py-16">
        <Container className="tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[1.3fr_1fr]">
          <div className="enter-left">
            <Eyebrow className="tw:text-rust-dark">About AHC</Eyebrow>
            <h1 className="tw:mt-3 tw:text-4xl tw:font-semibold tw:leading-tight tw:sm:text-5xl">A community education home in Ngong</h1>
            <p className="tw:mt-5 tw:text-lg tw:leading-relaxed tw:text-ink/80">
              Afro Heritage Consultancies is a Kenyan community education organization serving learners and families across Ngong. We combine quality tuition, practical digital skills training and community-building programs to help people learn, earn and connect.
            </p>
          </div>
          <div className="enter-right tw:mx-auto tw:w-full tw:max-w-sm"><Logo className="tw:h-auto tw:w-full" /></div>
        </Container>
      </section>

      <Container className="tw:py-16">
        <SectionTitle eyebrow="Our programs" title="Three ways we serve the community" />
        <div className="tw:grid tw:gap-5 tw:md:grid-cols-3">
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <Link key={k} data-reveal to={`/programs?category=${k}`} className="lift tw:rounded-3xl tw:bg-surface tw:p-7 tw:ring-1 tw:ring-ink/10 tw:hover:ring-rust/40">
              <h3 className="tw:text-xl tw:font-semibold">{c.label}</h3>
              <p className="tw:mt-2 tw:text-sm tw:leading-relaxed tw:text-ink/70">{c.blurb}</p>
            </Link>
          ))}
        </div>

        <SectionTitle eyebrow="What guides us" title="Our values" />
        <div className="tw:grid tw:gap-5 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
          {[[IcHeart, "Care first", "We teach the whole learner — mind and heart."], [IcLightbulb, "Practical learning", "Skills people can use at school, at work and in business."], [IcHandshake, "Community", "Programs that bring neighbours together and tell local stories."], [IcSprout, "Affordable access", "Quality learning that families in Ngong can reach."]].map(([I, t, d]) => (
            <div key={t} data-reveal className="lift tw:rounded-3xl tw:bg-sage-100 tw:p-6">
              <I className="icon-pop tw:h-7 tw:w-7 tw:text-rust" />
              <h3 className="tw:mt-4 tw:text-lg tw:font-semibold">{t}</h3>
              <p className="tw:mt-1 tw:text-sm tw:text-ink/70">{d}</p>
            </div>
          ))}
        </div>

        <section id="privacy" data-reveal className="tw:mt-16 tw:scroll-mt-28 tw:rounded-3xl tw:bg-surface tw:p-8 tw:ring-1 tw:ring-ink/10">
          <h2 className="tw:text-2xl tw:font-semibold">Privacy note</h2>
          <p className="tw:mt-3 tw:max-w-3xl tw:text-ink/75">
            When you send an enrollment request or message, we store your name, phone number and the details you share so our team can contact you about that request. We don't sell or share your details. To have your information removed, call or WhatsApp us on {SITE.phone}.
          </p>
        </section>
      </Container>
    </>
  );
}

export function Contact() {
  return (
    <Container className="tw:py-14">
      <SectionTitle eyebrow="Contact" title="Talk to the AHC team" subtitle="Questions about tuition, courses, hikes or the coworking space? Send a message, call or WhatsApp us." />
      <div className="tw:grid tw:gap-10 tw:lg:grid-cols-[1fr_1.3fr]">
        <div className="tw:space-y-4">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" data-reveal="left" className="lift tw:flex tw:items-center tw:gap-4 tw:rounded-3xl tw:bg-whatsapp tw:p-6 tw:text-white tw:transition tw:hover:brightness-95">
            <IcWhatsapp className="tw:h-10 tw:w-10" />
            <span><span className="tw:block tw:text-lg tw:font-semibold">Chat on WhatsApp</span><span className="tw:text-sm tw:text-white/90">Fastest way to reach us</span></span>
          </a>
          {[[IcPhone, "Call", <a key="p" href={SITE.phoneHref} className="tw:font-semibold tw:hover:text-rust">{SITE.phone}</a>], [IcMapPin, "Visit", SITE.address], [IcClock, "Hours", SITE.hours]].map(([I, l, v]) => (
            <div key={l} data-reveal="left" className="lift tw:group tw:flex tw:gap-4 tw:rounded-3xl tw:bg-surface tw:p-5 tw:ring-1 tw:ring-ink/10">
              <span className="tw:flex tw:h-10 tw:w-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-sage-300"><I /></span>
              <span><span className="tw:block tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-ink/55">{l}</span>{v}</span>
            </div>
          ))}
          <iframe
            title="Map: Zambia stage, Ngong"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=15&output=embed`}
            loading="lazy"
            className="tw:h-64 tw:w-full tw:rounded-3xl tw:border-0 tw:ring-1 tw:ring-ink/10"
          />
        </div>
        <div data-reveal="right" className="tw:h-fit tw:rounded-3xl tw:bg-surface tw:p-6 tw:shadow-xl tw:shadow-sage-500/10 tw:ring-1 tw:ring-ink/10 tw:sm:p-10">
          <h2 className="tw:mb-6 tw:text-2xl tw:font-semibold">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}

export function NotFound() {
  return (
    <Container className="tw:flex tw:flex-col tw:items-center tw:py-24 tw:text-center">
      <img src="/images/eagle.png" alt="" width="600" height="390" className="tw:w-56 tw:opacity-80" />
      <h1 className="tw:mt-6 tw:text-4xl tw:font-semibold">This page flew away</h1>
      <p className="tw:mt-3 tw:max-w-md tw:text-ink/70">We couldn't find that page. It may have moved, or the link may be wrong.</p>
      <div className="tw:mt-8 tw:flex tw:gap-3"><ButtonLink to="/">Back home</ButtonLink><ButtonLink to="/programs" variant="outline">Browse programs</ButtonLink></div>
    </Container>
  );
}
