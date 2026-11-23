import { Link } from "react-router-dom";
import { IcArrowRight, IcBookOpen, IcCalendarDays, IcClock, IcMapPin, IcMountain, IcUsers, IcVideo, IcWifi } from "./icons";
import { Badge, cx } from "./ui";
import { CATEGORIES, EVENT_TYPES, formatDate, formatFee, formatTime } from "../lib/site";

export const categoryIcon = { education: IcBookOpen, digital: IcVideo, community: IcMountain };

export function SeatsBadge({ seats, capacity }) {
  if (seats === null || seats === undefined) return null;
  if (seats === 0) return <Badge className="tw:bg-red-100 tw:text-red-700">Full — join waitlist</Badge>;
  const low = seats <= Math.max(3, Math.ceil(capacity * 0.2));
  return <Badge className={low ? "tw:bg-amber-100 tw:text-amber-800" : "tw:bg-sage-200 tw:text-sage-900"}><IcUsers className="tw:h-3 tw:w-3" />{seats} seat{seats === 1 ? "" : "s"} left</Badge>;
}

export function ProgramCard({ program, seats }) {
  const cat = CATEGORIES[program.category];
  const Icon = program.slug === "coworking-space" ? IcWifi : categoryIcon[program.category];
  return (
    <article data-reveal className="lift tw:group tw:relative tw:flex tw:h-full tw:flex-col tw:overflow-hidden tw:rounded-3xl tw:border tw:border-ink/10 tw:bg-surface tw:hover:border-rust/40">
      <div className={cx("tw:relative tw:flex tw:items-center tw:justify-between tw:overflow-hidden tw:px-6 tw:py-5", cat?.color)}>
        <span className="tw:absolute tw:inset-y-0 tw:-left-1/3 tw:w-1/3 tw:-skew-x-12 tw:bg-white/20 tw:transition-all tw:duration-700 tw:group-hover:left-[120%]" aria-hidden />
        <span className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider">{cat?.label}</span>
        <Icon className="icon-pop tw:h-6 tw:w-6" />
      </div>
      <div className="tw:flex tw:flex-1 tw:flex-col tw:p-6">
        <h3 className="tw:text-xl tw:font-semibold tw:leading-snug tw:transition tw:group-hover:text-rust">
          <Link to={`/programs/${program.slug}`} className="tw:after:absolute tw:after:inset-0 tw:after:rounded-3xl">{program.title}</Link>
        </h3>
        <p className="tw:mt-2 tw:text-sm tw:leading-relaxed tw:text-ink/70">{program.summary}</p>
        <dl className="tw:mt-5 tw:space-y-2 tw:text-sm">
          <div className="tw:flex tw:gap-2"><dt className="tw:sr-only">Schedule</dt><IcClock className="tw:mt-0.5 tw:shrink-0 tw:text-rust" /><dd>{program.schedule}</dd></div>
          <div className="tw:flex tw:gap-2"><dt className="tw:sr-only">Duration</dt><IcCalendarDays className="tw:mt-0.5 tw:shrink-0 tw:text-rust" /><dd>{program.duration}</dd></div>
        </dl>
        <div className="tw:mt-auto tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:pt-6">
          <p className="tw:font-semibold">{formatFee(program.fee, program.feeUnit)}</p>
          <SeatsBadge seats={seats} capacity={program.capacity} />
        </div>
        <Link to={`/programs/${program.slug}`} className="tw:relative tw:mt-5 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-rust">
          View details & enrol <IcArrowRight className="nudge" />
        </Link>
      </div>
    </article>
  );
}

export function EventCard({ event, past = false }) {
  const d = new Date(`${event.date}T00:00:00`);
  return (
    <article data-reveal="left" className={cx("tw:group tw:flex tw:gap-5 tw:rounded-3xl tw:border tw:border-ink/10 tw:bg-surface tw:p-5 tw:sm:p-6", past ? "tw:opacity-70" : "lift tw:hover:border-rust/40")}>
      <div className={cx("tw:flex tw:h-20 tw:w-20 tw:shrink-0 tw:flex-col tw:items-center tw:justify-center tw:rounded-2xl tw:text-center tw:transition tw:duration-500", past ? "tw:bg-ink/10" : "tw:bg-sage-300 tw:group-hover:-rotate-6 tw:group-hover:scale-105 tw:group-hover:bg-rust tw:group-hover:text-white")}>
        <span className="tw:text-xs tw:font-semibold tw:uppercase">{d.toLocaleDateString("en-KE", { month: "short" })}</span>
        <span className="tw:font-display tw:text-3xl tw:font-semibold tw:leading-none">{d.getDate()}</span>
        <span className="tw:text-[10px] tw:opacity-60">{d.getFullYear()}</span>
      </div>
      <div className="tw:min-w-0 tw:flex-1">
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
          <Badge className="tw:bg-rust/10 tw:text-rust">{EVENT_TYPES[event.type] ?? event.type}</Badge>
          {event.mode === "online" && <Badge className="tw:bg-sky-100 tw:text-sky-800">Online</Badge>}
          {Number(event.fee) === 0 && <Badge className="tw:bg-emerald-100 tw:text-emerald-800">Free</Badge>}
        </div>
        <h3 className="tw:mt-2 tw:text-lg tw:font-semibold tw:leading-snug">{event.title}</h3>
        <p className="tw:mt-1 tw:text-sm tw:text-ink/70">{event.description}</p>
        <p className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-1 tw:text-sm tw:text-ink/70">
          <span className="tw:flex tw:items-center tw:gap-1.5"><IcCalendarDays className="tw:text-rust" />{formatDate(event.date)}</span>
          <span className="tw:flex tw:items-center tw:gap-1.5"><IcClock className="tw:text-rust" />{formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
          <span className="tw:flex tw:items-center tw:gap-1.5"><IcMapPin className="tw:text-rust" />{event.location}</span>
        </p>
        <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          {Number(event.fee) > 0 && <span className="tw:text-sm tw:font-semibold">{formatFee(event.fee)}</span>}
          {!past && <Link to={`/enroll?event=${event.id}`} className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-rust">Reserve a spot <IcArrowRight className="nudge" /></Link>}
          {event.image && <a href={event.image} target="_blank" rel="noreferrer" className="tw:text-sm tw:font-medium tw:text-ink/70 tw:underline tw:underline-offset-4 tw:hover:text-ink">View flyer</a>}
        </div>
      </div>
    </article>
  );
}
