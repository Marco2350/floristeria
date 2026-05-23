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

// Deterministic pseudo-random from seed+index — rounded to 3 decimals
function rnd(seed: number, i: number) {
  const x = Math.sin((seed + i + 1) * 9173.137) * 10000;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
}

// Round number to 3 decimal places (avoid hydration float drift)
function rnd3(n: number) {
  return Math.round(n * 1000) / 1000;
}
// Build a transform string with rounded coordinates
function tr(
  tx?: number,
  ty?: number,
  rot?: number,
  scale?: number,
  rotCenter?: [number, number],
) {
  const parts: string[] = [];
  if (tx !== undefined && ty !== undefined) parts.push(`translate(${rnd3(tx)} ${rnd3(ty)})`);
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
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" />
        <feOffset dx="0" dy="2" result="ob" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.35" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <radialGradient id={`${uid}-petal-a`} cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor={lighten(color, 0.32)} />
        <stop offset="35%" stopColor={lighten(color, 0.12)} />
        <stop offset="70%" stopColor={color} />
        <stop offset="100%" stopColor={darken(color, 0.18)} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-b`} cx="50%" cy="25%" r="80%">
        <stop offset="0%" stopColor={lighten(color, 0.42)} />
        <stop offset="40%" stopColor={lighten(color, 0.18)} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-c`} cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor={lighten(color, 0.22)} />
        <stop offset="60%" stopColor={darken(color, 0.05)} />
        <stop offset="100%" stopColor={darken(color, 0.22)} />
      </radialGradient>
      <radialGradient id={`${uid}-petal-dark`} cx="50%" cy="20%" r="90%">
        <stop offset="0%" stopColor={darken(color, 0.05)} />
        <stop offset="100%" stopColor={darken(color, 0.35)} />
      </radialGradient>

      <radialGradient id={`${uid}-hl`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}-center`} cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor={lighten(accentColor, 0.3)} />
        <stop offset="60%" stopColor={accentColor} />
        <stop offset="100%" stopColor={darken(accentColor, 0.28)} />
      </radialGradient>

      <linearGradient id={`${uid}-stem`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#3b4d2d" />
        <stop offset="50%" stopColor="#7a8f6a" />
        <stop offset="100%" stopColor="#3b4d2d" />
      </linearGradient>
    </defs>
  );
}

/* Generic petal shape (pointed teardrop, drawn from base 0,0 pointing up to 0,-1) */
const PETAL_PATH =
  "M0 0 Q-1 -0.25 -0.95 -0.55 Q-0.7 -0.95 -0.1 -1 L0 -1 Q0.6 -0.95 0.85 -0.6 Q1 -0.3 0 0 Z";

function Petal({
  cx,
  cy,
  size,
  rot,
  fill,
  veinColor,
  hlId,
  highlight = true,
  veins = true,
  edge,
}: {
  cx: number;
  cy: number;
  size: number;
  rot: number;
  fill: string;
  veinColor?: string;
  hlId: string;
  highlight?: boolean;
  veins?: boolean;
  edge?: string;
}) {
  return (
    <g transform={tr(cx, cy, rot, size)}>
      <path
        d={PETAL_PATH}
        fill={fill}
        stroke={edge}
        strokeWidth={edge ? 0.02 : 0}
        strokeOpacity={0.4}
      />
      {veins && veinColor && (
        <>
          <path
            d="M0 -0.05 Q0 -0.5 0 -0.95"
            stroke={veinColor}
            strokeWidth="0.012"
            strokeOpacity="0.35"
            fill="none"
          />
          <path
            d="M0 -0.3 Q-0.25 -0.5 -0.4 -0.65"
            stroke={veinColor}
            strokeWidth="0.008"
            strokeOpacity="0.25"
            fill="none"
          />
          <path
            d="M0 -0.3 Q0.25 -0.5 0.4 -0.65"
            stroke={veinColor}
            strokeWidth="0.008"
            strokeOpacity="0.25"
            fill="none"
          />
        </>
      )}
      {highlight && (
        <ellipse
          cx="0"
          cy="-0.55"
          rx="0.22"
          ry="0.32"
          fill={`url(#${hlId})`}
          opacity="0.6"
        />
      )}
    </g>
  );
}

