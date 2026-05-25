import type { FlowerKind } from "@/lib/types";

type FlowerProps = {
  kind: FlowerKind;
  color: string;
  accentColor?: string;
  size?: number;
  className?: string;
  seed?: number;
};

export function Flower({
  kind,
  color,
  accentColor = "#444",
  size = 80,
  className,
  seed = 0,
}: FlowerProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      overflow="visible"
    >
      <FlowerPaths
        kind={kind}
        color={color}
        accentColor={accentColor}
        seed={seed}
      />
    </svg>
  );
}

export function FlowerPaths({
  kind,
  color,
  accentColor = "#444",
  seed = 0,
}: {
  kind: FlowerKind;
  color: string;
  accentColor?: string;
  seed?: number;
}) {
  const uid = `${kind}-${Math.abs(hash(color + accentColor + seed))}`;
  const props = { color, accentColor, uid, seed };
  switch (kind) {
    case "rose":
      return <Rose {...props} />;
    case "tulip":
      return <Tulip {...props} />;
    case "daisy":
      return <Daisy {...props} />;
    case "sunflower":
      return <Sunflower {...props} />;
    case "lily":
      return <Lily {...props} />;
    case "peony":
      return <Peony {...props} />;
    case "hydrangea":
      return <Hydrangea {...props} />;
    case "lavender":
      return <Lavender {...props} />;
    case "eucalyptus":
      return <Eucalyptus {...props} />;
    case "babys-breath":
      return <BabysBreath {...props} />;
  }
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

function rnd(seed: number, i: number) {
  const x = Math.sin((seed + i + 1) * 9173.137) * 10000;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
}

function rnd3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function tr(
  tx?: number,
  ty?: number,
  rot?: number,
  scale?: number,
  rotCenter?: [number, number],
) {
  const parts: string[] = [];
  if (tx !== undefined && ty !== undefined)
    parts.push(`translate(${rnd3(tx)} ${rnd3(ty)})`);
  if (rot !== undefined) {
    parts.push(
      rotCenter
        ? `rotate(${rnd3(rot)} ${rnd3(rotCenter[0])} ${rnd3(rotCenter[1])})`
        : `rotate(${rnd3(rot)})`,
    );
  }
  if (scale !== undefined) parts.push(`scale(${rnd3(scale)})`);
  return parts.join(" ");
}

type Inner = { color: string; accentColor: string; uid: string; seed: number };

function lighten(hex: string, amt = 0.18) {
  return mix(hex, "#ffffff", amt);
}
function darken(hex: string, amt = 0.2) {
  return mix(hex, "#1a1006", amt);
}
function tint(hex: string, towards: string, amt: number) {
  return mix(hex, towards, amt);
}
function shift(hex: string, hueRotDeg: number) {
  // Quick HSL hue rotation for organic color variance.
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = (h + hueRotDeg / 360 + 1) % 1;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r2 = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g2 = Math.round(hue2rgb(p, q, h) * 255);
  const b2 = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${[r2, g2, b2].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function mix(a: string, b: string, t: number) {
  const ar = parseInt(a.slice(1, 3), 16),
    ag = parseInt(a.slice(3, 5), 16),
    ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16),
    bg = parseInt(b.slice(3, 5), 16),
    bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const c = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, c]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

function CommonDefs({
  uid,
  color,
  accentColor,
}: {
  uid: string;
  color: string;
  accentColor: string;
}) {
  return (
    <defs>
      <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
        <feOffset dx="0.4" dy="2" result="ob" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.42" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <radialGradient id={`${uid}-petal-a`} cx="45%" cy="25%" r="80%">
        <stop offset="0%" stopColor={lighten(color, 0.42)} />
        <stop offset="22%" stopColor={lighten(color, 0.22)} />
        <stop offset="55%" stopColor={lighten(color, 0.05)} />
        <stop offset="80%" stopColor={color} />
        <stop offset="100%" stopColor={darken(color, 0.25)} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-b`} cx="50%" cy="22%" r="85%">
        <stop offset="0%" stopColor={lighten(color, 0.5)} />
        <stop offset="30%" stopColor={lighten(color, 0.25)} />
        <stop offset="65%" stopColor={lighten(color, 0.1)} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-c`} cx="50%" cy="20%" r="85%">
        <stop offset="0%" stopColor={lighten(color, 0.28)} />
        <stop offset="40%" stopColor={color} />
        <stop offset="80%" stopColor={darken(color, 0.12)} />
        <stop offset="100%" stopColor={darken(color, 0.32)} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-d`} cx="55%" cy="35%" r="80%">
        <stop offset="0%" stopColor={lighten(color, 0.18)} />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor={darken(color, 0.4)} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-dark`} cx="50%" cy="20%" r="90%">
        <stop offset="0%" stopColor={darken(color, 0.05)} />
        <stop offset="60%" stopColor={darken(color, 0.22)} />
        <stop offset="100%" stopColor={darken(color, 0.45)} />
      </radialGradient>

      {/* Specular highlight — soft white blob */}
      <radialGradient id={`${uid}-hl`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>

      {/* Hard specular sparkle */}
      <radialGradient id={`${uid}-sparkle`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#fff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>

      {/* Center with 3D-feel gradient */}
      <radialGradient id={`${uid}-center`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor={lighten(accentColor, 0.4)} />
        <stop offset="35%" stopColor={lighten(accentColor, 0.1)} />
        <stop offset="70%" stopColor={accentColor} />
        <stop offset="100%" stopColor={darken(accentColor, 0.35)} />
      </radialGradient>

      <linearGradient id={`${uid}-stem`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#3b4d2d" />
        <stop offset="50%" stopColor="#8aa178" />
        <stop offset="100%" stopColor="#3b4d2d" />
      </linearGradient>

      {/* Subtle organic noise overlay */}
      <filter
        id={`${uid}-grain`}
        x="0"
        y="0"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.6"
          numOctaves="2"
          seed={Math.abs(hash(uid))}
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.1
                  0 0 0 0 0.06
                  0 0 0 0 0.04
                  0 0 0 0.08 0"
        />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  );
}

/* Petal shape: pointed teardrop, base at (0,0), tip at (0,-1) */
const PETAL_PATH =
  "M0 0 Q-0.9 -0.2 -0.95 -0.55 Q-0.75 -0.92 -0.12 -1 L0.08 -1 Q0.7 -0.92 0.93 -0.55 Q0.95 -0.22 0 0 Z";

/* Curved petal variant for more variation */
const PETAL_PATH_2 =
  "M0 0 Q-1.05 -0.18 -0.92 -0.6 Q-0.6 -1 0 -0.98 Q0.6 -1 0.92 -0.6 Q1.02 -0.22 0 0 Z";

function Petal({
  cx,
  cy,
  size,
  rot,
  fill,
  veinColor,
  hlId,
  sparkleId,
  highlight = true,
  veins = true,
  edge,
  variant = 0,
  flipX = false,
}: {
  cx: number;
  cy: number;
  size: number;
  rot: number;
  fill: string;
  veinColor?: string;
  hlId: string;
  sparkleId?: string;
  highlight?: boolean;
  veins?: boolean;
  edge?: string;
  variant?: 0 | 1;
  flipX?: boolean;
}) {
  const d = variant === 1 ? PETAL_PATH_2 : PETAL_PATH;
  const scaleStr = flipX ? `scale(${-size} ${size})` : `scale(${size})`;
  return (
    <g
      transform={`translate(${rnd3(cx)} ${rnd3(cy)}) rotate(${rnd3(rot)}) ${scaleStr}`}
    >
      <path
        d={d}
        fill={fill}
        stroke={edge}
        strokeWidth={edge ? 0.018 : 0}
        strokeOpacity={0.45}
      />
      {/* Dark edge shadow on left side suggesting curl */}
      <path
        d={d}
        fill="none"
        stroke="#000"
        strokeOpacity="0.12"
        strokeWidth="0.025"
      />
      {veins && veinColor && (
        <>
          <path
            d="M0 -0.05 Q0 -0.5 0 -0.96"
            stroke={veinColor}
            strokeWidth="0.011"
            strokeOpacity="0.38"
            fill="none"
          />
          <path
            d="M0 -0.3 Q-0.25 -0.5 -0.42 -0.65"
            stroke={veinColor}
            strokeWidth="0.008"
            strokeOpacity="0.28"
            fill="none"
          />
          <path
            d="M0 -0.3 Q0.25 -0.5 0.42 -0.65"
            stroke={veinColor}
            strokeWidth="0.008"
            strokeOpacity="0.28"
            fill="none"
          />
          <path
            d="M0 -0.55 Q-0.15 -0.7 -0.28 -0.8"
            stroke={veinColor}
            strokeWidth="0.006"
            strokeOpacity="0.22"
            fill="none"
          />
          <path
            d="M0 -0.55 Q0.15 -0.7 0.28 -0.8"
            stroke={veinColor}
            strokeWidth="0.006"
            strokeOpacity="0.22"
            fill="none"
          />
        </>
      )}
      {highlight && (
        <ellipse
          cx="-0.05"
          cy="-0.6"
          rx="0.24"
          ry="0.36"
          fill={`url(#${hlId})`}
          opacity="0.7"
        />
      )}
      {sparkleId && (
        <ellipse
          cx="0.05"
          cy="-0.78"
          rx="0.12"
          ry="0.18"
          fill={`url(#${sparkleId})`}
          opacity="0.6"
        />
      )}
    </g>
  );
}

/* === ROSE — high-density spiral === */
function Rose({ color, accentColor, uid, seed }: Inner) {
  const layers = [
    { count: 9, ringR: 33, petalSize: 30, gradient: "a", rotShift: 0 },
    { count: 9, ringR: 24, petalSize: 25, gradient: "a", rotShift: 20 },
    { count: 8, ringR: 16, petalSize: 20, gradient: "b", rotShift: 40 },
    { count: 7, ringR: 10, petalSize: 16, gradient: "c", rotShift: 18 },
    { count: 5, ringR: 5, petalSize: 12, gradient: "c", rotShift: 36 },
    { count: 3, ringR: 1, petalSize: 8, gradient: "dark", rotShift: 60 },
  ];
  const hlId = `${uid}-hl`;
  const sparkleId = `${uid}-sparkle`;

  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {layers.flatMap((layer, lI) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const baseAngle = (i / layer.count) * 360 + layer.rotShift;
          const wobble = (rnd(seed, lI * 7 + i) - 0.5) * 12;
          const angle = baseAngle + wobble;
          const rad = (angle * Math.PI) / 180;
          const offsetMag = layer.ringR * (0.82 + rnd(seed, lI * 11 + i) * 0.36);
          const cx = 50 + Math.cos(rad) * offsetMag;
          const cy = 50 + Math.sin(rad) * offsetMag;
          const sizeJitter = layer.petalSize * (0.88 + rnd(seed, lI * 13 + i) * 0.2);
          const rot = angle + 90 + (rnd(seed, lI * 17 + i) - 0.5) * 18;
          // Per-petal color variation
          const petalHue = (rnd(seed, lI * 19 + i) - 0.5) * 6;
          const baseColor = shift(color, petalHue);
          // For mid layers, slightly darken or lighten randomly
          const petalFill = `url(#${uid}-petal-${layer.gradient})`;
          // Petal fill via stroke for some, but keeping with gradient
          return (
            <Petal
              key={`${lI}-${i}`}
              cx={cx}
              cy={cy}
              size={sizeJitter}
              rot={rot}
              fill={petalFill}
              veinColor={darken(baseColor, 0.3)}
              edge={darken(baseColor, 0.2)}
              hlId={hlId}
              sparkleId={lI < 2 ? sparkleId : undefined}
              highlight={lI < 4}
              veins={lI < 3}
              variant={(i + lI) % 2 === 0 ? 0 : 1}
            />
          );
        }),
      )}
      {/* Tight bud center */}
      <ellipse cx="50" cy="50.5" rx="3.4" ry="3" fill={darken(color, 0.5)} />
      <ellipse cx="49.5" cy="48.5" rx="1.4" ry="0.7" fill={lighten(color, 0.25)} opacity="0.5" />
    </g>
  );
}

/* === TULIP === */
function Tulip({ color, accentColor, uid, seed }: Inner) {
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back darker petals */}
      <path
        d="M50 82 Q14 60 22 28 Q30 14 50 14 Q70 14 78 28 Q86 60 50 82 Z"
        fill={`url(#${uid}-petal-c)`}
      />
      {/* Mid petals */}
      <path
        d="M50 82 Q26 60 30 32 Q34 18 50 18 Q66 18 70 32 Q74 60 50 82 Z"
        fill={`url(#${uid}-petal-a)`}
      />
      {/* Inner front petal */}
      <path
        d="M50 82 Q40 60 42 26 Q46 18 50 18 Q54 18 58 26 Q60 60 50 82 Z"
        fill={`url(#${uid}-petal-b)`}
      />
      {/* Petal seams */}
      <path
        d="M37 32 Q33 50 38 72"
        stroke={darken(color, 0.3)}
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M63 32 Q67 50 62 72"
        stroke={darken(color, 0.3)}
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />
      {/* Multiple highlights — top wet shine */}
      <ellipse
        cx="42"
        cy="34"
        rx="4"
        ry="16"
        fill="#fff"
        opacity="0.22"
        transform="rotate(-12 42 34)"
      />
      <ellipse cx="60" cy="40" rx="2.5" ry="11" fill="#fff" opacity="0.12" transform="rotate(8 60 40)" />
      <ellipse cx="48" cy="22" rx="3" ry="5" fill="#fff" opacity="0.35" />
      {/* Veins */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 36 + i * 4.5 + (rnd(seed, i) - 0.5) * 1.5;
        return (
          <path
            key={i}
            d={`M${x} 22 Q${x + (50 - x) * 0.1} 50 ${x + (50 - x) * 0.05} 78`}
            stroke={darken(color, 0.32)}
            strokeWidth="0.22"
            opacity="0.3"
            fill="none"
          />
        );
      })}
      {/* Bottom dark shadow */}
      <ellipse cx="50" cy="78" rx="22" ry="3" fill={darken(color, 0.4)} opacity="0.3" />
    </g>
  );
}

