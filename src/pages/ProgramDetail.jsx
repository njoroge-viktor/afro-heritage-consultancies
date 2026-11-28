import { Link, useParams } from "react-router-dom";
import { IcArrowLeft, IcCalendarDays, IcCheck, IcClock, IcMapPin, IcUsers, IcWallet, IcGraduationCap } from "../components/icons";
import { IcWhatsapp } from "../components/icons";
import { Badge, ButtonLink, Container, ErrorState, Loading, cx } from "../components/ui";
import { EventCard, SeatsBadge, categoryIcon } from "../components/cards";
import { EnrollmentForm } from "../components/forms";
import { seatsLeft, useResource } from "../lib/api";
import { CATEGORIES, formatFee, todayISO, whatsappLink } from "../lib/site";
import NotFound from "./NotFound";
import { Photo, TestimonialVideo } from "../components/media";
import { PROGRAM_PHOTOS, TESTIMONIAL_PROGRAMS } from "../lib/media";

export default function ProgramDetail() {
  const { slug } = useParams();
  const programs = useResource("/programs");
  const events = useResource("/events?_sort=date&_order=asc");
  const enrollments = useResource("/enrollments?status=enrolled");

  if (programs.loading) return <Loading />;
  if (programs.error) return <Container className="tw:py-14"><ErrorState onRetry={programs.reload} /></Container>;
  const p = programs.data.find((x) => x.slug === slug && x.active);
  if (!p) return <NotFound />;

  const cat = CATEGORIES[p.category];
  const Icon = categoryIcon[p.category];
  const photo = PROGRAM_PHOTOS[p.slug];
  const seats = seatsLeft(p, enrollments.data ?? []);
  const related = (events.data ?? []).filter((e) => e.programId === p.id && e.date >= todayISO());
  const facts = [
    [IcUsers, "Who it's for", p.audience],
    [IcClock, "Schedule", p.schedule],
    [IcCalendarDays, "Duration", p.duration],
    [IcWallet, "Fee", formatFee(p.fee, p.feeUnit)],
    [IcGraduationCap, "Seats left", seats === null ? "—" : seats === 0 ? "Full — join the waitlist" : `${seats} of ${p.capacity}`],
    [IcMapPin, "Where", p.location],
  ];

  return (
    <>
      <section className={cx("tw:py-12 tw:sm:py-16", p.category === "education" ? "tw:bg-sage-300" : p.category === "digital" ? "tw:bg-rust tw:text-white" : "tw:bg-night tw:text-paper")}>
        <Container className={cx(photo && "tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[1.2fr_1fr]")}>
          <div>
          <Link to={`/programs?category=${p.category}`} className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:opacity-80 tw:hover:opacity-100"><IcArrowLeft /> {cat.label} programs</Link>
          <div className="tw:mt-6 tw:flex tw:items-start tw:gap-5">
            <span className="tw:hidden tw:h-16 tw:w-16 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-surface/20 tw:text-3xl tw:sm:flex"><Icon /></span>
            <div>
              <h1 className="tw:text-4xl tw:font-semibold tw:leading-tight tw:sm:text-5xl">{p.title}</h1>
              <p className="tw:mt-3 tw:max-w-2xl tw:text-lg tw:opacity-85">{p.summary}</p>
              <div className="tw:mt-5 tw:flex tw:flex-wrap tw:gap-2">
                <Badge className="tw:bg-surface/90 tw:text-ink">{formatFee(p.fee, p.feeUnit)}</Badge>
                <SeatsBadge seats={seats} capacity={p.capacity} />
              </div>
            </div>
          </div>
          </div>
          {photo && <Photo name={photo} priority className="enter-right" imgClassName="tw:h-auto tw:w-full tw:rounded-2xl tw:shadow-xl" />}
        </Container>
      </section>

      <Container className="tw:grid tw:gap-10 tw:py-14 tw:lg:grid-cols-[1.2fr_1fr]">
        <div>
          <dl className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
            {facts.map(([I, l, v]) => (
              <div key={l} data-reveal className="lift tw:rounded-2xl tw:bg-surface tw:p-5 tw:ring-1 tw:ring-ink/10">
                <dt className="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-ink/55"><I className="tw:h-4 tw:w-4 tw:text-rust" />{l}</dt>
                <dd className="tw:mt-2 tw:font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <h2 className="tw:mt-10 tw:text-2xl tw:font-semibold">About this program</h2>
          <p className="tw:mt-3 tw:leading-relaxed tw:text-ink/80">{p.description}</p>
          {p.highlights?.length > 0 && (
            <ul className="tw:mt-6 tw:space-y-3">
              {p.highlights.map((h) => <li key={h} className="tw:flex tw:gap-3"><span className="tw:mt-0.5 tw:flex tw:h-6 tw:w-6 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-sage-300"><IcCheck className="tw:h-4 tw:w-4" /></span>{h}</li>)}
            </ul>
          )}
          {p.levels?.length > 0 && (
            <>
              <h2 className="tw:mt-10 tw:text-2xl tw:font-semibold">Levels</h2>
              <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">{p.levels.map((l) => <Badge key={l} className="tw:bg-sage-100 tw:px-3 tw:py-1 tw:text-sm tw:text-ink tw:ring-1 tw:ring-sage-300">{l}</Badge>)}</div>
            </>
          )}
          {TESTIMONIAL_PROGRAMS.has(p.slug) && (
            <div className="tw:mt-12 tw:grid tw:items-center tw:gap-8 tw:rounded-3xl tw:bg-sage-100 tw:p-6 tw:sm:grid-cols-[minmax(0,260px)_1fr] tw:sm:p-8">
              <TestimonialVideo />
              <div>
                <h2 className="tw:text-2xl tw:font-semibold">Hear from a learner</h2>
                <p className="tw:mt-3 tw:text-ink/75">Grace, a Form 3 student, talks about how tuition at Afro Heritage Consultancies helped her.</p>
              </div>
            </div>
          )}
          {related.length > 0 && (
            <>
              <h2 className="tw:mt-10 tw:text-2xl tw:font-semibold">Upcoming dates</h2>
              <div className="tw:mt-4 tw:space-y-4">{related.map((e) => <EventCard key={e.id} event={e} />)}</div>
            </>
          )}
        </div>

        <aside id="enrol" data-reveal="right" className="tw:h-fit tw:rounded-3xl tw:bg-surface tw:p-6 tw:shadow-xl tw:shadow-sage-500/10 tw:ring-1 tw:ring-ink/10 tw:sm:p-8 tw:lg:sticky tw:lg:top-28">
          <h2 className="tw:text-2xl tw:font-semibold">{seats === 0 ? "Join the waitlist" : "Request a place"}</h2>
          <p className="tw:mb-6 tw:mt-1 tw:text-sm tw:text-ink/65">Takes under two minutes. We'll confirm within 24 hours.</p>
          <EnrollmentForm compact programs={programs.data} events={events.data ?? []} initial={`p:${p.id}`} />
          <div className="tw:mt-6 tw:border-t tw:border-ink/10 tw:pt-5">
            <ButtonLink to={whatsappLink(`Hello AHC, I have a question about ${p.title}.`)} variant="whatsapp" className="tw:w-full"><IcWhatsapp /> Ask on WhatsApp</ButtonLink>
          </div>
        </aside>
      </Container>
    </>
  );
}