/* === ROSE === */
function Rose({ color, accentColor, uid, seed }: Inner) {
  const layers = [
    { count: 7, ringR: 30, petalSize: 28, gradient: "a", rotShift: 0 },
    { count: 7, ringR: 20, petalSize: 22, gradient: "a", rotShift: 25 },
    { count: 6, ringR: 12, petalSize: 17, gradient: "b", rotShift: 50 },
    { count: 5, ringR: 6, petalSize: 13, gradient: "c", rotShift: 15 },
    { count: 3, ringR: 0, petalSize: 9, gradient: "dark", rotShift: 60 },
  ];
  const hlId = `${uid}-hl`;

  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {layers.flatMap((layer, lI) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const baseAngle = (i / layer.count) * 360 + layer.rotShift;
          const wobble = (rnd(seed, lI * 7 + i) - 0.5) * 10;
          const angle = baseAngle + wobble;
          const rad = (angle * Math.PI) / 180;
          const offsetMag = layer.ringR * (0.85 + rnd(seed, lI * 11 + i) * 0.3);
          const cx = 50 + Math.cos(rad) * offsetMag;
          const cy = 50 + Math.sin(rad) * offsetMag;
          const sizeJitter = layer.petalSize * (0.92 + rnd(seed, lI * 13 + i) * 0.16);
          const rot = angle + 90 + (rnd(seed, lI * 17 + i) - 0.5) * 15;
          return (
            <Petal
              key={`${lI}-${i}`}
              cx={cx}
              cy={cy}
              size={sizeJitter}
              rot={rot}
              fill={`url(#${uid}-petal-${layer.gradient})`}
              veinColor={darken(color, 0.25)}
              edge={darken(color, 0.18)}
              hlId={hlId}
              highlight={lI < 3}
              veins={lI < 2}
            />
          );
        }),
      )}
      <circle cx="50" cy="50" r="3" fill={darken(color, 0.4)} />
      <ellipse cx="49.5" cy="48.5" rx="1.4" ry="0.8" fill={lighten(color, 0.2)} opacity="0.5" />
    </g>
  );
}

/* === TULIP === */
function Tulip({ color, accentColor, uid, seed }: Inner) {
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back petals */}
      <path
        d="M50 82 Q14 60 22 28 Q30 14 50 14 Q70 14 78 28 Q86 60 50 82 Z"
        fill={`url(#${uid}-petal-c)`}
      />
      {/* Mid petals — three visible cup petals */}
      <path
        d="M50 82 Q26 60 30 32 Q34 18 50 18 Q66 18 70 32 Q74 60 50 82 Z"
        fill={`url(#${uid}-petal-a)`}
      />
      {/* Front center petal */}
      <path
        d="M50 82 Q40 60 42 26 Q46 18 50 18 Q54 18 58 26 Q60 60 50 82 Z"
        fill={`url(#${uid}-petal-b)`}
      />
      {/* Left side petal seam */}
      <path
        d="M37 32 Q33 50 38 72"
        stroke={darken(color, 0.25)}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M63 32 Q67 50 62 72"
        stroke={darken(color, 0.25)}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      {/* Specular highlight */}
      <ellipse
        cx="42"
        cy="36"
        rx="4"
        ry="14"
        fill="#fff"
        opacity="0.18"
        transform="rotate(-12 42 36)"
      />
      <ellipse
        cx="58"
        cy="42"
        rx="2.5"
        ry="10"
        fill="#fff"
        opacity="0.1"
        transform="rotate(8 58 42)"
      />
      {/* Veins */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 38 + i * 6 + rnd(seed, i) * 1;
        return (
          <path
            key={i}
            d={`M${x} 22 Q${x + (50 - x) * 0.1} 50 ${x + (50 - x) * 0.05} 78`}
            stroke={darken(color, 0.3)}
            strokeWidth="0.25"
            opacity="0.25"
            fill="none"
          />
        );
      })}
    </g>
  );
}