/* === DAISY === */
function Daisy({ color, accentColor, uid, seed }: Inner) {
  const petals = 20;
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back larger petals — darker, behind */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360 + 9;
        return (
          <g key={`b${i}`} transform={`rotate(${angle} 50 50)`}>
            <ellipse
              cx="50"
              cy="22"
              rx="5"
              ry="23"
              fill={tint(color, accentColor, 0.06)}
              opacity="0.75"
            />
          </g>
        );
      })}
      {/* Front petals with variation */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360;
        const wob = (rnd(seed, i) - 0.5) * 8;
        const rx = 5 + rnd(seed, i + 17) * 2;
        const ry = 20 + rnd(seed, i + 23) * 5;
        const cy = 22 - rnd(seed, i + 31) * 1.5;
        const petalColor = shift(color, (rnd(seed, i + 41) - 0.5) * 4);
        return (
          <g key={i} transform={`rotate(${angle + wob} 50 50)`}>
            <ellipse cx="50" cy={cy} rx={rx} ry={ry} fill={`url(#${uid}-petal-a)`} />
            {/* Petal vein */}
            <path
              d={`M50 ${cy - ry * 0.7} L50 ${cy + ry * 0.85}`}
              stroke={darken(petalColor, 0.25)}
              strokeWidth="0.28"
              opacity="0.35"
            />
            {/* Side veins */}
            <path
              d={`M50 ${cy} Q47 ${cy - ry * 0.3} 46 ${cy - ry * 0.5}`}
              stroke={darken(petalColor, 0.25)}
              strokeWidth="0.15"
              opacity="0.25"
              fill="none"
            />
            <path
              d={`M50 ${cy} Q53 ${cy - ry * 0.3} 54 ${cy - ry * 0.5}`}
              stroke={darken(petalColor, 0.25)}
              strokeWidth="0.15"
              opacity="0.25"
              fill="none"
            />
            {/* Faint shadow at base */}
            <ellipse cx="50" cy={cy + ry * 0.8} rx="2.6" ry="3.6" fill={darken(color, 0.25)} opacity="0.2" />
            {/* Tip highlight */}
            <ellipse cx="50" cy={cy - ry * 0.5} rx="2" ry="3" fill="#fff" opacity="0.32" />
          </g>
        );
      })}
      {/* Disc center with depth */}
      <circle cx="50" cy="50" r="13" fill={`url(#${uid}-center)`} />
      {/* Pollen florets in Fibonacci spiral */}
      {Array.from({ length: 42 }).map((_, i) => {
        const r = 1.2 + Math.sqrt(i) * 1.7;
        const angle = i * 137.5 * (Math.PI / 180);
        if (r > 12) return null;
        return (
          <circle
            key={i}
            cx={rnd3(50 + Math.cos(angle) * r)}
            cy={rnd3(50 + Math.sin(angle) * r)}
            r="0.65"
            fill={darken(accentColor, 0.3)}
            opacity={0.65 + (i % 3) * 0.15}
          />
        );
      })}
      {/* Center inner shadow */}
      <ellipse cx="50" cy="51" rx="8" ry="6" fill={darken(accentColor, 0.4)} opacity="0.35" />
      {/* Center highlight */}
      <ellipse cx="47" cy="46" rx="2.5" ry="2" fill="#fff" opacity="0.25" />
      {/* Rim shadow */}
      <circle cx="50" cy="50" r="13" fill="none" stroke={darken(accentColor, 0.4)} strokeWidth="0.4" opacity="0.5" />
    </g>
  );
}

