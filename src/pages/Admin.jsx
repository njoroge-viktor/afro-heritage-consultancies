import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IcCalendarPlus, IcDownload, IcExternalLink, IcInbox, IcLock, IcLogOut, IcMail, IcMailOpen, IcPencil, IcPhone, IcPlus,
  IcRefreshCw, IcSearch, IcStickyNote, IcTarget, IcTimer, IcTrash2, IcTriangleAlert,
} from "../components/icons";
import { IcWhatsapp } from "../components/icons";
import { Badge, Button, Container, ErrorState, Field, Loading, Modal, cx, inputClass, useToast } from "../components/ui";
import { api, seatsLeft, useResource } from "../lib/api";
import { CATEGORIES, EVENT_TYPES, STATUSES, formatDate, formatFee, timeAgo } from "../lib/site";

// NOTE: client-side gate only. json-server has no auth — put real auth in front of the API before going public.
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "ahc-admin";
const KEY = "ahc-admin-ok";
const DAY = 864e5;
const GOAL = { requests: 30, weeks: 8 };

function Gate({ onOk }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <Container className="tw:flex tw:min-h-[70vh] tw:items-center tw:justify-center tw:py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code === PASSCODE) {
            sessionStorage.setItem(KEY, "1");
            onOk();
          } else setErr("Incorrect passcode.");
        }}
        className="tw:w-full tw:max-w-sm tw:rounded-3xl tw:bg-surface tw:p-8 tw:shadow-xl tw:ring-1 tw:ring-ink/10"
      >
        <span className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-sage-300 tw:text-xl"><IcLock /></span>
        <h1 className="tw:mt-5 tw:text-2xl tw:font-semibold">AHC staff area</h1>
        <p className="tw:mb-6 tw:mt-1 tw:text-sm tw:text-ink/65">Enter the staff passcode to manage requests, programs and events.</p>
        <Field label="Passcode" htmlFor="pc" error={err}>
          <input id="pc" type="password" autoComplete="current-password" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!err} className={inputClass} autoFocus />
        </Field>
        <Button type="submit" className="tw:mt-5 tw:w-full">Enter</Button>
        <Link to="/" className="tw:mt-4 tw:block tw:text-center tw:text-sm tw:text-ink/60 tw:hover:text-ink">← Back to website</Link>
      </form>
    </Container>
  );
}

export default function Admin() {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === "1");
  if (!ok) return <Gate onOk={() => setOk(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(KEY); setOk(false); }} />;
}

function Stat({ icon: I, label, value, sub, tone = "" }) {
  return (
    <div className={cx("tw:rounded-3xl tw:bg-surface tw:p-5 tw:ring-1 tw:ring-ink/10", tone)}>
      <p className="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-ink/55"><I className="tw:h-4 tw:w-4" />{label}</p>
      <p className="tw:mt-2 tw:font-display tw:text-3xl tw:font-semibold">{value}</p>
      {sub && <div className="tw:mt-1 tw:text-xs tw:text-ink/60">{sub}</div>}
    </div>
  );
}

