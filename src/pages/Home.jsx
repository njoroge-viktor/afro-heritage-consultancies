import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import {
  IcArrowRight, IcBookOpen, IcCalendarDays, IcClock, IcCoffee, IcListChecks, IcMountain, IcPhoneCall, IcSend,
  IcUsers, IcVideo, IcWhatsapp, IcWifi,
} from "../components/icons";
import { ButtonLink, Container, Eyebrow, SectionTitle, cx } from "../components/ui";
import { EventCard, ProgramCard } from "../components/cards";
import { seatsLeft, useResource } from "../lib/api";
import { CATEGORIES, SITE, todayISO, whatsappLink } from "../lib/site";

const pillarIcons = { education: IcBookOpen, digital: IcVideo, community: IcMountain };

const ticker = [
  [IcBookOpen, "CBE tuition"], [IcBookOpen, "8-4-4 tuition"], [IcUsers, "Spoken English"], [IcSend, "Digital marketing"],
  [IcVideo, "Photography"], [IcVideo, "Video editing"], [IcMountain, "Ngong Hills hikes"], [IcUsers, "Photo walks"], [IcWifi, "Coworking space"],
];

const faqs = [
  ["How do I enrol?", "Pick a program or event and send the short enrollment form. It takes under two minutes. Our team then calls or WhatsApps you within 24 hours to confirm the details."],
  ["Do I pay when I send a request?", "No. Sending a request is free. We confirm the schedule and fees with you first, before anything is paid."],
  ["Where are you located?", `We're at ${SITE.address}. The office is open ${SITE.hours}.`],
  ["Do you offer online classes?", "Spoken English coaching is available online for international learners, and some workshops — like Raise Smart, Raise Safe — are delivered online."],
  ["Can adults join, or is it only for school learners?", "Adults are very welcome: spoken English coaching, digital skills courses, hikes, photo walks and the coworking space are all open to adults."],
];