/* === SUNFLOWER === */
function Sunflower({ color, accentColor, uid, seed }: Inner) {
  const outer = 32;
  const inner = 26;
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back layer petals */}
      {Array.from({ length: outer }).map((_, i) => {
        const angle = (i / outer) * 360 + 6;
        return (
          <g key={`b${i}`} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M50 50 Q47 28 50 7 Q53 28 50 50 Z"
              fill={darken(color, 0.18)}
              opacity="0.85"
            />
          </g>
        );
      })}
      {/* Front petals with serration */}
      {Array.from({ length: inner }).map((_, i) => {
        const angle = (i / inner) * 360;
        const len = 22 + rnd(seed, i) * 5;
        const wob = (rnd(seed, i + 11) - 0.5) * 6;
        const petalColor = shift(color, (rnd(seed, i + 41) - 0.5) * 4);
        return (
          <g key={i} transform={`rotate(${angle + wob} 50 50)`}>
            <path
              d={`M50 50 Q46 ${50 - len * 0.5} 48 ${50 - len * 0.9} Q50 ${50 - len} 52 ${50 - len * 0.9} Q54 ${50 - len * 0.5} 50 50 Z`}
              fill={`url(#${uid}-petal-a)`}
            />
            {/* Center vein */}
            <path
              d={`M50 ${50 - len * 0.85} L50 50`}
              stroke={darken(petalColor, 0.25)}
              strokeWidth="0.3"
              opacity="0.45"
            />
            {/* Petal edge highlight */}
            <path
              d={`M50 ${50 - len * 0.85} Q51.5 ${50 - len * 0.5} 50 50`}
              stroke="#fff"
              strokeWidth="0.15"
              opacity="0.3"
              fill="none"
            />
          </g>
        );
      })}
      {/* Brown disc */}
      <circle cx="50" cy="50" r="16" fill={`url(#${uid}-center)`} />
      {/* Disc rim */}
      <circle cx="50" cy="50" r="16" fill="none" stroke={darken(accentColor, 0.5)} strokeWidth="0.5" opacity="0.5" />
      {/* Seed pattern Fibonacci */}
      {Array.from({ length: 120 }).map((_, i) => {
        const r = 0.4 + Math.sqrt(i) * 1.55;
        const angle = i * 137.5 * (Math.PI / 180);
        if (r > 15) return null;
        const cx = rnd3(50 + Math.cos(angle) * r);
        const cy = rnd3(50 + Math.sin(angle) * r);
        const rotDeg = rnd3((angle * 180) / Math.PI);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="0.6"
            ry="0.9"
            fill={darken(accentColor, 0.45)}
            opacity={0.55 + (i % 3) * 0.15}
            transform={`rotate(${rotDeg} ${cx} ${cy})`}
          />
        );
      })}
      {/* Specular on disc */}
      <ellipse cx="47" cy="46" rx="3.5" ry="2.5" fill="#fff" opacity="0.22" />
      {/* Inner shadow rim */}
      <circle cx="50" cy="50" r="15" fill="none" stroke={darken(accentColor, 0.7)} strokeWidth="1" opacity="0.18" />
    </g>
  );
}