function Dashboard({ onLogout }) {
  const enrollments = useResource("/enrollments?_sort=createdAt&_order=desc");
  const messages = useResource("/messages?_sort=createdAt&_order=desc");
  const programs = useResource("/programs");
  const events = useResource("/events?_sort=date&_order=asc");
  const [tab, setTab] = useState("requests");

  // Refresh requests and messages every 30 seconds so new ones show up.
  useEffect(() => {
    const id = setInterval(() => { enrollments.reload(); messages.reload(); }, 30000);
    return () => clearInterval(id);
  }, [enrollments.reload, messages.reload]);

  const stats = useMemo(() => {
    const list = enrollments.data ?? [];
    const now = Date.now();
    const recent = list.filter((e) => now - new Date(e.createdAt) < GOAL.weeks * 7 * DAY).length;
    const fresh = list.filter((e) => e.status === "new");
    const overdue = fresh.filter((e) => now - new Date(e.createdAt) > DAY).length;
    const answered = list.filter((e) => e.contactedAt);
    const avgH = answered.length ? answered.reduce((s, e) => s + (new Date(e.contactedAt) - new Date(e.createdAt)), 0) / answered.length / 36e5 : null;
    return { recent, fresh: fresh.length, overdue, avgH, unread: (messages.data ?? []).filter((m) => m.status === "unread").length };
  }, [enrollments.data, messages.data]);

  const reloadAll = () => [enrollments, messages, programs, events].forEach((r) => r.reload());
  const tabs = [
    ["requests", `Enrollment requests`, stats.fresh],
    ["messages", "Messages", stats.unread],
    ["programs", "Programs", null],
    ["events", "Events", null],
  ];

  return (
    <Container className="tw:py-10">
      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-4">
        <div>
          <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-rust">Staff dashboard</p>
          <h1 className="tw:mt-1 tw:text-3xl tw:font-semibold">Afro Heritage admin</h1>
        </div>
        <div className="tw:flex tw:gap-2">
          <Button variant="outline" size="sm" onClick={reloadAll}><IcRefreshCw /> Refresh</Button>
          <Button variant="ghost" size="sm" onClick={onLogout}><IcLogOut /> Log out</Button>
        </div>
      </div>

      <div className="tw:mt-8 tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        <Stat icon={IcTarget} label={`Requests · last ${GOAL.weeks} weeks`} value={`${stats.recent}/${GOAL.requests}`}
          sub={<div className="tw:mt-2 tw:h-2 tw:overflow-hidden tw:rounded-full tw:bg-ink/10"><div className="tw:h-full tw:rounded-full tw:bg-rust" style={{ width: `${Math.min(100, (stats.recent / GOAL.requests) * 100)}%` }} /></div>} />
        <Stat icon={IcInbox} label="New — need a reply" value={stats.fresh} sub="Move to Contacted once you've called" />
        <Stat icon={IcTriangleAlert} label="Overdue (> 24 h)" value={stats.overdue} sub={stats.overdue ? "Reply to these first" : "All caught up"} tone={stats.overdue ? "tw:bg-red-50 tw:ring-red-200" : ""} />
        <Stat icon={IcTimer} label="Avg. first response" value={stats.avgH === null ? "—" : stats.avgH < 1 ? `${Math.round(stats.avgH * 60)} min` : `${stats.avgH.toFixed(1)} h`} sub="Target: within 24 hours" />
      </div>

      <div role="tablist" className="tw:mt-10 tw:flex tw:flex-wrap tw:gap-2 tw:border-b tw:border-ink/10">
        {tabs.map(([id, l, n]) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)}
            className={cx("tw:-mb-px tw:flex tw:items-center tw:gap-2 tw:border-b-2 tw:px-4 tw:py-3 tw:text-sm tw:font-semibold", tab === id ? "tw:border-rust tw:text-rust" : "tw:border-transparent tw:text-ink/60 tw:hover:text-ink")}>
            {l}{n ? <span className="tw:rounded-full tw:bg-rust tw:px-2 tw:py-0.5 tw:text-xs tw:text-white">{n}</span> : null}
          </button>
        ))}
      </div>

      <div className="tw:mt-6">
        {tab === "requests" && <Requests res={enrollments} programs={programs.data ?? []} events={events.data ?? []} />}
        {tab === "messages" && <Messages res={messages} />}
        {tab === "programs" && <ProgramsAdmin res={programs} enrollments={enrollments.data ?? []} />}
        {tab === "events" && <EventsAdmin res={events} programs={programs.data ?? []} />}
      </div>
    </Container>
  );
}