/* Bootstrap carousel: "Life at AHC" */
function Highlights() {
  const ref = useRef(null);
  useEffect(() => {
    const c = new Carousel(ref.current, { interval: 5500, ride: "carousel", pause: "hover", touch: true });
    return () => c.dispose();
  }, []);
  const slides = [
    { img: "/images/flyer-coworking.jpg", alt: "Coworking Office Workspace flyer", tag: "Coworking", title: "A calm workspace in Ngong", text: "Reading space, meeting space, 24 hr Wi-Fi, and teas & coffees — open 7:30 a.m. to 6:30 p.m.", to: "/programs/coworking-space", cta: "Book a space", tone: "tw:bg-night tw:text-paper" },
    { img: "/images/flyer-raise-smart.jpg", alt: "Raise Smart, Raise Safe parenting workshop flyer", tag: "Workshops", title: "Raise Smart, Raise Safe", text: "Our free online workshop on parenting in the digital age, with Dr. John Bosco Kiingati, PhD. Ask us about the next session.", to: "/events", cta: "See events", tone: "tw:bg-rust tw:text-white" },
    { icon: IcVideo, tag: "Digital skills", title: "Skills you can earn with", text: "Digital marketing, photography, video and editing for young people and small businesses.", to: "/programs?category=digital", cta: "Explore courses", tone: "tw:bg-gradient-to-br tw:from-rust tw:to-night tw:text-white" },
    { icon: IcMountain, tag: "Community", title: "Hikes, walks and stories", text: "Monthly Ngong Hills hikes and photo walks that bring neighbours together.", to: "/programs?category=community", cta: "Join a group", tone: "tw:bg-gradient-to-br tw:from-sage-600 tw:to-night tw:text-white" },
  ];
  return (
    <div ref={ref} id="ahc-highlights" className="carousel slide tw:overflow-hidden tw:rounded-[2rem] tw:shadow-2xl" aria-roledescription="carousel" aria-label="Life at AHC">
      <div className="carousel-indicators tw:mb-5">
        {slides.map((s, i) => (
          <button key={s.title} type="button" data-bs-target="#ahc-highlights" data-bs-slide-to={i} className={i === 0 ? "active" : ""} aria-current={i === 0 ? "true" : undefined} aria-label={`Slide ${i + 1}: ${s.title}`} />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((s, i) => (
          <div key={s.title} className={cx("carousel-item", i === 0 && "active")}>
            <div className={cx("tw:grid tw:min-h-[420px] tw:items-center tw:gap-8 tw:px-8 tw:pb-16 tw:pt-10 tw:sm:px-16 tw:md:grid-cols-[1.2fr_1fr]", s.tone)}>
              <div>
                <span className="tw:inline-block tw:rounded-full tw:bg-white/15 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider">{s.tag}</span>
                <h3 className="tw:mt-4 tw:text-3xl tw:font-semibold tw:leading-tight tw:sm:text-4xl">{s.title}</h3>
                <p className="tw:mt-3 tw:max-w-md tw:opacity-85">{s.text}</p>
                <Link to={s.to} className="tw:mt-6 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-night tw:transition tw:hover:bg-leaf">{s.cta} <IcArrowRight className="nudge" /></Link>
              </div>
              {s.img ? (
                <div className="zoom tw:mx-auto tw:hidden tw:w-56 tw:rotate-3 tw:rounded-2xl tw:shadow-2xl tw:md:block">
                  <img src={s.img} alt={s.alt} width="900" height="1273" loading="lazy" className="tw:w-full" />
                </div>
              ) : (
                <s.icon className="tw:mx-auto tw:hidden tw:text-[9rem] tw:opacity-25 tw:md:block" />
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev tw:w-14" type="button" data-bs-target="#ahc-highlights" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next tw:w-14" type="button" data-bs-target="#ahc-highlights" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default function Home() {
  const programs = useResource("/programs?active=true");
  const events = useResource(`/events?date_gte=${todayISO()}&_sort=date&_order=asc&_limit=3`);
  const enrollments = useResource("/enrollments?status=enrolled");
  const featured = (programs.data ?? []).filter((p) => ["english-tuition", "digital-marketing", "hiking-club"].includes(p.slug));

  return (
    <>
      {/* Hero */}
      <section className="tw:relative tw:overflow-hidden tw:bg-sage-300 tw:transition-colors tw:duration-500">
        <div className="dots tw:pointer-events-none tw:absolute tw:-right-10 tw:top-10 tw:h-48 tw:w-72 tw:opacity-60" aria-hidden />
        <div className="tw:pointer-events-none tw:absolute tw:-bottom-32 tw:-left-24 tw:h-80 tw:w-80 tw:rounded-full tw:bg-rust/90" aria-hidden />
        <Container className="tw:relative tw:grid tw:items-center tw:gap-10 tw:py-16 tw:sm:py-20 tw:lg:grid-cols-[1.15fr_1fr] tw:lg:py-24">
          <div className="enter-left">
            <Eyebrow className="tw:text-rust-dark">Ngong, Kenya · Community education</Eyebrow>
            <h1 className="tw:mt-4 tw:text-5xl tw:font-semibold tw:leading-[1.02] tw:sm:text-6xl tw:lg:text-7xl">
              Touching Minds,<br /><span className="tw:italic tw:text-rust">Educating Hearts</span>
            </h1>
            <p className="tw:mt-6 tw:max-w-xl tw:text-lg tw:leading-relaxed tw:text-ink/80">
              Quality tuition, practical digital skills and community programs that help learners and families across Ngong <b>learn, earn and connect</b>.
            </p>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
              <ButtonLink to="/programs" size="lg" variant="dark">Browse programs <IcArrowRight className="nudge" /></ButtonLink>
              <ButtonLink to="/enroll" size="lg">Enrol in 2 minutes</ButtonLink>
            </div>
            <p className="tw:mt-6 tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-ink/70">
              <IcWhatsapp className="tw:text-lg tw:text-green-700 tw:dark:text-whatsapp" /> Questions? <a href={whatsappLink()} target="_blank" rel="noreferrer" className="link-slide tw:font-semibold">WhatsApp {SITE.phone}</a>
            </p>
          </div>
          <div className="enter-right tw:relative tw:mx-auto tw:w-full tw:max-w-md tw:lg:max-w-none">
            <div className="tw:absolute tw:inset-4 tw:rounded-full tw:bg-cream/80 tw:blur-2xl" aria-hidden />
            <img src="/images/eagle.png" alt="" width="600" height="395" className="tw:relative tw:w-full tw:animate-float tw:drop-shadow-xl" />
            <div className="tw:relative tw:mt-6 tw:grid tw:grid-cols-3 tw:gap-3">
              {[["3", "program areas"], [String(programs.data?.length ?? "—"), "programs"], ["24 h", "reply time"]].map(([v, l]) => (
                <div key={l} className="tw:rounded-2xl tw:bg-cream/80 tw:p-3 tw:text-center tw:shadow-sm tw:backdrop-blur tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-md">
                  <p className="tw:font-display tw:text-2xl tw:font-semibold">{v}</p>
                  <p className="tw:text-xs tw:text-ink/70">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Sliding program ticker */}
      <div className="marquee-pause tw:overflow-hidden tw:bg-night tw:py-4 tw:text-paper" aria-label="Programs we offer">
        <div className="tw:flex tw:w-max tw:animate-marquee tw:gap-10">
          {[...ticker, ...ticker].map(([I, t], i) => (
            <span key={i} className="tw:flex tw:shrink-0 tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wider" aria-hidden={i >= ticker.length}>
              <I className="tw:text-leaf" /> {t} <span className="tw:ml-8 tw:text-leaf/60">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <section className="tw:py-20">
        <Container>
          <SectionTitle center eyebrow="What we do" title="Learn, earn and connect" subtitle="Three program areas, one welcoming community in Ngong." />
          <div className="tw:grid tw:gap-5 tw:md:grid-cols-3">
            {Object.entries(CATEGORIES).map(([key, c]) => {
              const I = pillarIcons[key];
              return (
                <Link key={key} data-reveal to={`/programs?category=${key}`} className="lift tw:group tw:rounded-3xl tw:border tw:border-ink/10 tw:bg-surface tw:p-7 tw:hover:border-rust/40">
                  <span className={cx("icon-pop tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-2xl tw:text-2xl", c.color)}><I /></span>
                  <h3 className="tw:mt-5 tw:text-2xl tw:font-semibold tw:transition tw:group-hover:text-rust">{c.label}</h3>
                  <p className="tw:mt-2 tw:text-sm tw:leading-relaxed tw:text-ink/70">{c.blurb}</p>
                  <p className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-rust">See {c.label.toLowerCase()} programs <IcArrowRight className="nudge" /></p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured programs */}
      <section className="tw:bg-sage-100 tw:py-20 tw:transition-colors tw:duration-500">
        <Container>
          <div className="tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4">
            <SectionTitle eyebrow="Popular right now" title="Featured programs" />
            <ButtonLink to="/programs" variant="outline" className="tw:mb-10">All programs <IcArrowRight className="nudge" /></ButtonLink>
          </div>
          <div className="tw:grid tw:gap-6 tw:md:grid-cols-3">
            {featured.map((p) => <ProgramCard key={p.id} program={p} seats={seatsLeft(p, enrollments.data ?? [])} />)}
          </div>
        </Container>
      </section>

      {/* Life at AHC — Bootstrap carousel */}
      <section className="tw:py-20">
        <Container>
          <SectionTitle eyebrow="Life at AHC" title="More than a classroom" subtitle="Swipe through what's happening around Kony House." />
          <div data-reveal="zoom"><Highlights /></div>
        </Container>
      </section>

      {/* How it works */}
      <section className="tw:bg-sage-50 tw:py-20">
        <Container>
          <SectionTitle center eyebrow="Joining is simple" title="From question to class in three steps" />
          <ol className="tw:grid tw:gap-5 tw:md:grid-cols-3">
            {[
              [IcListChecks, "Pick a program", "Browse schedules, fees and seats left — no need to call first."],
              [IcSend, "Send a request", "Fill a short form with your name, phone and the learner's level."],
              [IcPhoneCall, "We confirm in 24 hours", "Our team calls or WhatsApps you to confirm and welcome you in."],
            ].map(([I, t, d], i) => (
              <li key={t} data-reveal className="lift tw:group tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-surface tw:p-7 tw:ring-1 tw:ring-ink/10">
                <span className="tw:absolute tw:right-6 tw:top-5 tw:font-display tw:text-5xl tw:font-semibold tw:text-sage-300 tw:transition tw:duration-500 tw:group-hover:scale-125 tw:group-hover:text-rust/40">{i + 1}</span>
                <I className="icon-pop tw:h-8 tw:w-8 tw:text-rust" />
                <h3 className="tw:mt-4 tw:text-xl tw:font-semibold">{t}</h3>
                <p className="tw:mt-2 tw:text-sm tw:text-ink/70">{d}</p>
                <span className="tw:absolute tw:bottom-0 tw:left-0 tw:h-1 tw:w-0 tw:bg-rust tw:transition-all tw:duration-500 tw:group-hover:w-full" aria-hidden />
              </li>
            ))}
          </ol>
          <div data-reveal className="tw:mt-10 tw:text-center"><ButtonLink to="/enroll" size="lg">Start your enrollment request <IcArrowRight className="nudge" /></ButtonLink></div>
        </Container>
      </section>

      {/* Events */}
      <section className="tw:py-20">
        <Container>
          <div className="tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4">
            <SectionTitle eyebrow="What's on" title="Upcoming events" subtitle="Hikes, photo walks, workshops and tuition intakes." />
            <ButtonLink to="/events" variant="outline" className="tw:mb-10"><IcCalendarDays /> All events</ButtonLink>
          </div>
          <div className="tw:grid tw:gap-5">
            {(events.data ?? []).map((e) => <EventCard key={e.id} event={e} />)}
            {events.data?.length === 0 && <p className="tw:text-ink/60">New events are coming soon — follow us on WhatsApp for updates.</p>}
          </div>
        </Container>
      </section>

      {/* Coworking */}
      <section className="tw:py-20">
        <Container className="tw:grid tw:items-center tw:gap-10 tw:overflow-hidden tw:rounded-[2rem] tw:bg-night tw:p-6 tw:text-paper tw:sm:p-10 tw:lg:grid-cols-[1.1fr_1fr] tw:lg:p-14">
          <div data-reveal="left">
            <Eyebrow className="tw:text-leaf">Kony House RM: B01</Eyebrow>
            <h2 className="tw:mt-3 tw:text-4xl tw:font-semibold tw:leading-tight">Coworking Office Workspace</h2>
            <p className="tw:mt-4 tw:text-paper/75">A calm, connected place to work, study or meet clients in Ngong.</p>
            <ul className="tw:mt-6 tw:grid tw:gap-3 tw:sm:grid-cols-2">
              {[[IcBookOpen, "Reading space"], [IcWifi, "24 hr Wi-Fi access"], [IcUsers, "Meeting space"], [IcCoffee, "Teas & coffees offered"], [IcClock, "7:30 a.m. – 6:30 p.m."]].map(([I, t]) => (
                <li key={t} className="tw:group tw:flex tw:items-center tw:gap-3"><span className="tw:flex tw:h-9 tw:w-9 tw:items-center tw:justify-center tw:rounded-xl tw:bg-leaf tw:text-night tw:transition tw:duration-300 tw:group-hover:rotate-12 tw:group-hover:scale-110"><I /></span>{t}</li>
              ))}
            </ul>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
              <ButtonLink to="/programs/coworking-space" variant="sage">Book a space <IcArrowRight className="nudge" /></ButtonLink>
              <ButtonLink to={SITE.phoneHref} variant="outline" className="tw:border-paper/25 tw:text-paper tw:hover:border-leaf tw:hover:text-leaf">Call {SITE.phone}</ButtonLink>
            </div>
          </div>
          <div data-reveal="right" className="zoom tw:mx-auto tw:w-full tw:max-w-sm tw:rounded-2xl tw:shadow-2xl tw:transition tw:duration-500 tw:hover:rotate-0 tw:lg:rotate-2">
            <img src="/images/flyer-coworking.jpg" alt="Coworking Office Workspace flyer: reading space, 24 hr Wi-Fi, meeting space, open 7.30 a.m. to 6.30 p.m. at Kony House, Ngong" width="900" height="1273" loading="lazy" className="tw:w-full" />
          </div>
        </Container>
      </section>

      {/* FAQ — Bootstrap accordion */}
      <section className="tw:py-16">
        <Container className="tw:grid tw:gap-10 tw:lg:grid-cols-[1fr_1.4fr]">
          <div data-reveal="left">
            <Eyebrow>Good to know</Eyebrow>
            <h2 className="tw:mt-3 tw:text-3xl tw:font-semibold tw:sm:text-4xl">Questions parents and learners ask</h2>
            <p className="tw:mt-3 tw:text-ink/70">Can't find your answer? We reply fast on WhatsApp.</p>
            <ButtonLink to={whatsappLink()} variant="whatsapp" className="tw:mt-6"><IcWhatsapp /> Ask on WhatsApp</ButtonLink>
          </div>
          <div data-reveal="right" className="accordion" id="home-faq">
            {faqs.map(([q, a], i) => (
              <div key={q} className="accordion-item">
                <h3 className="accordion-header tw:font-sans">
                  <button className={cx("accordion-button", i !== 0 && "collapsed")} type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${i}`} aria-expanded={i === 0} aria-controls={`faq-${i}`}>
                    {q}
                  </button>
                </h3>
                <div id={`faq-${i}`} className={cx("accordion-collapse collapse", i === 0 && "show")} data-bs-parent="#home-faq">
                  <div className="accordion-body tw:text-ink/75">{a}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="tw:pb-4">
        <Container>
          <div data-reveal="zoom" className="tw:group tw:relative tw:overflow-hidden tw:rounded-[2rem] tw:bg-rust tw:px-6 tw:py-14 tw:text-center tw:text-white tw:sm:px-12">
            <div className="dots tw:pointer-events-none tw:absolute tw:inset-0 tw:opacity-30 tw:transition tw:duration-[2000ms] tw:group-hover:scale-110" aria-hidden />
            <h2 className="tw:relative tw:text-3xl tw:font-semibold tw:sm:text-4xl">Ready to start learning with AHC?</h2>
            <p className="tw:relative tw:mx-auto tw:mt-3 tw:max-w-xl tw:text-white/85">Send a request today and we'll get back to you within 24 hours.</p>
            <div className="tw:relative tw:mt-8 tw:flex tw:flex-wrap tw:justify-center tw:gap-3">
              <ButtonLink to="/enroll" variant="sage" size="lg">Enrol now <IcArrowRight className="nudge" /></ButtonLink>
              <ButtonLink to={whatsappLink()} variant="whatsapp" size="lg"><IcWhatsapp /> WhatsApp us</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
