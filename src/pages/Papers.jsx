import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IcBookOpen, IcCircleCheck, IcDownload, IcGraduationCap, IcListChecks, IcSearch, IcStickyNote, IcX } from "../components/icons";
import { Badge, Button, ButtonLink, Container, ErrorState, Loading, SectionTitle, cx, inputClass } from "../components/ui";
import { PAPER_TYPES, formatBytes, whatsappLink } from "../lib/site";

const PAGE = 24;
const typeIcon = { exam: IcGraduationCap, questions: IcListChecks, answers: IcCircleCheck, notes: IcStickyNote };

/** The catalogue is a static file (public/papers.json); the documents sit in public/papers/. */
function usePapers() {
  const [state, setState] = useState({ data: null, error: null });
  const load = useCallback(() => {
    setState({ data: null, error: null });
    fetch("/papers.json", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`Couldn't load papers.json (${r.status})`);
        return r.json();
      })
      .then((data) => setState({ data, error: null }))
      .catch((error) => setState({ data: null, error }));
  }, []);
  useEffect(() => load(), [load]);
  return { ...state, reload: load };
}

function PaperRow({ paper }) {
  const Icon = typeIcon[paper.type] ?? IcBookOpen;
  const details = [paper.format, paper.pages && `${paper.pages} page${paper.pages === 1 ? "" : "s"}`, formatBytes(paper.bytes)].filter(Boolean).join(" · ");
  return (
    <li className="tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-ink/10 tw:bg-surface tw:p-4 tw:transition tw:hover:border-rust/40 tw:sm:flex-nowrap tw:sm:p-5">
      <span className="tw:hidden tw:h-12 tw:w-12 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-sage-200 tw:text-xl tw:text-ink tw:sm:flex"><Icon /></span>
      <div className="tw:min-w-0 tw:flex-1 tw:basis-full tw:sm:basis-auto">
        <div className="tw:flex tw:flex-wrap tw:gap-1.5">
          <Badge className="tw:bg-rust/10 tw:text-rust">{PAPER_TYPES[paper.type]}</Badge>
          <Badge className="tw:bg-ink/5 tw:text-ink/75">{paper.subject}</Badge>
          <Badge className="tw:bg-ink/5 tw:text-ink/75">{paper.level}</Badge>
        </div>
        <h3 className="tw:mt-2 tw:font-sans tw:text-base tw:font-semibold tw:leading-snug">{paper.title}</h3>
        <p className="tw:mt-1 tw:text-xs tw:text-ink/65">{details}{paper.credit && <> · By {paper.credit}</>}</p>
      </div>
      <div className="tw:flex tw:shrink-0 tw:gap-2 tw:max-sm:w-full">
        {paper.format === "PDF" && (
          <a href={paper.file} target="_blank" rel="noreferrer" aria-label={`View ${paper.title} (${paper.subject}, opens in a new tab)`} className={cx(linkButton, "tw:border-2 tw:border-ink/15 tw:hover:border-rust tw:hover:text-rust")}>View</a>
        )}
        <a href={paper.file} download aria-label={`Download ${paper.title} (${paper.subject}, ${paper.format}, ${formatBytes(paper.bytes)})`} className={cx(linkButton, "tw:bg-rust tw:text-white tw:hover:bg-rust-dark")}><IcDownload /> Download</a>
      </div>
    </li>
  );
}
const linkButton = "tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition tw:max-sm:flex-1";

