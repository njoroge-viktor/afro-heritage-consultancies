import { useSearchParams } from "react-router-dom";
import { IcClock, IcPhoneCall, IcShieldCheck } from "../components/icons";
import { IcWhatsapp } from "../components/icons";
import { ButtonLink, Container, ErrorState, Loading, SectionTitle } from "../components/ui";
import { EnrollmentForm } from "../components/forms";
import { useResource } from "../lib/api";
import { SITE, whatsappLink } from "../lib/site";

export default function Enroll() {
  const [params] = useSearchParams();
  const programs = useResource("/programs");
  const events = useResource("/events");

  const slug = params.get("program");
  const eventId = params.get("event");
  const fromSlug = programs.data?.find((p) => p.slug === slug);
  const initial = eventId ? `e:${eventId}` : fromSlug ? `p:${fromSlug.id}` : "";

  return (
    <Container className="tw:grid tw:gap-10 tw:py-14 tw:lg:grid-cols-[1fr_1.4fr]">
      <div>
        <SectionTitle eyebrow="Enrollment request" title="Join a program or event" subtitle="Tell us who's joining and what interests you. No payment now — we'll confirm the details with you first." />
        <ul className="tw:space-y-4">
          {[[IcClock, "Takes under 2 minutes", "Just your name, phone and a few choices."], [IcPhoneCall, "Reply within 24 hours", "We call or WhatsApp you to confirm schedule and fees."], [IcShieldCheck, "Your details stay private", "Used only to contact you about this request."]].map(([I, t, d]) => (
            <li key={t} data-reveal="left" className="lift tw:flex tw:gap-4 tw:rounded-2xl tw:bg-surface tw:p-4 tw:ring-1 tw:ring-ink/10">
              <span className="tw:flex tw:h-10 tw:w-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-sage-300"><I /></span>
              <span><span className="tw:block tw:font-semibold">{t}</span><span className="tw:text-sm tw:text-ink/65">{d}</span></span>
            </li>
          ))}
        </ul>
        <div className="tw:mt-6 tw:rounded-2xl tw:bg-sage-100 tw:p-5 tw:text-sm">
          Prefer to talk? Call <a href={SITE.phoneHref} className="tw:font-semibold tw:underline">{SITE.phone}</a> or
          <ButtonLink to={whatsappLink()} variant="whatsapp" size="sm" className="tw:ml-2 tw:mt-2 tw:sm:mt-0"><IcWhatsapp /> WhatsApp</ButtonLink>
        </div>
      </div>
      <div className="tw:rounded-3xl tw:bg-surface tw:p-6 tw:shadow-xl tw:shadow-sage-500/10 tw:ring-1 tw:ring-ink/10 tw:sm:p-10">
        {programs.loading || events.loading ? <Loading /> : programs.error ? <ErrorState onRetry={programs.reload} /> : (
          <EnrollmentForm key={initial} programs={programs.data} events={events.data ?? []} initial={initial} />
        )}
      </div>
    </Container>
  );
}