const statusTone = Object.fromEntries(STATUSES.map((s) => [s.id, s.tone]));
const waText = (r) => `Hello ${r.name.split(" ")[0]}, this is Afro Heritage Consultancies following up on your request for ${r.eventTitle || r.programTitle || "our programs"}.`;
const waLink = (phone, text) => {
  let p = phone.replace(/[^\d+]/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  return `https://wa.me/${p.replace("+", "")}?text=${encodeURIComponent(text)}`;
};

function Requests({ res, programs, events }) {
  const toast = useToast();
  const [status, setStatus] = useState("all");
  const [prog, setProg] = useState("all");
  const [q, setQ] = useState("");
  const [noteFor, setNoteFor] = useState(null);
  const [note, setNote] = useState("");
  const [del, setDel] = useState(null);

  if (res.loading && !res.data) return <Loading />;
  if (res.error) return <ErrorState onRetry={res.reload} />;
  const list = res.data.filter((r) =>
    (status === "all" || r.status === status) &&
    (prog === "all" || String(r.programId) === prog) &&
    (!q || `${r.name} ${r.phone} ${r.message}`.toLowerCase().includes(q.toLowerCase())),
  );

  const setStatusFor = async (r, s) => {
    const now = new Date().toISOString();
    await api.patch(`/enrollments/${r.id}`, { status: s, updatedAt: now, ...(r.status === "new" && s !== "new" && !r.contactedAt ? { contactedAt: now } : {}) });
    toast({ tone: "success", title: `Marked ${STATUSES.find((x) => x.id === s).label.toLowerCase()}`, desc: r.name });
    res.reload();
  };

  const exportCsv = () => {
    const cols = ["createdAt", "name", "phone", "programTitle", "eventTitle", "learnerLevel", "status", "message", "notes"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...list.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `ahc-enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="tw:mb-5 tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <div className="tw:flex tw:flex-wrap tw:gap-1 tw:rounded-full tw:bg-surface tw:p-1 tw:ring-1 tw:ring-ink/10">
          {[{ id: "all", label: "All" }, ...STATUSES].map((s) => {
            const n = s.id === "all" ? res.data.length : res.data.filter((r) => r.status === s.id).length;
            return <button key={s.id} type="button" aria-pressed={status === s.id} onClick={() => setStatus(s.id)} className={cx("tw:rounded-full tw:px-3 tw:py-1.5 tw:text-sm tw:font-semibold", status === s.id ? "tw:bg-ink tw:text-cream" : "tw:text-ink/65")}>{s.label} <span className="tw:opacity-60">{n}</span></button>;
          })}
        </div>
        <select aria-label="Filter by program" value={prog} onChange={(e) => setProg(e.target.value)} className={cx(inputClass, "tw:w-auto tw:py-2")}>
          <option value="all">All programs</option>
          {programs.map((p) => <option key={p.id} value={String(p.id)}>{p.title}</option>)}
        </select>
        <div className="tw:relative tw:min-w-48 tw:flex-1">
          <IcSearch className="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-ink/40" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, message…" aria-label="Search requests" className={cx(inputClass, "tw:py-2 tw:pl-9")} />
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!list.length}><IcDownload /> Export CSV</Button>
      </div>

      {!list.length ? (
        <p className="tw:rounded-3xl tw:border tw:border-dashed tw:border-ink/20 tw:p-10 tw:text-center tw:text-ink/60">No enrollment requests {status !== "all" ? `marked “${status}”` : "yet"}.</p>
      ) : (
        <div className="tw:space-y-3">
          {list.map((r) => {
            const overdue = r.status === "new" && Date.now() - new Date(r.createdAt) > DAY;
            const event = events.find((e) => e.id === r.eventId);
            return (
              <article key={r.id} className={cx("tw:grid tw:gap-4 tw:rounded-3xl tw:bg-surface tw:p-5 tw:ring-1 tw:lg:grid-cols-[1.3fr_1.2fr_auto]", overdue ? "tw:ring-red-300" : "tw:ring-ink/10")}>
                <div className="tw:min-w-0">
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                    <h3 className="tw:font-sans tw:text-base tw:font-semibold">{r.name}</h3>
                    <Badge className={cx("tw:ring-1", statusTone[r.status])}>{r.status}</Badge>
                    {overdue && <Badge className="tw:bg-red-100 tw:text-red-700"><IcTriangleAlert className="tw:h-3 tw:w-3" /> Over 24 h</Badge>}
                  </div>
                  <p className="tw:mt-1 tw:flex tw:flex-wrap tw:gap-3 tw:text-sm">
                    <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="tw:flex tw:items-center tw:gap-1 tw:text-ink/75 tw:hover:text-rust"><IcPhone className="tw:h-3.5 tw:w-3.5" />{r.phone}</a>
                    <a href={waLink(r.phone, waText(r))} target="_blank" rel="noreferrer" className="tw:flex tw:items-center tw:gap-1 tw:text-green-700 tw:hover:underline"><IcWhatsapp />WhatsApp</a>
                  </p>
                  <p className="tw:mt-1 tw:text-xs tw:text-ink/55">Received {timeAgo(r.createdAt)} · {new Date(r.createdAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <div className="tw:min-w-0 tw:text-sm">
                  <p className="tw:font-semibold">{r.eventTitle || r.programTitle || "—"}</p>
                  {event && r.programTitle && <p className="tw:text-xs tw:text-ink/55">Program: {r.programTitle}</p>}
                  {r.learnerLevel && <p className="tw:text-ink/70">Level: {r.learnerLevel}</p>}
                  {r.message && <p className="tw:mt-1 tw:line-clamp-3 tw:text-ink/70">“{r.message}”</p>}
                  {r.notes && <p className="tw:mt-2 tw:rounded-lg tw:bg-sage-100 tw:px-3 tw:py-1.5 tw:text-xs"><b>Note:</b> {r.notes}</p>}
                </div>
                <div className="tw:flex tw:flex-row tw:flex-wrap tw:items-start tw:gap-2 tw:lg:flex-col tw:lg:items-end">
                  <select aria-label={`Status for ${r.name}`} value={r.status} onChange={(e) => setStatusFor(r, e.target.value)} className={cx(inputClass, "tw:w-36 tw:py-2 tw:font-semibold")}>
                    {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <div className="tw:flex tw:gap-1">
                    <Button variant="ghost" size="sm" aria-label={`Add note for ${r.name}`} onClick={() => { setNoteFor(r); setNote(r.notes || ""); }}><IcStickyNote /></Button>
                    <Button variant="ghost" size="sm" aria-label={`Delete request from ${r.name}`} onClick={() => setDel(r)}><IcTrash2 /></Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={!!noteFor} onClose={() => setNoteFor(null)} title={`Notes — ${noteFor?.name ?? ""}`}>
        <textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} aria-label="Notes" placeholder="e.g. Called Tue 3pm, starting Monday, Grade 6" className={inputClass} />
        <div className="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
          <Button variant="outline" onClick={() => setNoteFor(null)}>Cancel</Button>
          <Button onClick={async () => { await api.patch(`/enrollments/${noteFor.id}`, { notes: note.trim(), updatedAt: new Date().toISOString() }); toast({ tone: "success", title: "Note saved" }); setNoteFor(null); res.reload(); }}>Save note</Button>
        </div>
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete this request?">
        <p className="tw:text-sm tw:text-ink/70">The request from <b>{del?.name}</b> will be permanently removed.</p>
        <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-2">
          <Button variant="outline" onClick={() => setDel(null)}>Cancel</Button>
          <Button variant="danger" onClick={async () => { await api.del(`/enrollments/${del.id}`); toast({ tone: "success", title: "Request deleted" }); setDel(null); res.reload(); }}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}

function Messages({ res }) {
  const toast = useToast();
  if (res.loading && !res.data) return <Loading />;
  if (res.error) return <ErrorState onRetry={res.reload} />;
  if (!res.data.length) return <p className="tw:rounded-3xl tw:border tw:border-dashed tw:border-ink/20 tw:p-10 tw:text-center tw:text-ink/60">No messages yet.</p>;
  const toggle = async (m) => { await api.patch(`/messages/${m.id}`, { status: m.status === "unread" ? "read" : "unread" }); res.reload(); };
  return (
    <div className="tw:space-y-3">
      {res.data.map((m) => (
        <article key={m.id} className={cx("tw:rounded-3xl tw:bg-surface tw:p-5 tw:ring-1", m.status === "unread" ? "tw:ring-rust/40" : "tw:ring-ink/10")}>
          <div className="tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-3">
            <div>
              <h3 className="tw:flex tw:items-center tw:gap-2 tw:font-sans tw:text-base tw:font-semibold">{m.status === "unread" && <span className="tw:h-2 tw:w-2 tw:rounded-full tw:bg-rust" aria-label="Unread" />}{m.name} <span className="tw:text-sm tw:font-normal tw:text-ink/55">· {m.subject || "General question"}</span></h3>
              <p className="tw:mt-1 tw:flex tw:flex-wrap tw:gap-3 tw:text-sm tw:text-ink/70">
                {m.phone && <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="tw:flex tw:items-center tw:gap-1 tw:hover:text-rust"><IcPhone className="tw:h-3.5 tw:w-3.5" />{m.phone}</a>}
                {m.phone && <a href={waLink(m.phone, `Hello ${m.name.split(" ")[0]}, thanks for your message to Afro Heritage Consultancies.`)} target="_blank" rel="noreferrer" className="tw:flex tw:items-center tw:gap-1 tw:text-green-700"><IcWhatsapp />WhatsApp</a>}
                {m.email && <a href={`mailto:${m.email}`} className="tw:flex tw:items-center tw:gap-1 tw:hover:text-rust"><IcMail className="tw:h-3.5 tw:w-3.5" />{m.email}</a>}
                <span className="tw:text-ink/50">{timeAgo(m.createdAt)}</span>
              </p>
            </div>
            <div className="tw:flex tw:gap-1">
              <Button variant="ghost" size="sm" onClick={() => toggle(m)}>{m.status === "unread" ? <><IcMailOpen /> Mark read</> : <><IcMail /> Mark unread</>}</Button>
              <Button variant="ghost" size="sm" aria-label={`Delete message from ${m.name}`} onClick={async () => { await api.del(`/messages/${m.id}`); toast({ tone: "success", title: "Message deleted" }); res.reload(); }}><IcTrash2 /></Button>
            </div>
          </div>
          <p className="tw:mt-3 tw:whitespace-pre-line tw:text-sm tw:leading-relaxed">{m.message}</p>
        </article>
      ))}
    </div>
  );
}

/* ---------------- Programs CRUD ---------------- */
const emptyProgram = { title: "", slug: "", category: "education", summary: "", description: "", audience: "", schedule: "", duration: "", fee: "", feeUnit: "per month", capacity: 20, levels: "", location: "Kony House, Zambia stage, Ngong", highlights: "", active: true };
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ProgramsAdmin({ res, enrollments }) {
  const toast = useToast();
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [errors, setErrors] = useState({});
  if (res.loading && !res.data) return <Loading />;
  if (res.error) return <ErrorState onRetry={res.reload} />;

  const open = (p) => {
    setErrors({});
    setEdit(p ? { ...p, fee: p.fee ?? "", levels: (p.levels ?? []).join("\n"), highlights: (p.highlights ?? []).join("\n") } : { ...emptyProgram });
  };
  const save = async (e) => {
    e.preventDefault();
    const er = {};
    if (edit.title.trim().length < 3) er.title = "Add a title.";
    const slug = slugify(edit.slug || edit.title);
    if (res.data.some((p) => p.slug === slug && p.id !== edit.id)) er.slug = "Another program already uses this URL.";
    if (edit.fee !== "" && (isNaN(edit.fee) || Number(edit.fee) < 0)) er.fee = "Fee must be a number (or leave blank).";
    if (!(Number(edit.capacity) > 0)) er.capacity = "Capacity must be at least 1.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const body = {
      ...edit, slug, title: edit.title.trim(),
      fee: edit.fee === "" ? null : Number(edit.fee),
      capacity: Number(edit.capacity),
      levels: edit.levels.split("\n").map((s) => s.trim()).filter(Boolean),
      highlights: edit.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    if (edit.id) await api.patch(`/programs/${edit.id}`, body);
    else await api.post("/programs", body);
    toast({ tone: "success", title: edit.id ? "Program updated" : "Program added", desc: body.title });
    setEdit(null);
    res.reload();
  };
  const set = (k) => (e) => setEdit((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <>
      <div className="tw:mb-5 tw:flex tw:justify-end"><Button onClick={() => open(null)}><IcPlus /> Add program</Button></div>
      <div className="tw:overflow-x-auto tw:rounded-3xl tw:bg-surface tw:ring-1 tw:ring-ink/10">
        <table className="tw:w-full tw:min-w-[760px] tw:text-left tw:text-sm">
          <thead className="tw:bg-sage-100 tw:text-xs tw:uppercase tw:tracking-wider tw:text-ink/60"><tr><th className="tw:p-4">Program</th><th className="tw:p-4">Category</th><th className="tw:p-4">Fee</th><th className="tw:p-4">Seats left</th><th className="tw:p-4">Status</th><th className="tw:p-4" /></tr></thead>
          <tbody className="tw:divide-y tw:divide-ink/10">
            {res.data.map((p) => (
              <tr key={p.id}>
                <td className="tw:p-4"><p className="tw:font-semibold">{p.title}</p><p className="tw:text-xs tw:text-ink/55">/programs/{p.slug}</p></td>
                <td className="tw:p-4">{CATEGORIES[p.category]?.label}</td>
                <td className="tw:p-4">{formatFee(p.fee, p.feeUnit)}</td>
                <td className="tw:p-4">{seatsLeft(p, enrollments)} / {p.capacity}</td>
                <td className="tw:p-4">
                  <button type="button" onClick={async () => { await api.patch(`/programs/${p.id}`, { active: !p.active }); res.reload(); }} aria-pressed={p.active}
                    className={cx("tw:rounded-full tw:px-3 tw:py-1 tw:text-xs tw:font-semibold", p.active ? "tw:bg-emerald-100 tw:text-emerald-800" : "tw:bg-ink/10 tw:text-ink/60")}>{p.active ? "Live" : "Hidden"}</button>
                </td>
                <td className="tw:p-4 tw:text-right tw:whitespace-nowrap">
                  {p.active && <Link to={`/programs/${p.slug}`} target="_blank" className="tw:mr-1 tw:inline-flex tw:rounded-full tw:p-2 tw:text-ink/60 tw:hover:bg-ink/5" aria-label={`View ${p.title}`}><IcExternalLink /></Link>}
                  <Button variant="ghost" size="sm" aria-label={`Edit ${p.title}`} onClick={() => open(p)}><IcPencil /></Button>
                  <Button variant="ghost" size="sm" aria-label={`Delete ${p.title}`} onClick={() => setDel(p)}><IcTrash2 /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "Edit program" : "Add program"} wide>
        {edit && (
          <form noValidate onSubmit={save} className="tw:space-y-4">
            <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
              <Field label="Title" htmlFor="p-title" required error={errors.title}><input id="p-title" value={edit.title} onChange={set("title")} className={inputClass} /></Field>
              <Field label="URL slug" htmlFor="p-slug" error={errors.slug} hint={`/programs/${slugify(edit.slug || edit.title) || "…"}`}><input id="p-slug" value={edit.slug} onChange={set("slug")} placeholder="auto from title" className={inputClass} /></Field>
              <Field label="Category" htmlFor="p-cat"><select id="p-cat" value={edit.category} onChange={set("category")} className={inputClass}>{Object.entries(CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}</select></Field>
              <Field label="Audience" htmlFor="p-aud"><input id="p-aud" value={edit.audience} onChange={set("audience")} className={inputClass} /></Field>
              <Field label="Schedule" htmlFor="p-sch"><input id="p-sch" value={edit.schedule} onChange={set("schedule")} placeholder="Mon & Wed 4:00–6:00 p.m." className={inputClass} /></Field>
              <Field label="Duration" htmlFor="p-dur"><input id="p-dur" value={edit.duration} onChange={set("duration")} placeholder="6 weeks" className={inputClass} /></Field>
              <Field label="Fee (KES)" htmlFor="p-fee" error={errors.fee} hint="Leave blank for “call for rates”, 0 for free"><input id="p-fee" inputMode="numeric" value={edit.fee} onChange={set("fee")} className={inputClass} /></Field>
              <Field label="Fee unit" htmlFor="p-unit"><input id="p-unit" value={edit.feeUnit} onChange={set("feeUnit")} placeholder="per month / per course" className={inputClass} /></Field>
              <Field label="Capacity (seats)" htmlFor="p-cap" error={errors.capacity}><input id="p-cap" type="number" min="1" value={edit.capacity} onChange={set("capacity")} className={inputClass} /></Field>
              <Field label="Location" htmlFor="p-loc"><input id="p-loc" value={edit.location} onChange={set("location")} className={inputClass} /></Field>
            </div>
            <Field label="Short summary" htmlFor="p-sum"><input id="p-sum" value={edit.summary} onChange={set("summary")} className={inputClass} /></Field>
            <Field label="Description" htmlFor="p-desc"><textarea id="p-desc" rows={3} value={edit.description} onChange={set("description")} className={inputClass} /></Field>
            <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
              <Field label="Learner levels" htmlFor="p-lv" hint="One per line"><textarea id="p-lv" rows={4} value={edit.levels} onChange={set("levels")} className={inputClass} /></Field>
              <Field label="Highlights" htmlFor="p-hl" hint="One per line"><textarea id="p-hl" rows={4} value={edit.highlights} onChange={set("highlights")} className={inputClass} /></Field>
            </div>
            <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm"><input type="checkbox" checked={edit.active} onChange={set("active")} className="tw:h-4 tw:w-4 tw:accent-[#9c4a22]" /> Show on website</label>
            <div className="tw:flex tw:justify-end tw:gap-2 tw:pt-2"><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">{edit.id ? "Save changes" : "Add program"}</Button></div>
          </form>
        )}
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete program?">
        <p className="tw:text-sm tw:text-ink/70"><b>{del?.title}</b> will be removed from the website. Existing enrollment requests keep their program name. To hide it temporarily instead, set it to “Hidden”.</p>
        <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-2"><Button variant="outline" onClick={() => setDel(null)}>Cancel</Button><Button variant="danger" onClick={async () => { await api.del(`/programs/${del.id}`); toast({ tone: "success", title: "Program deleted" }); setDel(null); res.reload(); }}>Delete</Button></div>
      </Modal>
    </>
  );
}

/* ---------------- Events CRUD ---------------- */
const emptyEvent = { title: "", type: "workshop", date: "", startTime: "09:00", endTime: "12:00", mode: "in-person", location: "Kony House, Ngong", fee: 0, capacity: 30, programId: "", description: "", image: "" };

function EventsAdmin({ res, programs }) {
  const toast = useToast();
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [errors, setErrors] = useState({});
  if (res.loading && !res.data) return <Loading />;
  if (res.error) return <ErrorState onRetry={res.reload} />;

  const set = (k) => (e) => setEdit((s) => ({ ...s, [k]: e.target.value }));
  const save = async (e) => {
    e.preventDefault();
    const er = {};
    if (edit.title.trim().length < 3) er.title = "Add a title.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(edit.date)) er.date = "Pick a date.";
    if (edit.endTime <= edit.startTime) er.endTime = "End time must be after the start.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const body = { ...edit, title: edit.title.trim(), fee: Number(edit.fee) || 0, capacity: Number(edit.capacity) || 0, programId: edit.programId ? Number(edit.programId) : null, image: edit.image || null };
    if (edit.id) await api.patch(`/events/${edit.id}`, body);
    else await api.post("/events", body);
    toast({ tone: "success", title: edit.id ? "Event updated" : "Event added", desc: body.title });
    setEdit(null);
    res.reload();
  };

  return (
    <>
      <div className="tw:mb-5 tw:flex tw:justify-end"><Button onClick={() => { setErrors({}); setEdit({ ...emptyEvent }); }}><IcCalendarPlus /> Add event</Button></div>
      <div className="tw:overflow-x-auto tw:rounded-3xl tw:bg-surface tw:ring-1 tw:ring-ink/10">
        <table className="tw:w-full tw:min-w-[720px] tw:text-left tw:text-sm">
          <thead className="tw:bg-sage-100 tw:text-xs tw:uppercase tw:tracking-wider tw:text-ink/60"><tr><th className="tw:p-4">Event</th><th className="tw:p-4">Date</th><th className="tw:p-4">Type</th><th className="tw:p-4">Fee</th><th className="tw:p-4" /></tr></thead>
          <tbody className="tw:divide-y tw:divide-ink/10">
            {res.data.map((ev) => (
              <tr key={ev.id}>
                <td className="tw:p-4"><p className="tw:font-semibold">{ev.title}</p><p className="tw:text-xs tw:text-ink/55">{ev.location}</p></td>
                <td className="tw:p-4 tw:whitespace-nowrap">{formatDate(ev.date)}</td>
                <td className="tw:p-4">{EVENT_TYPES[ev.type] ?? ev.type}</td>
                <td className="tw:p-4">{formatFee(ev.fee)}</td>
                <td className="tw:p-4 tw:text-right tw:whitespace-nowrap">
                  <Button variant="ghost" size="sm" aria-label={`Edit ${ev.title}`} onClick={() => { setErrors({}); setEdit({ ...ev, programId: ev.programId ?? "", image: ev.image ?? "" }); }}><IcPencil /></Button>
                  <Button variant="ghost" size="sm" aria-label={`Delete ${ev.title}`} onClick={() => setDel(ev)}><IcTrash2 /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "Edit event" : "Add event"} wide>
        {edit && (
          <form noValidate onSubmit={save} className="tw:space-y-4">
            <Field label="Title" htmlFor="e-title" required error={errors.title}><input id="e-title" value={edit.title} onChange={set("title")} className={inputClass} /></Field>
            <div className="tw:grid tw:gap-4 tw:sm:grid-cols-3">
              <Field label="Date" htmlFor="e-date" required error={errors.date}><input id="e-date" type="date" value={edit.date} onChange={set("date")} className={inputClass} /></Field>
              <Field label="Starts" htmlFor="e-start"><input id="e-start" type="time" value={edit.startTime} onChange={set("startTime")} className={inputClass} /></Field>
              <Field label="Ends" htmlFor="e-end" error={errors.endTime}><input id="e-end" type="time" value={edit.endTime} onChange={set("endTime")} className={inputClass} /></Field>
              <Field label="Type" htmlFor="e-type"><select id="e-type" value={edit.type} onChange={set("type")} className={inputClass}>{Object.entries(EVENT_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
              <Field label="Mode" htmlFor="e-mode"><select id="e-mode" value={edit.mode} onChange={set("mode")} className={inputClass}><option value="in-person">In person</option><option value="online">Online</option></select></Field>
              <Field label="Linked program" htmlFor="e-prog"><select id="e-prog" value={edit.programId} onChange={set("programId")} className={inputClass}><option value="">None</option>{programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
              <Field label="Location" htmlFor="e-loc"><input id="e-loc" value={edit.location} onChange={set("location")} className={inputClass} /></Field>
              <Field label="Fee (KES, 0 = free)" htmlFor="e-fee"><input id="e-fee" inputMode="numeric" value={edit.fee} onChange={set("fee")} className={inputClass} /></Field>
              <Field label="Capacity" htmlFor="e-cap"><input id="e-cap" type="number" min="0" value={edit.capacity} onChange={set("capacity")} className={inputClass} /></Field>
            </div>
            <Field label="Description" htmlFor="e-desc"><textarea id="e-desc" rows={3} value={edit.description} onChange={set("description")} className={inputClass} /></Field>
            <Field label="Flyer image URL (optional)" htmlFor="e-img" hint="e.g. /images/flyer-raise-smart.jpg — put files in public/images"><input id="e-img" value={edit.image} onChange={set("image")} className={inputClass} /></Field>
            <div className="tw:flex tw:justify-end tw:gap-2 tw:pt-2"><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">{edit.id ? "Save changes" : "Add event"}</Button></div>
          </form>
        )}
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete event?">
        <p className="tw:text-sm tw:text-ink/70"><b>{del?.title}</b> will be removed from the events list.</p>
        <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-2"><Button variant="outline" onClick={() => setDel(null)}>Cancel</Button><Button variant="danger" onClick={async () => { await api.del(`/events/${del.id}`); toast({ tone: "success", title: "Event deleted" }); setDel(null); res.reload(); }}>Delete</Button></div>
      </Modal>
    </>
  );
}