export default function Papers() {
  const [params, setParams] = useSearchParams();
  const { data, error, reload } = usePapers();
  const type = params.get("type") ?? "all";
  const subject = params.get("subject") ?? "all";
  const level = params.get("level") ?? "all";
  const q = params.get("q") ?? "";
  const [limit, setLimit] = useState(PAGE);

  const update = (key, value) => {
    setLimit(PAGE);
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  };
  const clear = () => {
    setLimit(PAGE);
    setParams({}, { replace: true });
  };

  const subjects = useMemo(() => [...new Set((data ?? []).map((p) => p.subject))].sort(), [data]);
  const levels = useMemo(() => [...new Set((data ?? []).map((p) => p.level))].sort((a, b) => a.length - b.length || a.localeCompare(b)), [data]);

  // Everything except the type tab, so each tab can show how many files it holds.
  const matching = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return (data ?? []).filter((p) => {
      if (subject !== "all" && p.subject !== subject) return false;
      if (level !== "all" && p.level !== level) return false;
      const text = [p.title, p.subject, p.level, p.credit, PAPER_TYPES[p.type]].join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [data, subject, level, q]);
  const shown = type === "all" ? matching : matching.filter((p) => p.type === type);
  const filtered = type !== "all" || subject !== "all" || level !== "all" || q !== "";

  return (
    <Container className="tw:py-14">
      <SectionTitle eyebrow="Free downloads" title="Past papers & revision" subtitle="Practice questions and answers for 8-4-4 Physics and Mathematics. Free to download, no sign-up needed, with more to come." />

      <div className="tw:mb-4 tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-[1fr_200px_200px]">
        <div className="tw:relative tw:sm:col-span-2 tw:lg:col-span-1">
          <IcSearch className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:text-ink/45" />
          <input type="search" value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search a topic, e.g. fluid flow" aria-label="Search past papers" className={cx(inputClass, "tw:rounded-full tw:pl-11")} />
        </div>
        <select value={subject} onChange={(e) => update("subject", e.target.value)} aria-label="Subject" className={cx(inputClass, "tw:rounded-full")}>
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={level} onChange={(e) => update("level", e.target.value)} aria-label="Form" className={cx(inputClass, "tw:rounded-full")}>
          <option value="all">All forms</option>
          {levels.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div role="group" aria-label="Type of material" className="tw:mb-6 tw:flex tw:flex-wrap tw:gap-2">
        {[["all", "All"], ...Object.entries(PAPER_TYPES).filter(([k]) => data?.some((p) => p.type === k))].map(([k, l]) => (
          <button key={k} type="button" aria-pressed={type === k} onClick={() => update("type", k)}
            className={cx("tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition", type === k ? "tw:bg-ink tw:text-cream" : "tw:bg-surface tw:text-ink/75 tw:ring-1 tw:ring-ink/10 tw:hover:ring-rust")}>
            {l}{data && <span className="tw:ml-1.5 tw:opacity-60">{k === "all" ? matching.length : matching.filter((p) => p.type === k).length}</span>}
          </button>
        ))}
      </div>

      {error ? <ErrorState onRetry={reload} /> : !data ? <Loading /> : shown.length ? (
        <>
          <p className="tw:mb-4 tw:text-sm tw:text-ink/65" role="status">
            Showing {Math.min(limit, shown.length)} of {shown.length} file{shown.length === 1 ? "" : "s"}
            {filtered && <button type="button" onClick={clear} className="tw:ml-3 tw:inline-flex tw:items-center tw:gap-1 tw:font-semibold tw:text-rust"><IcX /> Clear filters</button>}
          </p>
          <ul className="tw:space-y-3">{shown.slice(0, limit).map((p) => <PaperRow key={p.id} paper={p} />)}</ul>
          {shown.length > limit && (
            <div className="tw:mt-8 tw:text-center"><Button variant="outline" onClick={() => setLimit((n) => n + PAGE)}>Show more</Button></div>
          )}
        </>
      ) : (
        <div className="tw:rounded-3xl tw:border tw:border-dashed tw:border-ink/20 tw:p-10 tw:text-center">
          <p className="tw:font-semibold">No papers match your search.</p>
          <button type="button" onClick={clear} className="tw:mt-3 tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:font-semibold tw:text-rust"><IcX /> Clear filters</button>
        </div>
      )}

      <div className="tw:mt-14 tw:flex tw:flex-col tw:gap-5 tw:rounded-3xl tw:bg-sage-100 tw:p-7 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
        <div>
          <h2 className="tw:text-2xl tw:font-semibold">Stuck on a topic?</h2>
          <p className="tw:mt-1 tw:max-w-xl tw:text-sm tw:text-ink/70">Our tutors can work through these papers with you at Kony House, Ngong.</p>
        </div>
        <ButtonLink to="/programs?category=education" className="tw:shrink-0">See tuition programs</ButtonLink>
      </div>
      <p className="tw:mt-6 tw:text-xs tw:leading-relaxed tw:text-ink/65">
        Shared for private study. If you own one of these documents and would like it credited or removed,{" "}
        <a href={whatsappLink("Hello AHC, I'm writing about a document on your past papers page.")} target="_blank" rel="noreferrer" className="tw:underline tw:underline-offset-4">tell us on WhatsApp</a>.
      </p>
    </Container>
  );
}
