import { Link } from "react-router-dom";
import { IcClock, IcHeart, IcHandshake, IcLightbulb, IcMapPin, IcPhone, IcSprout } from "../components/icons";
import { IcWhatsapp } from "../components/icons";
import { ButtonLink, Container, Eyebrow, SectionTitle, cx } from "../components/ui";
import { PendingBadge, Photo, canShow } from "../components/media";
import { KEEP_WATERMARK } from "../lib/media";
import { ContactForm } from "../components/forms";
import { CATEGORIES, SITE, whatsappLink } from "../lib/site";

/* "A global community" mosaic: 3 columns on desktop, 2 on tablet, 1 on mobile. Tiles are 3:2
   like the photos, so nothing is cropped; the larger tile spans two rows (and two columns). */
const MOSAIC = [
  { name: "intl-02-director-with-partner-laughing", big: true, position: "50% 80%" },
  { name: "intl-01-volunteer-visit-national-museum" },
  { name: "intl-03-learners-helping-each-other" },
  { name: "intl-04-mixed-class-group-work" },
  { name: "intl-05-academic-procession-scholars" },
  { name: "partners-02-director-with-partner-italy", portrait: true },
].filter((t) => canShow(t.name));

function GlobalCommunity() {
  return (
    <section id="community" className="tw:scroll-mt-28 tw:bg-sage-50 tw:py-16">
      <Container>
        <SectionTitle eyebrow="A global community" title="Partners and friends from around the world" subtitle="Learners, volunteers, scholars and partners from many places are part of the AHC community." />
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {MOSAIC.map((t) => (
            <figure key={t.name} data-reveal="zoom" className={cx("tw:relative tw:overflow-hidden tw:rounded-2xl tw:bg-sage-200", t.big && "tw:sm:col-span-2 tw:sm:row-span-2", t.portrait && "tw:sm:row-span-2")}>
              <PendingBadge name={t.name} />
              <Photo name={t.name} position={t.position} className="tw:h-full" imgClassName={cx("tw:w-full tw:object-cover", t.portrait ? "tw:aspect-[3/4] tw:h-full" : t.big ? "tw:aspect-[3/2] tw:h-full" : "tw:aspect-[3/2]")} />
            </figure>
          ))}
          <div data-reveal="zoom" className="tw:flex tw:flex-col tw:justify-center tw:rounded-2xl tw:bg-night tw:p-7 tw:text-paper">
            <h3 className="tw:text-2xl tw:font-semibold tw:leading-snug">Want to visit, volunteer or partner with us?</h3>
            <p className="tw:mt-2 tw:text-sm tw:text-paper/75">We'd love to hear from you.</p>
            <ButtonLink to="/contact" variant="sage" className="tw:mt-5 tw:self-start">Get in touch</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function About() {
  return (
    <>
      <section className="tw:bg-sage-300 tw:py-16">
        <Container className="tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[1.3fr_1fr]">
          <div className="enter-left">
            <Eyebrow className="tw:text-rust-dark">About AHC</Eyebrow>
            <h1 className="tw:mt-3 tw:text-4xl tw:font-semibold tw:leading-tight tw:sm:text-5xl">A community education home in Ngong</h1>
            <p className="tw:mt-5 tw:text-lg tw:leading-relaxed tw:text-ink/80">
              Afro Heritage Consultancies is a Kenyan community education organization serving learners and families in Ngong and Marsabit. We combine quality tuition, practical digital skills training and community-building programs to help people learn, earn and connect.
            </p>
          </div>
          {/* Meet the Director: bio card. TODO(client): replace "the Director" with the Director's name. */}
          <a href="#director" className="enter-right lift tw:mx-auto tw:flex tw:w-full tw:max-w-sm tw:flex-col tw:items-center tw:rounded-3xl tw:bg-cream/85 tw:p-7 tw:text-center tw:shadow-sm">
            <Photo name="director-01-official-headshot" priority position="center 25%" imgClassName="tw:h-60 tw:w-60 tw:rounded-full tw:object-cover tw:ring-4 tw:ring-surface tw:sm:h-72 tw:sm:w-72" />
            <p className="tw:mt-5 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-rust">Meet the Director</p>
            <p className="tw:mt-1 tw:font-display tw:text-2xl tw:font-semibold">Director, Afro Heritage Consultancies</p>
          </a>
        </Container>
      </section>

      {/* Director story */}
      <section id="director" className="tw:scroll-mt-28 tw:py-16">
        <Container className="tw:grid tw:items-center tw:gap-10 tw:md:grid-cols-[2fr_3fr] tw:lg:gap-16">
          <div data-reveal="left"><Photo name="director-02-smiling-suit-walking" imgClassName="tw:h-auto tw:w-full tw:rounded-2xl tw:shadow-xl" /></div>
          <div data-reveal="right">
            <Eyebrow>Our Director</Eyebrow>
            <h2 className="tw:mt-3 tw:text-3xl tw:font-semibold tw:leading-tight tw:sm:text-4xl">Touching minds, educating hearts</h2>
            {/* TODO(client): the Director's name and biography go here. */}
            <p className="tw:mt-5 tw:text-lg tw:leading-relaxed tw:text-ink/80">
              The Director leads Afro Heritage Consultancies' tuition, digital skills and community programmes in Ngong and Marsabit, working alongside learners, families, volunteers and partners from Kenya and abroad.
            </p>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
              <ButtonLink to="/programs">Explore our programs</ButtonLink>
              <ButtonLink to="/contact" variant="outline">Get in touch</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="tw:pb-16">
        <SectionTitle eyebrow="Our work" title="Three ways we serve the community" />
        <figure data-reveal className="tw:mb-8 tw:overflow-hidden tw:rounded-3xl tw:bg-surface tw:ring-1 tw:ring-ink/10">
          <Photo name="director-action-01-mental-growth-talk" position={KEEP_WATERMARK.wider} imgClassName="tw:aspect-[16/9] tw:w-full tw:object-cover" />
          <figcaption className="tw:px-6 tw:py-4 tw:text-sm tw:font-semibold">Mentorship & mental growth sessions</figcaption>
        </figure>
        <div className="tw:grid tw:gap-5 tw:md:grid-cols-3">
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <Link key={k} data-reveal to={`/programs?category=${k}`} className="lift tw:rounded-3xl tw:bg-surface tw:p-7 tw:ring-1 tw:ring-ink/10 tw:hover:ring-rust/40">
              <h3 className="tw:text-xl tw:font-semibold">{c.label}</h3>
              <p className="tw:mt-2 tw:text-sm tw:leading-relaxed tw:text-ink/70">{c.blurb}</p>
            </Link>
          ))}
        </div>

      </Container>

      <GlobalCommunity />

      <Container className="tw:py-16">
        <SectionTitle eyebrow="Our team" title="The people behind AHC" />
        <div className="tw:mb-16 tw:grid tw:gap-5 tw:md:grid-cols-2">
          <Photo name="community-02-team-laughing" imgClassName="tw:h-auto tw:w-full tw:rounded-3xl" />
          <Photo name="director-03-arms-crossed-portrait" imgClassName="tw:h-auto tw:w-full tw:rounded-3xl" />
        </div>
        {canShow("milestone-01-graduation-tangaza") && (
          <>
            {/* Milestones. TODO(client): confirm who the graduate is and the caption, then remove from UNCONFIRMED in lib/media.js. */}
            <SectionTitle eyebrow="Milestones" title="Moments we're proud of" />
            <figure className="tw:relative tw:mb-16 tw:overflow-hidden tw:rounded-3xl tw:md:w-2/3">
              <PendingBadge name="milestone-01-graduation-tangaza" />
              <Photo name="milestone-01-graduation-tangaza" imgClassName="tw:h-auto tw:w-full" />
            </figure>
          </>
        )}

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
