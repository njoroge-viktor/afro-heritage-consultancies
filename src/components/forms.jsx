import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IcCircleCheck } from "./icons";
import { IcWhatsapp } from "./icons";
import { Button, Field, inputClass, useToast } from "./ui";
import { api } from "../lib/api";
import { CATEGORIES, formatDate, todayISO, validPhone, whatsappLink } from "../lib/site";

/**
 * Enrollment request form → POST /enrollments
 * value of the "Program or event" select is "p:<id>" or "e:<id>".
 */
export function EnrollmentForm({ programs = [], events = [], initial = "", compact = false }) {
  const toast = useToast();
  const [f, setF] = useState({ name: "", phone: "", target: initial, learnerLevel: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);

  const activePrograms = programs.filter((p) => p.active);
  const upcoming = events.filter((e) => e.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date));
  const [kind, rawId] = f.target.split(":");
  const id = Number(rawId);
  const program = kind === "p" ? programs.find((p) => p.id === id) : kind === "e" ? programs.find((p) => p.id === events.find((e) => e.id === id)?.programId) : null;
  const event = kind === "e" ? events.find((e) => e.id === id) : null;
  const levels = useMemo(() => program?.levels ?? [], [program]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value, ...(k === "target" ? { learnerLevel: "" } : {}) }));

  const validate = () => {
    const er = {};
    if (f.name.trim().length < 2) er.name = "Please enter the full name.";
    if (!validPhone(f.phone)) er.phone = "Enter a valid phone number, e.g. 0712 345 678 or +254 712 345 678.";
    if (!f.target) er.target = "Choose a program or event.";
    if (levels.length && !f.learnerLevel) er.learnerLevel = "Choose a level.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    const now = new Date().toISOString();
    try {
      await api.post("/enrollments", {
        name: f.name.trim(),
        phone: f.phone.trim(),
        programId: program?.id ?? null,
        programTitle: program?.title ?? null,
        eventId: event?.id ?? null,
        eventTitle: event?.title ?? null,
        learnerLevel: f.learnerLevel || null,
        message: f.message.trim(),
        status: "new",
        notes: "",
        createdAt: now,
        updatedAt: now,
      });
      setDone({ name: f.name.trim().split(" ")[0], what: event?.title ?? program?.title });
      toast({ tone: "success", title: "Request received", desc: "We'll call or WhatsApp you within 24 hours." });
    } catch {
      toast({ tone: "error", title: "Couldn't send your request", desc: "Please try again or message us on WhatsApp." });
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="tw:rounded-3xl tw:border tw:border-emerald-200 tw:bg-emerald-50 tw:p-8 tw:text-center" role="status">
        <IcCircleCheck className="tw:mx-auto tw:h-12 tw:w-12 tw:text-emerald-600" />
        <h3 className="tw:mt-4 tw:text-2xl tw:font-semibold">Thank you, {done.name}!</h3>
        <p className="tw:mt-2 tw:text-ink/70">Your request for <b>{done.what}</b> is in. Our team will call or WhatsApp you within 24 hours to confirm the details.</p>
        <div className="tw:mt-6 tw:flex tw:flex-wrap tw:justify-center tw:gap-3">
          <a href={whatsappLink(`Hello AHC, I just sent an enrollment request for ${done.what}.`)} target="_blank" rel="noreferrer" className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-whatsapp tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white"><IcWhatsapp /> Follow up on WhatsApp</a>
          <Button variant="outline" onClick={() => { setDone(null); setF({ name: "", phone: "", target: "", learnerLevel: "", message: "" }); }}>Send another request</Button>
        </div>
      </div>
    );

  return (
    <form noValidate onSubmit={submit} className="tw:space-y-4" aria-label="Enrollment request">
      <div className={compact ? "tw:space-y-4" : "tw:grid tw:gap-4 tw:sm:grid-cols-2"}>
        <Field label="Full name" htmlFor="en-name" required error={errors.name} hint="Parent/guardian name if enrolling a child">
          <input id="en-name" autoComplete="name" value={f.name} onChange={set("name")} placeholder="e.g. Grace Wanjiru" aria-invalid={!!errors.name} className={inputClass} />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="en-phone" required error={errors.phone}>
          <input id="en-phone" type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="0712 345 678" aria-invalid={!!errors.phone} className={inputClass} />
        </Field>
      </div>
      <Field label="Program or event" htmlFor="en-target" required error={errors.target}>
        <select id="en-target" value={f.target} onChange={set("target")} aria-invalid={!!errors.target} className={inputClass}>
          <option value="">Select…</option>
          {Object.entries(CATEGORIES).map(([key, c]) => {
            const items = activePrograms.filter((p) => p.category === key);
            return items.length ? (
              <optgroup key={key} label={c.label}>
                {items.map((p) => <option key={p.id} value={`p:${p.id}`}>{p.title}</option>)}
              </optgroup>
            ) : null;
          })}
          {upcoming.length > 0 && (
            <optgroup label="Upcoming events">
              {upcoming.map((e) => <option key={e.id} value={`e:${e.id}`}>{e.title} — {formatDate(e.date, { day: "numeric", month: "short" })}</option>)}
            </optgroup>
          )}
        </select>
      </Field>
      {levels.length > 0 && (
        <Field label="Learner level" htmlFor="en-level" required error={errors.learnerLevel}>
          <select id="en-level" value={f.learnerLevel} onChange={set("learnerLevel")} aria-invalid={!!errors.learnerLevel} className={inputClass}>
            <option value="">Select level…</option>
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
      )}
      <Field label="Message (optional)" htmlFor="en-msg" hint="Learner's name, preferred days, questions…">
        <textarea id="en-msg" rows={compact ? 3 : 4} value={f.message} onChange={set("message")} placeholder="Anything we should know?" className={inputClass} />
      </Field>
      <Button type="submit" size="lg" className="tw:w-full tw:sm:w-auto" disabled={sending}>{sending ? "Sending…" : "Send enrollment request"}</Button>
      <p className="tw:text-xs tw:text-ink/55">No payment needed now. We'll confirm the schedule and fees with you first. See our <Link to="/about#privacy" className="tw:underline">privacy note</Link>.</p>
    </form>
  );
}