/* === DAISY === */
function Daisy({ color, accentColor, uid, seed }: Inner) {
  const petals = 16;
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back layer slightly larger and darker */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360 + 11;
        return (
          <g key={`b${i}`} transform={`rotate(${angle} 50 50)`}>
            <ellipse
              cx="50"
              cy="22"
              rx="5.5"
              ry="22"
              fill={tint(color, accentColor, 0.08)}
              opacity="0.7"
            />
          </g>
        );
      })}
      {/* Front petals with slight variation */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360;
        const wob = (rnd(seed, i) - 0.5) * 6;
        const rx = 5.5 + rnd(seed, i + 17) * 1.5;
        const ry = 19 + rnd(seed, i + 23) * 4;
        return (
          <g key={i} transform={`rotate(${angle + wob} 50 50)`}>
            <ellipse cx="50" cy="22" rx={rx} ry={ry} fill={`url(#${uid}-petal-a)`} />
            {/* Petal vein */}
            <path
              d="M50 8 L50 41"
              stroke={darken(color, 0.2)}
              strokeWidth="0.25"
              opacity="0.3"
            />
            {/* Faint shadow at base */}
            <ellipse cx="50" cy="38" rx="3" ry="4" fill={darken(color, 0.2)} opacity="0.18" />
          </g>
        );
      })}
      {/* Center disc */}
      <circle cx="50" cy="50" r="12" fill={`url(#${uid}-center)`} />
      {/* Pollen florets (tiny dots in spiral) */}
      {Array.from({ length: 30 }).map((_, i) => {
        const r = 1.5 + Math.sqrt(i) * 1.6;
        const angle = i * 137.5 * (Math.PI / 180);
        if (r > 11) return null;
        return (
          <circle
            key={i}
            cx={50 + Math.cos(angle) * r}
            cy={50 + Math.sin(angle) * r}
            r="0.7"
            fill={darken(accentColor, 0.3)}
            opacity="0.8"
          />
        );
      })}
      {/* Center rim shadow */}
      <circle cx="50" cy="50" r="12" fill="none" stroke={darken(accentColor, 0.4)} strokeWidth="0.4" opacity="0.4" />
    </g>
  );
}

/* === SUNFLOWER === */
function Sunflower({ color, accentColor, uid, seed }: Inner) {
  const outer = 28;
  const inner = 24;
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Back layer */}
      {Array.from({ length: outer }).map((_, i) => {
        const angle = (i / outer) * 360 + 7;
        return (
          <g key={`b${i}`} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M50 50 Q47 28 50 8 Q53 28 50 50 Z"
              fill={darken(color, 0.15)}
              opacity="0.85"
            />
          </g>
        );
      })}
      {/* Front petals with serration suggestion */}
      {Array.from({ length: inner }).map((_, i) => {
        const angle = (i / inner) * 360;
        const len = 22 + rnd(seed, i) * 4;
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <path
              d={`M50 50 Q46 ${50 - len * 0.5} 48 ${50 - len * 0.9} Q50 ${50 - len} 52 ${50 - len * 0.9} Q54 ${50 - len * 0.5} 50 50 Z`}
              fill={`url(#${uid}-petal-a)`}
            />
            <path
              d={`M50 ${50 - len * 0.85} L50 50`}
              stroke={darken(color, 0.2)}
              strokeWidth="0.3"
              opacity="0.45"
            />
          </g>
        );
      })}
      {/* Brown disc */}
      <circle cx="50" cy="50" r="15" fill={`url(#${uid}-center)`} />
      <circle cx="50" cy="50" r="15" fill="none" stroke={darken(accentColor, 0.5)} strokeWidth="0.5" opacity="0.45" />
      {/* Seed pattern (Fibonacci spiral) */}
      {Array.from({ length: 80 }).map((_, i) => {
        const r = 0.6 + Math.sqrt(i) * 1.55;
        const angle = i * 137.5 * (Math.PI / 180);
        if (r > 14) return null;
        const cx = 50 + Math.cos(angle) * r;
        const cy = 50 + Math.sin(angle) * r;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="0.65"
            ry="0.95"
            fill={darken(accentColor, 0.45)}
            opacity={0.55 + (i % 3) * 0.15}
            transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
          />
        );
      })}
      {/* Specular on disc */}
      <ellipse cx="47" cy="46" rx="3" ry="2" fill="#fff" opacity="0.18" />
    </g>
  );
}

