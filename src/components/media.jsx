import { useEffect, useRef, useState } from "react";
import { MEDIA, SHOW_UNCONFIRMED, TESTIMONIAL_VIDEO, UNCONFIRMED } from "../lib/media";
import { cx } from "./ui";

/**
 * One of the client's photos: WebP with a JPEG fallback, intrinsic width/height
 * from the manifest (no layout shift) and the manifest's alt text.
 * `className` styles the <picture> wrapper, `imgClassName` the <img>.
 */
export function Photo({ name, className, imgClassName, position, priority = false, alt }) {
  const m = MEDIA[name];
  if (!m) throw new Error(`Unknown photo "${name}"`);
  return (
    <picture className={cx("tw:block", className)}>
      <source type="image/webp" srcSet={m.webp} />
      <img
        src={m.jpg}
        width={m.width}
        height={m.height}
        alt={alt ?? m.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cx("tw:block", imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  );
}

/** True if a photo may be shown in this build (see UNCONFIRMED in lib/media.js). */
export const canShow = (name) => !UNCONFIRMED.has(name) || SHOW_UNCONFIRMED;

/** Dev-only marker on photos the client hasn't confirmed yet. */
export function PendingBadge({ name }) {
  if (!UNCONFIRMED.has(name)) return null;
  return <span className="tw:absolute tw:left-3 tw:top-3 tw:z-10 tw:rounded-full tw:bg-amber-300 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-amber-950">Awaiting client confirmation (dev only)</span>;
}

/**
 * Vertical testimonial video in a phone-style frame. The <video> is only created
 * when it nears the viewport; until then the poster stands in. Never autoplays.
 */
export function TestimonialVideo({ className }) {
  const box = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const v = TESTIMONIAL_VIDEO;
  return (
    <div className={cx("tw:mx-auto tw:w-full tw:max-w-[360px] tw:rounded-[2.5rem] tw:bg-night tw:p-2.5 tw:shadow-2xl tw:ring-1 tw:ring-black/10", className)}>
      <div ref={box} className="tw:relative tw:aspect-[9/16] tw:overflow-hidden tw:rounded-[2rem] tw:bg-black">
        {near ? (
          <video controls playsInline preload="metadata" poster={v.poster} width={v.width} height={v.height} aria-label={v.label} className="tw:h-full tw:w-full tw:object-contain">
            <source src={v.src} type="video/mp4" />
          </video>
        ) : (
          <img src={v.poster} alt={v.label} width={720} height={1280} loading="lazy" decoding="async" className="tw:h-full tw:w-full tw:object-contain" />
        )}
      </div>
    </div>
  );
}
