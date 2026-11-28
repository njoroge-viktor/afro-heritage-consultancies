import manifest from "../../public/images/site/images-manifest.json";

/**
 * The client's photos and video, read from public/images/site/images-manifest.json
 * (the source of truth for size and alt text). Keys are the file names without
 * extension, e.g. MEDIA["hero-01-classroom-ai-lesson"].
 *
 * The photos are already sized, colour-corrected and watermarked (bottom-right).
 * Never re-crop or re-compress them, and keep overlays out of the bottom-right ~20%.
 */
const BASE = "/images/site/";
const key = (file) => file.split("/").pop().replace(/\.\w+$/, "");

export const MEDIA = Object.fromEntries(
  manifest
    .filter((m) => m.fallback)
    .map((m) => [key(m.file), { alt: m.alt, width: m.width, height: m.height, webp: BASE + m.file, jpg: BASE + m.fallback }]),
);

const video = manifest.find((m) => m.file.endsWith(".mp4"));
export const TESTIMONIAL_VIDEO = { src: BASE + video.file, poster: BASE + video.poster, width: video.width, height: video.height, label: video.alt };

/**
 * Photos still awaiting client confirmation (who is shown, caption, consent).
 * Any listed here appear only on the local dev server, marked "Awaiting client
 * confirmation", and are left out of production builds. Consent for all current
 * photos was confirmed at collection, so the list is empty.
 */
export const UNCONFIRMED = new Set([]);
export const SHOW_UNCONFIRMED = import.meta.env.DEV;

/** Program card / detail photo for each program slug (programs without one use a coloured panel). */
export const PROGRAM_PHOTOS = {
  "english-tuition": "tuition-01-learners-on-phones",
  "cbe-844-tuition": "tuition-02-two-learners-smiling",
  "spoken-english-adults": "tuition-03-adult-learners-desks",
  "digital-marketing": "digital-skills-04-video-presenting",
  photography: "hero-02-youth-media-session",
};

/** Programs whose detail page shows the learner video testimonial. */
export const TESTIMONIAL_PROGRAMS = new Set(["english-tuition", "cbe-844-tuition"]);

/**
 * Impact figures shown beside the book-donation photo, e.g. ["1,200", "books donated"].
 * TODO(client): supply real figures. The block stays hidden while this is empty.
 */
export const IMPACT = [];

/**
 * Object positions that keep the bottom-right watermark in frame when a 3:2 photo
 * is shown in a different shape. Watermark sits ~3% in from the right/bottom edges.
 */
export const KEEP_WATERMARK = {
  wider: "50% 85%", // 3:2 shown wider (16:9): trims mostly from the top
  narrower: "85% 50%", // 3:2 shown narrower (4:3): trims mostly from the left
};