/* === LILY === */
function Lily({ color, accentColor, uid, seed }: Inner) {
  // 6 elongated petals (3 outer, 3 inner)
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Outer 3 petals (60°/180°/300°) */}
      {[30, 150, 270].map((a, i) => (
        <g key={`o${i}`} transform={`rotate(${a + (rnd(seed, i) - 0.5) * 6} 50 50)`}>
          <path
            d="M50 50 Q36 28 44 6 Q50 -2 56 6 Q64 28 50 50 Z"
            fill={`url(#${uid}-petal-c)`}
          />
          {/* Vein */}
          <path
            d="M50 6 L50 48"
            stroke={darken(color, 0.25)}
            strokeWidth="0.4"
            opacity="0.35"
          />
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
            stroke={darken(color, 0.2)}
            strokeWidth="0.45"
            opacity="0.35"
          />
          {/* Speckles */}
          {[12, 22, 32].map((y) => (
            <circle
              key={y}
              cx={50 + (rnd(seed, y) - 0.5) * 6}
              cy={y}
              r="0.5"
              fill={darken(accentColor, 0.2)}
              opacity="0.6"
            />
          ))}
        </g>
      ))}
      {/* Throat shadow */}
      <circle cx="50" cy="50" r="9" fill={darken(accentColor, 0.3)} opacity="0.55" />
      <ellipse cx="50" cy="51" rx="6" ry="5" fill={darken(accentColor, 0.5)} opacity="0.4" />
      {/* Stamens (6) with anthers */}
      {[-12, -4, 4, 12].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2={50 + (i - 1.5) * 1.2}
            y2="38"
            stroke={lighten(accentColor, 0.1)}
            strokeWidth="0.5"
          />
          <ellipse
            cx={50 + (i - 1.5) * 1.2}
            cy="37"
            rx="1.2"
            ry="2.2"
            fill={accentColor}
          />
        </g>
      ))}
      {/* Pistil — central */}
      <line x1="50" y1="50" x2="50" y2="34" stroke={lighten(accentColor, 0.15)} strokeWidth="0.6" />
      <circle cx="50" cy="33" r="1.4" fill={lighten(accentColor, 0.1)} />
    </g>
  );
}