/* === LILY === */
function Lily({ color, accentColor, uid, seed }: Inner) {
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Outer 3 petals */}
      {[30, 150, 270].map((a, i) => (
        <g key={`o${i}`} transform={`rotate(${a + (rnd(seed, i) - 0.5) * 6} 50 50)`}>
          <path
            d="M50 50 Q36 28 44 6 Q50 -2 56 6 Q64 28 50 50 Z"
            fill={`url(#${uid}-petal-c)`}
          />
          <path
            d="M50 6 L50 48"
            stroke={darken(color, 0.28)}
            strokeWidth="0.4"
            opacity="0.4"
          />
          <ellipse cx="46" cy="22" rx="1.5" ry="8" fill="#fff" opacity="0.3" transform="rotate(-3 46 22)" />
        </g>
      ))}
      {/* Inner 3 petals */}
      {[0, 120, 240].map((a, i) => (
        <g key={`f${i}`} transform={`rotate(${a + (rnd(seed, i + 7) - 0.5) * 6} 50 50)`}>
          <path
            d="M50 50 Q34 26 44 4 Q50 -3 56 4 Q66 26 50 50 Z"
            fill={`url(#${uid}-petal-a)`}
          />
          <path
            d="M50 4 L50 48"
            stroke={darken(color, 0.25)}
            strokeWidth="0.5"
            opacity="0.45"
          />
          <ellipse cx="46" cy="18" rx="2" ry="10" fill="#fff" opacity="0.4" transform="rotate(-4 46 18)" />
          {/* Speckles */}
          {[10, 18, 26, 34].map((y) => (
            <circle
              key={y}
              cx={50 + (rnd(seed, y + i * 7) - 0.5) * 8}
              cy={y}
              r="0.6"
              fill={darken(accentColor, 0.3)}
              opacity="0.65"
            />
          ))}
        </g>
      ))}
      {/* Throat */}
      <circle cx="50" cy="50" r="9" fill={darken(accentColor, 0.35)} opacity="0.6" />
      <ellipse cx="50" cy="51" rx="6" ry="5" fill={darken(accentColor, 0.55)} opacity="0.45" />
      {/* Stamens */}
      {[-14, -5, 5, 14].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2={50 + (i - 1.5) * 1.4}
            y2="36"
            stroke={lighten(accentColor, 0.15)}
            strokeWidth="0.6"
          />
          <ellipse
            cx={50 + (i - 1.5) * 1.4}
            cy="35"
            rx="1.4"
            ry="2.6"
            fill={accentColor}
          />
          {/* Anther highlight */}
          <ellipse
            cx={49.5 + (i - 1.5) * 1.4}
            cy="34.2"
            rx="0.5"
            ry="0.8"
            fill="#fff"
            opacity="0.4"
          />
        </g>
      ))}
      {/* Pistil */}
      <line x1="50" y1="50" x2="50" y2="32" stroke={lighten(accentColor, 0.2)} strokeWidth="0.7" />
      <circle cx="50" cy="31" r="1.6" fill={lighten(accentColor, 0.15)} />
      <circle cx="49.6" cy="30.6" r="0.5" fill="#fff" opacity="0.5" />
    </g>
  );
}

