/**
 * Closing slide of the home hero: the AHC logo as the "sun" of a small solar system
 * (planets, a book and a laptop on orbits), in a starfield, above a grass field in
 * the shape of Africa. Everything is drawn in SVG, so it is sharp at any size and
 * adds no image download beyond the logo itself.
 *
 * Two layers:
 *  - <SpaceBackdrop>: full-bleed stars and nebula (darkest on the left, behind the hero text).
 *  - <LogoSystem>:    logo, halo, orbits, orbiting bodies and the Africa field, drawn in a
 *                     square box the slide positions (right half on wide screens, centred on phones).
 * Motion (twinkle, drift, halo pulse) uses CSS animations, which index.css switches
 * off for visitors who prefer reduced motion.
 */

/* ---------- deterministic randomness (same picture on every render) ---------- */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/* ---------- Africa: hand-picked coastline points as [longitude, latitude] ---------- */
const AFRICA = [
  [-5.8, 35.8], [-2, 35.1], [3, 36.8], [8.6, 36.9], [11, 37.1], [10.2, 33.9], [11.5, 33.1], [13.2, 32.9], [15.3, 32.3],
  [18, 30.4], [20, 31.4], [20.1, 32.1], [22.5, 32.8], [25, 31.6], [29.9, 31.2], [32.3, 31.3], [32.5, 29.9], [33.8, 27.2],
  [35.5, 24], [37.2, 19.6], [38.6, 17.9], [39.5, 15.6], [41.6, 13.6], [42.7, 13], [43.1, 11.6], [45, 10.4], [48.5, 11.3],
  [51.3, 11.8], [51.4, 10.4], [49.8, 8], [48, 5], [45.3, 2], [42.5, -0.4], [40.2, -2.8], [39.7, -4], [39.3, -6.8],
  [39.5, -9], [40.5, -10.7], [40.7, -15], [39, -16.8], [36.9, -17.9], [34.8, -19.8], [35.4, -22], [35.4, -23.9],
  [32.6, -26], [32.8, -27.5], [31, -29.9], [29, -31.8], [27.9, -33], [25.6, -34], [22.5, -34], [20, -34.8], [18.4, -34],
  [17.9, -32.5], [16.5, -28.6], [15.2, -26.6], [14.5, -23], [13, -19], [11.8, -17.3], [12.1, -15.2], [13.4, -12.6],
  [13.8, -11], [13.2, -8.8], [12.3, -6], [11.9, -4.8], [9.4, -2], [8.7, -0.6], [9.5, 1], [9.7, 4], [8.3, 4.9], [6, 4.3],
  [4.5, 6.2], [3.4, 6.4], [1.2, 6.1], [-0.2, 5.6], [-2, 4.7], [-4, 5.3], [-7.7, 4.4], [-9.5, 5.5], [-10.8, 6.3],
  [-12.5, 7.5], [-13.2, 8.5], [-13.7, 9.5], [-15.1, 10.9], [-15.6, 11.9], [-16.8, 13.4], [-17.5, 14.7], [-16.5, 16],
  [-16, 18.1], [-16.3, 19.5], [-17, 20.8], [-16, 22.5], [-15.9, 23.7], [-14.5, 26.1], [-12.9, 27.9], [-11.3, 28.3],
  [-9.6, 30.4], [-9.8, 32], [-7.6, 33.6], [-6.8, 34], [-6, 35.2],
];
const MADAGASCAR = [[49.3, -12], [50.5, -15.5], [49.8, -17.5], [48.6, -20.5], [47.1, -24.9], [45.1, -25.5], [43.7, -23.6], [43.3, -21.5], [44.4, -19], [44.2, -16.4], [46.3, -15.9], [47.9, -13.5]];

/* Field box inside the 1000×1000 LogoSystem view: a flattened, slightly
   perspective map (narrower at the far, northern edge) so it reads as ground. */