/* === PEONY === */
function Peony({ color, accentColor, uid, seed }: Inner) {
  // Many ruffled overlapping petals
  const layers = [
    { count: 12, ringR: 32, petalSize: 22, gradient: "b" },
    { count: 12, ringR: 24, petalSize: 18, gradient: "a" },
    { count: 10, ringR: 16, petalSize: 14, gradient: "a" },
    { count: 9, ringR: 8, petalSize: 11, gradient: "c" },
    { count: 6, ringR: 2, petalSize: 8, gradient: "dark" },
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {layers.flatMap((layer, lI) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const baseAngle = (i / layer.count) * 360 + lI * 13;
          const wobble = (rnd(seed, lI * 7 + i) - 0.5) * 12;
          const angle = baseAngle + wobble;
          const rad = (angle * Math.PI) / 180;
          const offsetMag =
            layer.ringR * (0.85 + rnd(seed, lI * 11 + i) * 0.3);
          const cx = 50 + Math.cos(rad) * offsetMag;
          const cy = 50 + Math.sin(rad) * offsetMag;
          const sizeJitter =
            layer.petalSize * (0.88 + rnd(seed, lI * 13 + i) * 0.24);
          const rot = angle + 90 + (rnd(seed, lI * 17 + i) - 0.5) * 25;
          return (
            <g
              key={`${lI}-${i}`}
              transform={tr(cx, cy, rot, sizeJitter)}
            >
              {/* Ruffled petal — wider at base for fluffy look */}
              <path
                d="M0 0 Q-1.2 -0.3 -1.1 -0.6 Q-0.9 -0.95 -0.2 -1 Q0.2 -1.02 0.4 -0.98 Q1.1 -0.9 1.15 -0.55 Q1.05 -0.2 0 0 Z"
                fill={`url(#${uid}-petal-${layer.gradient})`}
                stroke={darken(color, 0.15)}
                strokeWidth="0.02"
                strokeOpacity="0.3"
              />
              {/* Highlight */}
              {lI < 3 && (
                <ellipse
                  cx="0"
                  cy="-0.5"
                  rx="0.3"
                  ry="0.35"
                  fill="#fff"
                  opacity="0.35"
                />
              )}
            </g>
          );
        }),
      )}
      {/* Center */}
      <circle cx="50" cy="50" r="3.5" fill={darken(color, 0.35)} />
      <circle cx="50" cy="50" r="1.6" fill={lighten(accentColor, 0.15)} opacity="0.6" />
    </g>
  );
}

/* === HYDRANGEA === */
function Hydrangea({ color, accentColor, uid, seed }: Inner) {
  // Cluster of 4-petal florets
  const florets: [number, number, number][] = [
    [50, 22, 1],
    [30, 32, 0.9],
    [70, 32, 0.95],
    [22, 48, 0.85],
    [50, 44, 1.1],
    [78, 48, 0.85],
    [36, 60, 1],
    [64, 60, 1],
    [26, 72, 0.9],
    [50, 70, 1.05],
    [74, 72, 0.9],
    [40, 82, 0.85],
    [60, 82, 0.85],
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {florets.map(([cx, cy, scale], i) => {
        const variant = i % 3 === 0 ? "c" : i % 2 === 0 ? "a" : "b";
        const tilt = (rnd(seed, i) - 0.5) * 30;
        return (
          <g
            key={i}
            transform={`translate(${rnd3(cx)} ${rnd3(cy)}) scale(${rnd3(scale)}) rotate(${rnd3(tilt)})`}
          >
            {/* 4 petals — slightly heart-shaped */}
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path
                  d="M0 0 Q-2 -2 -3 -5 Q-2 -8 0 -7 Q2 -8 3 -5 Q2 -2 0 0 Z"
                  fill={`url(#${uid}-petal-${variant})`}
                  stroke={darken(color, 0.2)}
                  strokeWidth="0.1"
                  strokeOpacity="0.4"
                />
              </g>
            ))}
            <circle r="0.8" fill={darken(accentColor, 0.2)} />
            <circle r="0.3" fill={lighten(accentColor, 0.3)} opacity="0.7" />
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
        stroke="#7a8f6a"
        strokeWidth="0.5"
        fill="none"
        opacity="0.7"
      />
      {/* Tiny leaves at the stem */}
      <path d="M50 70 Q42 67 38 60" stroke="#4a5d3f" strokeWidth="0.8" fill="none" />
      <path d="M50 80 Q56 78 60 72" stroke="#4a5d3f" strokeWidth="0.8" fill="none" />

      {/* Buds — paired and alternating with multi-tone */}
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 14 + i * 3.2;
        const xOff = i % 2 === 0 ? -4.5 : 4.5;
        const r = 2.8 - i * 0.06;
        const tone =
          i % 4 === 0
            ? darken(color, 0.18)
            : i % 3 === 0
              ? lighten(color, 0.15)
              : color;
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
              opacity="0.3"
            />
          </g>
        );
      })}
      {/* Top */}
      <ellipse cx="50" cy="9" rx="2.4" ry="3.4" fill={`url(#${uid}-petal-b)`} />
    </g>
  );
}