/* === PEONY — many ruffled petals === */
function Peony({ color, accentColor, uid, seed }: Inner) {
  const layers = [
    { count: 16, ringR: 35, petalSize: 26, gradient: "b" },
    { count: 14, ringR: 27, petalSize: 22, gradient: "a" },
    { count: 12, ringR: 20, petalSize: 18, gradient: "a" },
    { count: 11, ringR: 14, petalSize: 15, gradient: "c" },
    { count: 9, ringR: 8, petalSize: 12, gradient: "c" },
    { count: 6, ringR: 3, petalSize: 9, gradient: "dark" },
  ];
  const hlId = `${uid}-hl`;
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {layers.flatMap((layer, lI) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const baseAngle = (i / layer.count) * 360 + lI * 11;
          const wobble = (rnd(seed, lI * 7 + i) - 0.5) * 14;
          const angle = baseAngle + wobble;
          const rad = (angle * Math.PI) / 180;
          const offsetMag = layer.ringR * (0.82 + rnd(seed, lI * 11 + i) * 0.34);
          const cx = 50 + Math.cos(rad) * offsetMag;
          const cy = 50 + Math.sin(rad) * offsetMag;
          const sizeJitter = layer.petalSize * (0.85 + rnd(seed, lI * 13 + i) * 0.26);
          const rot = angle + 90 + (rnd(seed, lI * 17 + i) - 0.5) * 28;
          return (
            <g
              key={`${lI}-${i}`}
              transform={`translate(${rnd3(cx)} ${rnd3(cy)}) rotate(${rnd3(rot)}) scale(${rnd3(sizeJitter)})`}
            >
              <path
                d="M0 0 Q-1.2 -0.3 -1.1 -0.65 Q-0.92 -0.97 -0.22 -1.02 Q0.22 -1.04 0.4 -1 Q1.1 -0.92 1.18 -0.6 Q1.08 -0.22 0 0 Z"
                fill={`url(#${uid}-petal-${layer.gradient})`}
                stroke={darken(color, 0.15)}
                strokeWidth="0.018"
                strokeOpacity="0.35"
              />
              {/* Edge curl shadow */}
              <path
                d="M-1.1 -0.65 Q-0.92 -0.97 -0.22 -1.02"
                fill="none"
                stroke="#000"
                strokeOpacity="0.18"
                strokeWidth="0.025"
              />
              {/* Highlight */}
              {lI < 3 && (
                <ellipse
                  cx="-0.05"
                  cy="-0.55"
                  rx="0.32"
                  ry="0.38"
                  fill={`url(#${hlId})`}
                  opacity="0.5"
                />
              )}
              {lI < 2 && (
                <ellipse
                  cx="0.1"
                  cy="-0.78"
                  rx="0.12"
                  ry="0.16"
                  fill="#fff"
                  opacity="0.5"
                />
              )}
            </g>
          );
        }),
      )}
      {/* Center */}
      <circle cx="50" cy="50" r="3.8" fill={darken(color, 0.4)} />
      <circle cx="49.5" cy="49.5" r="1.6" fill={lighten(accentColor, 0.2)} opacity="0.5" />
      {/* Tiny stamens */}
      {[-30, 0, 30].map((a, i) => (
        <ellipse
          key={i}
          cx={rnd3(50 + Math.cos((a * Math.PI) / 180) * 2)}
          cy={rnd3(50 + Math.sin((a * Math.PI) / 180) * 2)}
          rx="0.4"
          ry="0.8"
          fill={accentColor}
          opacity="0.7"
        />
      ))}
    </g>
  );
}

