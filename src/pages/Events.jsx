import { useState } from "react";
import { Container, ErrorState, Loading, SectionTitle, cx } from "../components/ui";
import { EventCard } from "../components/cards";
import { useResource } from "../lib/api";
import { EVENT_TYPES, todayISO } from "../lib/site";

export default function Events() {
  const events = useResource("/events?_sort=date&_order=asc");
  const [type, setType] = useState("all");
  const today = todayISO();
  const all = (events.data ?? []).filter((e) => type === "all" || e.type === type);
  const upcoming = all.filter((e) => e.date >= today);
  const past = all.filter((e) => e.date < today).reverse();
  const flyers = (events.data ?? []).filter((e) => e.image);

  return (
    <Container className="tw:py-14">
      <SectionTitle eyebrow="What's on" title="Events & intakes" subtitle="Hikes, photo walks, workshops and holiday tuition intakes. Reserve a spot and we'll confirm by phone or WhatsApp." />
      <div role="tablist" aria-label="Event type" className="tw:mb-8 tw:flex tw:flex-wrap tw:gap-2">
        {[["all", "All"], ...Object.entries(EVENT_TYPES)].map(([k, l]) => (
          <button key={k} role="tab" type="button" aria-selected={type === k} onClick={() => setType(k)}
            className={cx("tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition", type === k ? "tw:bg-ink tw:text-cream" : "tw:bg-surface tw:text-ink/75 tw:ring-1 tw:ring-ink/10 tw:hover:ring-rust")}>{l}</button>
        ))}
      </div>

      {events.loading ? <Loading /> : events.error ? <ErrorState onRetry={events.reload} /> : (
        <div className="tw:grid tw:gap-12 tw:lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="tw:mb-4 tw:text-2xl tw:font-semibold">Upcoming</h2>
            <div className="tw:space-y-4">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
              {!upcoming.length && <p className="tw:rounded-3xl tw:border tw:border-dashed tw:border-ink/20 tw:p-8 tw:text-center tw:text-ink/60">No upcoming {type === "all" ? "events" : EVENT_TYPES[type].toLowerCase() + "s"} yet — check back soon.</p>}
            </div>
            {past.length > 0 && (
              <>
                <h2 className="tw:mb-4 tw:mt-12 tw:text-2xl tw:font-semibold">Past events</h2>
                <div className="tw:space-y-4">{past.map((e) => <EventCard key={e.id} event={e} past />)}</div>
              </>
            )}
          </div>
          {flyers.length > 0 && (
            <aside className="tw:space-y-4">
              <h2 className="tw:text-lg tw:font-semibold">Event flyers</h2>
              {flyers.map((e) => (
                <a key={e.id} href={e.image} target="_blank" rel="noreferrer" data-reveal="right" className="zoom lift tw:block tw:overflow-hidden tw:rounded-2xl tw:ring-1 tw:ring-ink/10 tw:transition tw:hover:shadow-lg">
                  <img src={e.image} alt={`Flyer: ${e.title}`} loading="lazy" width="900" height="1273" className="tw:w-full" />
                </a>
              ))}
            </aside>
          )}
        </div>
      )}
    </Container>
  );
}
