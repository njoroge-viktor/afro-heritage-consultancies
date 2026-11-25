export const SITE = {
  name: "Afro Heritage Consultancies",
  short: "AHC",
  tagline: "Touching Minds, Educating Hearts",
  phone: "+254 117 455 148",
  phoneHref: "tel:+254117455148",
  whatsapp: "254117455148",
  address: "Kony House RM: B01, Zambia stage, Ngong",
  hours: "Mon–Sat, 7:30 a.m. – 6:30 p.m.",
  mapQuery: "Zambia stage, Ngong, Kenya",
};

export const whatsappLink = (text = "Hello Afro Heritage Consultancies, I'd like to know more about your programs.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const CATEGORIES = {
  education: { label: "Education", blurb: "English and CBE / 8-4-4 tuition, plus spoken English coaching for adults and international learners.", color: "tw:bg-sage-300 tw:text-ink" },
  digital: { label: "Digital Skills", blurb: "Digital marketing, photography, video and editing — real, marketable skills for youth and small businesses.", color: "tw:bg-rust tw:text-white" },
  community: { label: "Community & Adventure", blurb: "Hikes, photo walks, interest groups and a coworking space that bring people together and tell local stories.", color: "tw:bg-night tw:text-paper" },
};

export const EVENT_TYPES = {
  workshop: "Workshop",
  intake: "Tuition intake",
  hike: "Hike",
  "photo-walk": "Photo walk",
};

export const PAPER_TYPES = {
  exam: "Exam papers",
  questions: "Topical questions",
  answers: "Answers & marking schemes",
  notes: "Revision notes",
};

export function formatBytes(n) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
}

export const STATUSES = [
  { id: "new", label: "New", tone: "tw:bg-amber-100 tw:text-amber-800 tw:ring-amber-300" },
  { id: "contacted", label: "Contacted", tone: "tw:bg-sky-100 tw:text-sky-800 tw:ring-sky-300" },
  { id: "enrolled", label: "Enrolled", tone: "tw:bg-emerald-100 tw:text-emerald-800 tw:ring-emerald-300" },
];

export function formatFee(fee, unit) {
  if (fee === null || fee === undefined || fee === "") return unit || "Call for rates";
  if (Number(fee) === 0) return "Free";
  return `KES ${Number(fee).toLocaleString("en-KE")}${unit ? ` ${unit}` : ""}`;
}

export function formatDate(iso, opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-KE", opts);
}

export function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "p.m." : "a.m.";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Accepts Kenyan numbers (07xx / 01xx / +254 / 254) and international numbers with a + prefix. */
export function validPhone(v) {
  const s = v.replace(/[\s()-]/g, "");
  return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(s) || /^\+\d{8,15}$/.test(s);
}

export function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