/* === HYDRANGEA === */
function Hydrangea({ color, accentColor, uid, seed }: Inner) {
  const florets: [number, number, number][] = [
    [50, 20, 1],
    [30, 30, 0.95],
    [70, 30, 1],
    [22, 44, 0.9],
    [50, 42, 1.1],
    [78, 44, 0.9],
    [16, 58, 0.85],
    [38, 56, 1],
    [62, 56, 1],
    [84, 58, 0.85],
    [28, 70, 0.95],
    [50, 68, 1.05],
    [72, 70, 0.95],
    [40, 82, 0.9],
    [60, 82, 0.9],
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {florets.map(([cx, cy, scale], i) => {
        const variant = i % 4 === 0 ? "c" : i % 3 === 0 ? "b" : "a";
        const tilt = (rnd(seed, i) - 0.5) * 40;
        const petalShade = (rnd(seed, i + 17) - 0.5) * 8;
        return (
          <g
            key={i}
            transform={`translate(${rnd3(cx)} ${rnd3(cy)}) scale(${rnd3(scale)}) rotate(${rnd3(tilt)})`}
          >
            {/* 4 heart-shaped petals */}
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path
                  d="M0 0 Q-2 -2 -3 -5 Q-2 -8 0 -7 Q2 -8 3 -5 Q2 -2 0 0 Z"
                  fill={`url(#${uid}-petal-${variant})`}
                  stroke={darken(shift(color, petalShade), 0.25)}
                  strokeWidth="0.1"
                  strokeOpacity="0.5"
                />
                <ellipse cx="-0.5" cy="-5.5" rx="0.6" ry="1.2" fill="#fff" opacity="0.45" />
              </g>
            ))}
            <circle r="0.8" fill={darken(accentColor, 0.25)} />
            <circle r="0.35" fill={lighten(accentColor, 0.3)} opacity="0.75" />
          </g>
        );
      })}
    </g>
  );
}

