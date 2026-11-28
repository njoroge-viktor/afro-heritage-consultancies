import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { IcSearch, IcX } from "../components/icons";
import { Container, ErrorState, Loading, SectionTitle, cx, inputClass } from "../components/ui";
import { ProgramCard } from "../components/cards";
import { CommunityOutreach } from "../components/community";
import { seatsLeft, useResource } from "../lib/api";
import { CATEGORIES } from "../lib/site";

export default function Programs() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const q = params.get("q") ?? "";
  const programs = useResource("/programs?active=true");
  const enrollments = useResource("/enrollments?status=enrolled");

  const update = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (programs.data ?? []).filter(
      (p) => (category === "all" || p.category === category) &&
        (!s || [p.title, p.summary, p.audience].join(" ").toLowerCase().includes(s)),
    );
  }, [programs.data, category, q]);

  const tabs = [["all", "All programs"], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.label])];

  return (
    <Container className="tw:py-14">
      <SectionTitle eyebrow="Program catalogue" title="Find the right program" subtitle="Schedules, fees and seats left for every AHC program. Pick one and send a request in under two minutes." />
      <div className="tw:mb-8 tw:flex tw:flex-col tw:gap-4 tw:lg:flex-row tw:lg:items-center tw:lg:justify-between">
        <div role="tablist" aria-label="Program category" className="tw:flex tw:flex-wrap tw:gap-2">
          {tabs.map(([k, l]) => {
            const n = k === "all" ? programs.data?.length : programs.data?.filter((p) => p.category === k).length;
            return (
              <button key={k} role="tab" type="button" aria-selected={category === k} onClick={() => update("category", k)}
                className={cx("tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition", category === k ? "tw:bg-ink tw:text-cream" : "tw:bg-surface tw:text-ink/75 tw:ring-1 tw:ring-ink/10 tw:hover:ring-rust")}>
                {l}{n !== undefined && <span className="tw:ml-1.5 tw:opacity-60">{n}</span>}
              </button>
            );
          })}
        </div>
        <div className="tw:relative tw:w-full tw:lg:w-72">
          <IcSearch className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:text-ink/45" />
          <input type="search" value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search programs…" aria-label="Search programs" className={cx(inputClass, "tw:rounded-full tw:pl-11")} />
        </div>
      </div>

      {category !== "all" && <p className="tw:mb-8 tw:max-w-2xl tw:text-ink/70">{CATEGORIES[category]?.blurb}</p>}

      {programs.loading ? <Loading /> : programs.error ? <ErrorState onRetry={programs.reload} /> : shown.length ? (
        <div className="tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {shown.map((p) => <ProgramCard key={p.id} program={p} seats={seatsLeft(p, enrollments.data ?? [])} />)}
        </div>
      ) : (
        <div className="tw:rounded-3xl tw:border tw:border-dashed tw:border-ink/20 tw:p-10 tw:text-center">
          <p className="tw:font-semibold">No programs match “{q}”.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="tw:mt-3 tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:font-semibold tw:text-rust"><IcX /> Clear filters</button>
        </div>
      )}

      {category === "community" && <CommunityOutreach />}
    </Container>
  );
}
