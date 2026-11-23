import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "bootstrap";
import { IcCircleAlert, IcCircleCheck, IcInfo, IcLoaderCircle, IcMoon, IcSun, IcX } from "./icons";

export const cx = (...c) => c.filter(Boolean).join(" ");

export function Container({ className = "", children }) {
  return <div className={cx("tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:sm:px-6", className)}>{children}</div>;
}

export function Eyebrow({ children, className = "" }) {
  return <p className={cx("tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-rust", className)}>{children}</p>;
}

export function SectionTitle({ eyebrow, title, subtitle, center = false }) {
  return (
    <div data-reveal className={cx("tw:mb-10", center && "tw:mx-auto tw:max-w-2xl tw:text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="tw:mt-3 tw:text-3xl tw:font-semibold tw:leading-tight tw:sm:text-4xl">{title}</h2>
      {subtitle && <p className="tw:mt-3 tw:text-base tw:leading-relaxed tw:text-ink/70">{subtitle}</p>}
    </div>
  );
}

const variants = {
  primary: "tw:bg-rust tw:text-white tw:hover:bg-rust-dark",
  dark: "tw:bg-ink tw:text-cream tw:hover:bg-ink/85",
  sage: "tw:bg-sage-300 tw:text-ink tw:hover:bg-sage-400",
  outline: "tw:border-2 tw:border-ink/15 tw:text-ink tw:hover:border-rust tw:hover:text-rust",
  whatsapp: "tw:bg-whatsapp tw:text-white tw:hover:brightness-95",
  ghost: "tw:text-ink/70 tw:hover:bg-ink/5 tw:hover:text-ink",
  danger: "tw:bg-red-600 tw:text-white tw:hover:bg-red-700",
};
const sizes = { sm: "tw:px-3 tw:py-1.5 tw:text-sm", md: "tw:px-5 tw:py-2.5 tw:text-sm", lg: "tw:px-7 tw:py-3.5 tw:text-base" };
export const btn = (variant = "primary", size = "md", extra = "") =>
  cx("shine tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:font-semibold tw:transition tw:duration-300 tw:hover:-translate-y-0.5 tw:hover:shadow-lg tw:active:translate-y-0 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:disabled:hover:translate-y-0", variants[variant], sizes[size], extra);

export function Button({ variant, size, className, ...props }) {
  return <button type="button" {...props} className={btn(variant, size, className)} />;
}

export function ButtonLink({ to, variant, size, className, children, ...rest }) {
  if (/^(https?:|tel:|mailto:)/.test(to))
    return <a href={to} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={btn(variant, size, className)} {...rest}>{children}</a>;
  return <Link to={to} className={btn(variant, size, className)} {...rest}>{children}</Link>;
}

export function Badge({ children, className = "" }) {
  return <span className={cx("tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:px-2.5 tw:py-0.5 tw:text-xs tw:font-semibold", className)}>{children}</span>;
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-16 tw:text-ink/60" role="status">
      <IcLoaderCircle className="tw:h-5 tw:w-5 tw:animate-spin" /> {label}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="tw:rounded-3xl tw:border tw:border-red-200 tw:bg-red-50 tw:p-8 tw:text-center" role="alert">
      <IcCircleAlert className="tw:mx-auto tw:h-8 tw:w-8 tw:text-red-600" />
      <p className="tw:mt-3 tw:font-semibold">We couldn't load this right now.</p>
      <p className="tw:mt-1 tw:text-sm tw:text-ink/70">Check your connection, or reach us on WhatsApp while we sort it out.</p>
      {onRetry && <Button variant="outline" size="sm" className="tw:mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export const inputClass =
  "tw:w-full tw:rounded-xl tw:border tw:border-ink/15 tw:bg-surface tw:px-4 tw:py-3 tw:text-sm tw:text-ink tw:placeholder:text-ink/40 tw:outline-none tw:transition tw:focus:border-rust tw:focus:ring-4 tw:focus:ring-rust/15 tw:aria-[invalid=true]:border-red-500";

export function Field({ label, htmlFor, required, error, hint, children }) {
  return (
    <div className="tw:space-y-1.5">
      <label htmlFor={htmlFor} className="tw:block tw:text-sm tw:font-medium">
        {label} {required && <span className="tw:text-rust">*</span>}
      </label>
      {children}
      {error ? <p className="tw:text-xs tw:text-red-600" role="alert">{error}</p> : hint ? <p className="tw:text-xs tw:text-ink/55">{hint}</p> : null}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tw:fixed tw:inset-0 tw:z-[80] tw:flex tw:items-end tw:justify-center tw:p-0 tw:sm:items-center tw:sm:p-4">
      <div className="tw:absolute tw:inset-0 tw:bg-ink/60 tw:backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        className={cx("tw:relative tw:max-h-[92dvh] tw:w-full tw:overflow-y-auto tw:rounded-t-3xl tw:bg-cream tw:p-6 tw:shadow-2xl tw:outline-none tw:sm:rounded-3xl tw:sm:p-8", wide ? "tw:sm:max-w-2xl" : "tw:sm:max-w-md")}>
        <button type="button" onClick={onClose} aria-label="Close" className="tw:absolute tw:right-4 tw:top-4 tw:rounded-full tw:p-1.5 tw:text-ink/60 tw:hover:bg-ink/5 tw:hover:text-ink"><IcX className="tw:h-5 tw:w-5" /></button>
        {title && <h2 className="tw:mb-5 tw:pr-8 tw:text-2xl tw:font-semibold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4500);
  }, []);
  const icons = { success: IcCircleCheck, error: IcCircleAlert, info: IcInfo };
  const tones = { success: "tw:text-emerald-600", error: "tw:text-red-600", info: "tw:text-rust" };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="tw:pointer-events-none tw:fixed tw:bottom-4 tw:left-1/2 tw:z-[90] tw:flex tw:w-[min(380px,calc(100vw-2rem))] tw:-translate-x-1/2 tw:flex-col tw:gap-2 tw:sm:left-auto tw:sm:right-4 tw:sm:translate-x-0" aria-live="polite">
        {toasts.map((t) => {
          const I = icons[t.tone || "info"];
          return (
            <div key={t.id} role="status" className="tw:pointer-events-auto tw:flex tw:gap-3 tw:rounded-2xl tw:border tw:border-ink/10 tw:bg-surface tw:p-4 tw:shadow-xl">
              <I className={cx("tw:mt-0.5 tw:h-5 tw:w-5 tw:shrink-0", tones[t.tone || "info"])} />
              <div className="tw:min-w-0 tw:flex-1">
                <p className="tw:text-sm tw:font-semibold">{t.title}</p>
                {t.desc && <p className="tw:mt-0.5 tw:text-sm tw:text-ink/65">{t.desc}</p>}
              </div>
              <button type="button" aria-label="Dismiss" onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="tw:text-ink/40 tw:hover:text-ink"><IcX /></button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Bootstrap tooltip hook ---------- */
export function useTooltip(title, placement = "top") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !title) return;
    const tip = Tooltip.getOrCreateInstance(el, { title, placement, trigger: "hover focus" });
    tip.setContent({ ".tooltip-inner": title });
    return () => tip.dispose();
  }, [title, placement]);
  return ref;
}

/* ---------- Theme ---------- */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.setAttribute("data-bs-theme", t);
  try {
    localStorage.setItem("ahc-theme", t);
  } catch {
    /* storage unavailable */
  }
}

export function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") || "light" : "light",
  );
  const next = theme === "dark" ? "light" : "dark";
  const ref = useTooltip(`Switch to ${next} mode`, "bottom");
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => { applyTheme(next); setTheme(next); }}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === "dark"}
      className={cx("tw:relative tw:flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-full tw:bg-sage-200 tw:text-ink tw:transition tw:hover:rotate-12 tw:hover:bg-sage-300", className)}
    >
      <IcSun className={cx("tw:absolute tw:text-lg tw:transition tw:duration-500", theme === "dark" ? "tw:translate-y-8 tw:opacity-0" : "tw:translate-y-0 tw:opacity-100")} />
      <IcMoon className={cx("tw:absolute tw:text-lg tw:transition tw:duration-500", theme === "dark" ? "tw:translate-y-0 tw:opacity-100" : "tw:-translate-y-8 tw:opacity-0")} />
    </button>
  );
}

/** Logo that swaps to the light-lettered version in dark mode. */
export function Logo({ className = "tw:h-12 tw:w-auto tw:sm:h-14" }) {
  return (
    <>
      <img src="/images/logo.png" alt="Afro Heritage Consultancies" width="160" height="72" className={cx(className, "tw:dark:hidden")} />
      <img src="/images/logo-light.png" alt="Afro Heritage Consultancies" width="160" height="72" className={cx(className, "tw:hidden tw:dark:block")} />
    </>
  );
}