/* === LAVENDER === */
function Lavender({ color, accentColor, uid, seed }: Inner) {
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Stem */}
      <path
        d="M50 94 Q49 60 51 28 L50 12"
        stroke="#4a5d3f"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 94 Q49 60 51 28 L50 12"
        stroke="#9aaf8e"
        strokeWidth="0.5"
        fill="none"
        opacity="0.7"
      />
      <path d="M50 70 Q42 67 38 60" stroke="#4a5d3f" strokeWidth="0.9" fill="none" />
      <path d="M50 80 Q56 78 60 72" stroke="#4a5d3f" strokeWidth="0.9" fill="none" />
      {/* Buds — denser, with more layers */}
      {Array.from({ length: 22 }).map((_, i) => {
        const y = 14 + i * 2.8;
        const xOff = i % 2 === 0 ? -4.5 : 4.5;
        const r = 2.8 - i * 0.05;
        const tone =
          i % 4 === 0
            ? darken(color, 0.2)
            : i % 3 === 0
              ? lighten(color, 0.18)
              : shift(color, (rnd(seed, i) - 0.5) * 4);
        const wobble = (rnd(seed, i) - 0.5) * 2;
        return (
          <g key={i}>
            <ellipse
              cx={50 + xOff + wobble}
              cy={y}
              rx={r * 0.85}
              ry={r * 1.25}
              fill={tone}
            />
            <ellipse
              cx={50 + xOff + wobble - r * 0.3}
              cy={y - r * 0.3}
              rx={r * 0.25}
              ry={r * 0.4}
              fill="#fff"
              opacity="0.35"
            />
          </g>
        );
      })}
      <ellipse cx="50" cy="9" rx="2.4" ry="3.4" fill={`url(#${uid}-petal-b)`} />
    </g>
  );
}