const FIELD = { cx: 500, top: 625, height: 335, width: 530 };
function project([lon, lat]) {
  const u = (lon + 18) / 70; // 0 (west) … 1 (east)
  const v = (38 - lat) / 73; // 0 (north) … 1 (south)
  const w = FIELD.width * (0.8 + 0.2 * v);
  return [FIELD.cx + (u - 0.5) * w, FIELD.top + FIELD.height * v];
}
/** Smooth closed path through points (quadratic curves via midpoints). */
function smoothPath(pts) {
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M${f(mid(pts[pts.length - 1], pts[0]))}`;
  pts.forEach((p, i) => (d += `Q${f(p)} ${f(mid(p, pts[(i + 1) % pts.length]))}`));
  return d + "Z";
}
function inside([x, y], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const LAND = [AFRICA.map(project), MADAGASCAR.map(project)];
const LAND_PATH = LAND.map(smoothPath).join("");

/** Grass blades: a fringe along every coast plus tufts across the field, in three shades. */
const BLADES = (() => {
  const r = rng(7);
  const out = ["", "", ""];
  const blade = (x, y, h) => {
    const lean = (r() - 0.5) * h * 0.7, w = 1.2 + r() * 1.6;
    out[Math.floor(r() * 3)] += `M${(x - w).toFixed(1)} ${y.toFixed(1)}Q${(x + lean * 0.3).toFixed(1)} ${(y - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(y - h).toFixed(1)}Q${(x + lean * 0.4).toFixed(1)} ${(y - h * 0.5).toFixed(1)} ${(x + w).toFixed(1)} ${y.toFixed(1)}Z`;
  };
  for (const poly of LAND) {
    for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
      const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 3.2));
      for (let k = 0; k < n; k++) {
        const t = k / n;
        const depth = (y1 - FIELD.top) / FIELD.height; // nearer (south) = taller blades
        blade(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + 1.5, 5 + depth * 7 + r() * 6);
      }
    }
  }
  const [minX, maxX] = [FIELD.cx - FIELD.width / 2 - 10, FIELD.cx + FIELD.width / 2 + 10];
  for (let placed = 0, tries = 0; placed < 1300 && tries < 9000; tries++) {
    const p = [minX + r() * (maxX - minX), FIELD.top + r() * FIELD.height];
    if (!LAND.some((poly) => inside(p, poly))) continue;
    const depth = (p[1] - FIELD.top) / FIELD.height;
    blade(p[0], p[1], 3 + depth * 6 + r() * 4);
    placed++;
  }
  return out;
})();

/* ---------- stars for the backdrop (1600×900 view) ---------- */
const STARS = (() => {
  const r = rng(42);
  return Array.from({ length: 240 }, (_, i) => {
    const x = r() * 1600, y = r() * 900;
    // fewer, dimmer stars behind the hero text on the left
    const dim = x < 700 ? 0.55 : 1;
    return { x, y, r: 0.5 + r() ** 3 * 1.8, o: (0.35 + r() * 0.65) * dim, twinkle: i % 6 === 0, delay: (r() * 4).toFixed(2) };
  });
})();

export function SpaceBackdrop({ className }) {
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="ss-sky" cx="70%" cy="40%" r="85%">
          <stop offset="0" stopColor="#14193a" />
          <stop offset="0.55" stopColor="#070a1c" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <radialGradient id="ss-neb-a"><stop offset="0" stopColor="#6b45b8" stopOpacity="0.45" /><stop offset="1" stopColor="#6b45b8" stopOpacity="0" /></radialGradient>
        <radialGradient id="ss-neb-b"><stop offset="0" stopColor="#1f8a8a" stopOpacity="0.35" /><stop offset="1" stopColor="#1f8a8a" stopOpacity="0" /></radialGradient>
        <radialGradient id="ss-neb-c"><stop offset="0" stopColor="#9c4a22" stopOpacity="0.28" /><stop offset="1" stopColor="#9c4a22" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#ss-sky)" />
      <ellipse cx="1180" cy="230" rx="420" ry="230" fill="url(#ss-neb-a)" />
      <ellipse cx="1420" cy="560" rx="330" ry="260" fill="url(#ss-neb-b)" />
      <ellipse cx="900" cy="80" rx="300" ry="150" fill="url(#ss-neb-c)" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill="#fff" opacity={s.o.toFixed(2)}
          className={s.twinkle ? "ss-twinkle" : undefined} style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined} />
      ))}
    </svg>
  );
}

/* ---------- orbiting bodies (drawn around 0,0) ---------- */
function Book() {
  return (
    <g transform="rotate(-14)">
      <path d="M-34 -18 Q-17 -24 0 -16 L0 20 Q-17 12 -34 18 Z" fill="#c4602f" />
      <path d="M34 -18 Q17 -24 0 -16 L0 20 Q17 12 34 18 Z" fill="#9c4a22" />
      <path d="M-31 -16 Q-16 -21 -1 -14 L-1 17 Q-16 10 -31 15 Z" fill="#fbfaf3" />
      <path d="M31 -16 Q16 -21 1 -14 L1 17 Q16 10 31 15 Z" fill="#efeee3" />
      <path d="M-26 -9 Q-15 -12 -5 -8 M-26 -2 Q-15 -5 -5 -1 M-26 5 Q-15 2 -5 6 M5 -8 Q15 -12 26 -9 M5 -1 Q15 -5 26 -2 M5 6 Q15 2 26 5" stroke="#b9b6a3" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  );
}
function Laptop() {
  return (
    <g transform="rotate(10)">
      <rect x="-30" y="-36" width="60" height="40" rx="4" fill="#2b2f36" />
      <rect x="-26" y="-32" width="52" height="32" rx="2" fill="url(#ss-screen)" />
      <path d="M-20 -24 h22 M-20 -18 h32 M-20 -12 h16" stroke="#e8f7ff" strokeOpacity="0.8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M-38 4 H38 L44 13 Q44 16 40 16 H-40 Q-44 16 -44 13 Z" fill="#c9ced6" />
      <rect x="-9" y="9" width="18" height="3" rx="1.5" fill="#9aa1ab" />
    </g>
  );
}
function RingedPlanet() {
  return (
    <g transform="rotate(-18)">
      <ellipse cx="0" cy="0" rx="58" ry="14" fill="none" stroke="#e8c48a" strokeOpacity="0.55" strokeWidth="5" />
      <circle r="30" fill="url(#ss-sand)" />
      <path d="M-58 0 A58 14 0 0 0 58 0" fill="none" stroke="#f3d9a8" strokeOpacity="0.85" strokeWidth="5" />
    </g>
  );
}

/* orbits: tilted ellipses centred on the logo */
const SUN = { x: 500, y: 385 };
const ORBITS = [
  { rx: 330, ry: 105, tilt: -9 },
  { rx: 455, ry: 150, tilt: -9 },
];
function onOrbit(o, deg) {
  const a = (deg * Math.PI) / 180, t = (o.tilt * Math.PI) / 180;
  const x = o.rx * Math.cos(a), y = o.ry * Math.sin(a);
  return [SUN.x + x * Math.cos(t) - y * Math.sin(t), SUN.y + x * Math.sin(t) + y * Math.cos(t)];
}
const BODIES = [
  { orbit: 1, deg: 200, el: <RingedPlanet />, delay: 0 },
  { orbit: 0, deg: 152, el: <g transform="scale(1.45)"><Book /></g>, delay: 1.2 },
  { orbit: 1, deg: 22, el: <g transform="scale(1.4)"><Laptop /></g>, delay: 0.6 },
  { orbit: 0, deg: 330, el: <circle r="20" fill="url(#ss-blue)" />, delay: 2 },
  { orbit: 1, deg: 112, el: <circle r="11" fill="url(#ss-red)" />, delay: 1.6 },
  { orbit: 0, deg: 262, el: <circle r="7" fill="#c9ced6" />, delay: 0.9 },
];

export function LogoSystem({ className }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Afro Heritage Consultancies logo">
      <defs>
        <radialGradient id="ss-halo">
          <stop offset="0" stopColor="#fffde8" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#d3d88e" stopOpacity="0.32" />
          <stop offset="1" stopColor="#d3d88e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ss-sand" cx="35%" cy="35%"><stop offset="0" stopColor="#f6d39a" /><stop offset="1" stopColor="#b8642f" /></radialGradient>
        <radialGradient id="ss-blue" cx="35%" cy="35%"><stop offset="0" stopColor="#9be3ff" /><stop offset="1" stopColor="#1f4fa8" /></radialGradient>
        <radialGradient id="ss-red" cx="35%" cy="35%"><stop offset="0" stopColor="#f29b7e" /><stop offset="1" stopColor="#8a2d1c" /></radialGradient>
        <linearGradient id="ss-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b82d6" /><stop offset="1" stopColor="#7fd3ff" /></linearGradient>
        <linearGradient id="ss-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fd14a" />
          <stop offset="0.5" stopColor="#3aa832" />
          <stop offset="1" stopColor="#1f7a26" />
        </linearGradient>
        <radialGradient id="ss-ground-shadow"><stop offset="0" stopColor="#000" stopOpacity="0.65" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <filter id="ss-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>

      {/* Africa field, at the bottom */}
      <ellipse cx={FIELD.cx} cy={FIELD.top + FIELD.height * 0.62} rx={FIELD.width * 0.62} ry={FIELD.height * 0.5} fill="url(#ss-ground-shadow)" />
      <path d={LAND_PATH} fill="#7be05a" opacity="0.35" filter="url(#ss-glow)" />
      <path d={LAND_PATH} fill="url(#ss-grass)" />
      <path d={BLADES[0]} fill="#2f9a2c" />
      <path d={BLADES[1]} fill="#4fbf3a" />
      <path d={BLADES[2]} fill="#89e063" />

      {/* orbits, halo behind the eagle, then the logo (screen blend drops its black background) */}
      {ORBITS.map((o, i) => (
        <ellipse key={i} cx={SUN.x} cy={SUN.y} rx={o.rx} ry={o.ry} transform={`rotate(${o.tilt} ${SUN.x} ${SUN.y})`} fill="none" stroke="#d3d88e" strokeOpacity="0.28" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" />
      ))}
      <circle cx="402" cy="356" r="175" fill="url(#ss-halo)" className="ss-halo" />
      <image href="/images/logo-dark.jpg" x="240" y="125" width="520" height="520" style={{ mixBlendMode: "screen" }} />

      {BODIES.map((b, i) => {
        const [x, y] = onOrbit(ORBITS[b.orbit], b.deg);
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <g className="ss-drift" style={{ animationDelay: `${b.delay}s` }}>{b.el}</g>
          </g>
        );
      })}
    </svg>
  );
}