/** Contact form → POST /messages */
export function ContactForm() {
  const toast = useToast();
  const [f, setF] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!validPhone(f.phone) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) er.phone = "Add a valid phone number or email so we can reply.";
    if (f.message.trim().length < 5) er.message = "Please write a short message.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSending(true);
    try {
      await api.post("/messages", { ...f, name: f.name.trim(), message: f.message.trim(), status: "unread", createdAt: new Date().toISOString() });
      setDone(true);
      toast({ tone: "success", title: "Message sent", desc: "We usually reply within a few hours." });
    } catch {
      toast({ tone: "error", title: "Couldn't send your message", desc: "Please try WhatsApp instead." });
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="tw:rounded-3xl tw:border tw:border-emerald-200 tw:bg-emerald-50 tw:p-8 tw:text-center" role="status">
        <IcCircleCheck className="tw:mx-auto tw:h-12 tw:w-12 tw:text-emerald-600" />
        <h3 className="tw:mt-4 tw:text-2xl tw:font-semibold">Message received</h3>
        <p className="tw:mt-2 tw:text-ink/70">Thanks {f.name.split(" ")[0]} — we'll get back to you shortly.</p>
        <Button variant="outline" className="tw:mt-6" onClick={() => { setDone(false); setF({ name: "", phone: "", email: "", subject: "", message: "" }); }}>Send another message</Button>
      </div>
    );

  return (
    <form noValidate onSubmit={submit} className="tw:space-y-4" aria-label="Contact">
      <Field label="Your name" htmlFor="ct-name" required error={errors.name}>
        <input id="ct-name" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} className={inputClass} />
      </Field>
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <Field label="Phone / WhatsApp" htmlFor="ct-phone" error={errors.phone}>
          <input id="ct-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} placeholder="0712 345 678" aria-invalid={!!errors.phone} className={inputClass} />
        </Field>
        <Field label="Email (optional)" htmlFor="ct-email">
          <input id="ct-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} placeholder="you@example.com" className={inputClass} />
        </Field>
      </div>
      <Field label="Subject" htmlFor="ct-subject">
        <select id="ct-subject" value={f.subject} onChange={set("subject")} className={inputClass}>
          <option value="">General question</option>
          <option>Tuition</option>
          <option>Spoken English coaching</option>
          <option>Digital skills training</option>
          <option>Hikes & community groups</option>
          <option>Coworking space booking</option>
          <option>Partnerships</option>
        </select>
      </Field>
      <Field label="Message" htmlFor="ct-message" required error={errors.message}>
        <textarea id="ct-message" rows={5} value={f.message} onChange={set("message")} aria-invalid={!!errors.message} className={inputClass} />
      </Field>
      <Button type="submit" size="lg" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