/* === EUCALYPTUS === */
function Eucalyptus({ color, accentColor, uid, seed }: Inner) {
  const leaves: [number, number, number, number][] = [
    [40, 84, -22, 1.0],
    [60, 78, 22, 1.0],
    [37, 67, -25, 0.95],
    [63, 60, 25, 0.95],
    [40, 50, -22, 0.9],
    [60, 44, 22, 0.9],
    [44, 34, -16, 0.85],
    [56, 28, 16, 0.85],
    [48, 20, -8, 0.8],
    [52, 14, 8, 0.78],
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      <path
        d="M50 96 Q48 72 52 42 Q54 24 50 10"
        stroke="#4a5d3f"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 96 Q48 72 52 42 Q54 24 50 10"
        stroke="#a8bd9c"
        strokeWidth="0.5"
        fill="none"
        opacity="0.7"
      />
      {leaves.map(([cx, cy, rot, sc], i) => {
        const sizeJitter = sc * (0.92 + rnd(seed, i) * 0.16);
        return (
          <g
            key={i}
            transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${sizeJitter})`}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry="6"
              fill={`url(#${uid}-petal-${i % 2 === 0 ? "a" : "b"})`}
            />
            <path
              d="M-9 0 L9 0"
              stroke={darken(color, 0.32)}
              strokeWidth="0.4"
              opacity="0.6"
            />
            <path
              d="M-6 0 Q-5 -1 -3 -2 M-3 0 Q-2 -1 0 -2.5 M3 0 Q4 -1 6 -2 M-6 0 Q-5 1 -3 2 M-3 0 Q-2 1 0 2.5 M3 0 Q4 1 6 2"
              stroke={darken(color, 0.28)}
              strokeWidth="0.2"
              opacity="0.4"
              fill="none"
            />
            <ellipse cx="-1.5" cy="-2.2" rx="4" ry="1.4" fill="#fff" opacity="0.25" />
            <ellipse cx="1" cy="2" rx="3" ry="1" fill="#000" opacity="0.08" />
          </g>
        );
      })}
    </g>
  );
}

/* === BABY'S BREATH === */
function BabysBreath({ color, accentColor, uid, seed }: Inner) {
  const positions: [number, number, number][] = [
    [50, 16, 3.2],
    [32, 24, 2.6],
    [68, 26, 3],
    [22, 38, 2.4],
    [50, 34, 3.4],
    [76, 38, 2.8],
    [16, 48, 2.2],
    [38, 46, 2.8],
    [62, 48, 2.6],
    [82, 50, 2.2],
    [28, 60, 2.8],
    [50, 56, 3.2],
    [72, 60, 2.6],
    [38, 70, 2.8],
    [62, 70, 2.6],
    [50, 82, 2.8],
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Tiny twig stems behind */}
      {positions.map(([cx, cy], i) => (
        <path
          key={`s${i}`}
          d={`M50 90 Q${(50 + cx) / 2} ${(90 + cy) / 2} ${cx} ${cy}`}
          stroke="#8aa178"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      ))}
      {positions.map(([cx, cy, r], i) => {
        const tilt = (rnd(seed, i) - 0.5) * 60;
        return (
          <g
            key={i}
            transform={`translate(${cx} ${cy}) scale(${r * 0.4}) rotate(${tilt})`}
          >
            {/* 5-petal bloom */}
            {[0, 72, 144, 216, 288].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <ellipse
                  cx="0"
                  cy="-1.2"
                  rx="0.85"
                  ry="1.35"
                  fill={`url(#${uid}-petal-a)`}
                  stroke={darken(color, 0.18)}
                  strokeWidth="0.05"
                  strokeOpacity="0.5"
                />
                <ellipse cx="-0.15" cy="-1.4" rx="0.2" ry="0.4" fill="#fff" opacity="0.5" />
              </g>
            ))}
            <circle r="0.45" fill={accentColor} />
          </g>
        );
      })}
    </g>
  );
}