/* === EUCALYPTUS === */
function Eucalyptus({ color, accentColor, uid, seed }: Inner) {
  const leaves: [number, number, number, number][] = [
    // x, y, rotation, scale
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
      {/* Stem */}
      <path
        d="M50 96 Q48 72 52 42 Q54 24 50 10"
        stroke="#4a5d3f"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 96 Q48 72 52 42 Q54 24 50 10"
        stroke="#9CAE93"
        strokeWidth="0.5"
        fill="none"
        opacity="0.7"
      />

      {leaves.map(([cx, cy, rot, sc], i) => {
        const sizeJitter = sc * (0.92 + rnd(seed, i) * 0.16);
        return (
          <g
            key={i}
            transform={`translate(${rnd3(cx)} ${rnd3(cy)}) rotate(${rnd3(rot)}) scale(${rnd3(sizeJitter)})`}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry="6"
              fill={`url(#${uid}-petal-${i % 2 === 0 ? "a" : "b"})`}
            />
            {/* Central vein */}
            <path
              d="M-9 0 L9 0"
              stroke={darken(color, 0.3)}
              strokeWidth="0.4"
              opacity="0.55"
            />
            {/* Side veins */}
            <path
              d="M-6 0 Q-5 -1 -3 -2 M-3 0 Q-2 -1 0 -2.5 M3 0 Q4 -1 6 -2 M-6 0 Q-5 1 -3 2 M-3 0 Q-2 1 0 2.5 M3 0 Q4 1 6 2"
              stroke={darken(color, 0.25)}
              strokeWidth="0.18"
              opacity="0.35"
              fill="none"
            />
            {/* Specular highlight */}
            <ellipse cx="-1" cy="-2" rx="4" ry="1.4" fill="#fff" opacity="0.18" />
          </g>
        );
      })}
    </g>
  );
}

/* === BABY'S BREATH === */
function BabysBreath({ color, accentColor, uid, seed }: Inner) {
  const positions: [number, number, number][] = [
    [50, 18, 3.4],
    [32, 28, 2.8],
    [68, 30, 3.2],
    [22, 42, 2.4],
    [50, 38, 3.6],
    [76, 42, 2.8],
    [38, 50, 3],
    [62, 52, 2.6],
    [28, 62, 2.4],
    [50, 60, 3.2],
    [72, 64, 2.4],
    [40, 72, 2.6],
    [60, 72, 2.6],
    [50, 84, 2.8],
  ];
  return (
    <g filter={`url(#${uid}-shadow)`}>
      <CommonDefs uid={uid} color={color} accentColor={accentColor} />
      {/* Tiny twig stems behind */}
      {positions.map(([cx, cy], i) => (
        <path
          key={`s${i}`}
          d={`M50 90 Q${(50 + cx) / 2} ${(90 + cy) / 2} ${cx} ${cy}`}
          stroke="#7a8f6a"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      ))}
      {positions.map(([cx, cy, r], i) => {
        const tilt = (rnd(seed, i) - 0.5) * 50;
        return (
          <g
            key={i}
            transform={`translate(${rnd3(cx)} ${rnd3(cy)}) scale(${rnd3(r * 0.4)}) rotate(${rnd3(tilt)})`}
          >
            {/* 5-petal bloom */}
            {[0, 72, 144, 216, 288].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <ellipse
                  cx="0"
                  cy="-1.2"
                  rx="0.8"
                  ry="1.3"
                  fill={`url(#${uid}-petal-a)`}
                  stroke={darken(color, 0.15)}
                  strokeWidth="0.05"
                  strokeOpacity="0.5"
                />
              </g>
            ))}
            <circle r="0.4" fill={accentColor} />
          </g>
        );
      })}
    </g>
  );
}
