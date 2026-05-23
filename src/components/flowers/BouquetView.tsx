"use client";

import { useMemo } from "react";
import { FlowerPaths } from "./Flower";
import { getFlower, getRibbon, getWrap } from "@/lib/data";

type Stem = { flowerId: string; qty: number };

type Props = {
  flowers: Stem[];
  wrapId?: string;
  ribbonId?: string;
  size?: number;
  showWrap?: boolean;
  className?: string;
};

type Placed = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flowerId: string;
  z: number;
  seed: number;
};

function rnd3(n: number) {
  return Math.round(n * 1000) / 1000;
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

export function BouquetView({
  flowers,
  wrapId,
  ribbonId,
  size = 360,
  showWrap = true,
  className,
}: Props) {
  const expanded: Placed[] = useMemo(() => {
    const stems: { flowerId: string }[] = [];
    flowers.forEach((s) => {
      for (let i = 0; i < s.qty; i++) stems.push({ flowerId: s.flowerId });
    });

    const layerWeight: Record<string, number> = {
      eucalyptus: 0,
      "babys-breath": 1,
      lavender: 2,
    };
    stems.sort((a, b) => {
      const fa = getFlower(a.flowerId);
      const fb = getFlower(b.flowerId);
      const wa = fa ? (layerWeight[fa.kind] ?? 3) : 3;
      const wb = fb ? (layerWeight[fb.kind] ?? 3) : 3;
      return wa - wb;
    });

    const total = stems.length;
    if (total === 0) return [];

    const placed: Placed[] = [];
    const rings: { count: number; r: number; scale: number }[] = [];
    if (total <= 3) {
      rings.push({ count: total, r: 0, scale: 1.05 });
    } else if (total <= 7) {
      rings.push({ count: 1, r: 0, scale: 1.05 });
      rings.push({ count: total - 1, r: 22, scale: 1 });
    } else if (total <= 14) {
      rings.push({ count: 1, r: 0, scale: 1.05 });
      rings.push({ count: 6, r: 22, scale: 1 });
      rings.push({ count: total - 7, r: 42, scale: 0.9 });
    } else if (total <= 24) {
      rings.push({ count: 1, r: 0, scale: 1.05 });
      rings.push({ count: 6, r: 20, scale: 1 });
      rings.push({ count: 10, r: 40, scale: 0.9 });
      rings.push({ count: total - 17, r: 58, scale: 0.8 });
    } else {
      rings.push({ count: 1, r: 0, scale: 1.05 });
      rings.push({ count: 6, r: 18, scale: 1 });
      rings.push({ count: 10, r: 36, scale: 0.9 });
      rings.push({ count: 14, r: 54, scale: 0.82 });
      rings.push({ count: Math.max(0, total - 31), r: 70, scale: 0.74 });
    }

    let idx = 0;
    rings.forEach((ring, ringIdx) => {
      const offsetAngle = ringIdx * 17;
      for (let i = 0; i < ring.count && idx < stems.length; i++) {
        const angle =
          ring.r === 0
            ? 0
            : ((i / ring.count) * 360 + offsetAngle) * (Math.PI / 180);
        const x = 100 + Math.cos(angle) * ring.r;
        const y = 100 + Math.sin(angle) * ring.r * 0.95;
        const jitter = ((idx * 37) % 11) - 5;
        const jitter2 = ((idx * 53) % 13) - 6;
        placed.push({
          x: x + jitter * 0.45,
          y: y + jitter2 * 0.45,
          scale: ring.scale + (((idx * 13) % 7) - 3) * 0.015,
          rotation: ((idx * 47) % 70) - 35,
          flowerId: stems[idx].flowerId,
          z: ringIdx,
          seed: idx,
        });
        idx++;
      }
    });

    return placed;
  }, [flowers]);

  const wrap = wrapId ? getWrap(wrapId) : undefined;
  const ribbon = ribbonId ? getRibbon(ribbonId) : undefined;

  const wrapBase = wrap?.color ?? "#C9A77C";
  const wrapShadow = mix(wrapBase, "#1a1410", 0.32);
  const wrapHighlight = mix(wrapBase, "#ffffff", 0.22);

  return (
    <svg
      viewBox="0 0 200 280"
      width={size}
      className={className}
      role="img"
      aria-label="Vista previa del ramo"
      overflow="visible"
    >
      <defs>
        <linearGradient id="bv-wrap-fold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={wrapHighlight} />
          <stop offset="50%" stopColor={wrapBase} />
          <stop offset="100%" stopColor={wrapShadow} />
        </linearGradient>
        <linearGradient id="bv-wrap-fold-2" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={wrapShadow} stopOpacity="0.4" />
          <stop offset="50%" stopColor={wrapHighlight} stopOpacity="0.6" />
          <stop offset="100%" stopColor={wrapShadow} stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="bv-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="bv-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="0" dy="3" result="ob" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.32" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      {expanded.length > 0 && (
        <ellipse
          cx="100"
          cy="265"
          rx={Math.min(80, 30 + expanded.length * 1.5)}
          ry="8"
          fill="url(#bv-ground)"
        />
      )}

      {/* Stems behind wrap */}
      {showWrap && wrap && expanded.length > 0 && (
        <g opacity="0.85">
          {[
            { x1: 78, x2: 72, color: "#5e7257" },
            { x1: 92, x2: 86, color: "#4a5d3f" },
            { x1: 100, x2: 100, color: "#5e7257" },
            { x1: 108, x2: 114, color: "#4a5d3f" },
            { x1: 122, x2: 128, color: "#5e7257" },
          ].map((s, i) => (
            <path
              key={i}
              d={`M${s.x1} 158 Q${(s.x1 + s.x2) / 2} 200 ${s.x2} 250`}
              stroke={s.color}
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}

      {/* WRAP */}
      {showWrap && wrap && (
        <g filter="url(#bv-soft)">
          {/* Back fold */}
          <path
            d="M28 158 L172 158 L150 252 L50 252 Z"
            fill={wrapShadow}
            opacity="0.7"
          />
          {/* Main cone */}
          <path
            d="M34 160 L166 160 L144 250 L56 250 Z"
            fill="url(#bv-wrap-fold)"
          />
          {/* Left fold */}
          <path
            d="M34 160 L80 160 L66 250 L56 250 Z"
            fill={wrapHighlight}
            opacity="0.35"
          />
          {/* Right fold */}
          <path
            d="M120 160 L166 160 L144 250 L134 250 Z"
            fill={wrapShadow}
            opacity="0.35"
          />
          {/* Top crease */}
          <path
            d="M34 160 L166 160"
            stroke={wrapShadow}
            strokeWidth="0.8"
            opacity="0.4"
          />
          {/* Vertical creases */}
          {[68, 100, 132].map((x) => (
            <line
              key={x}
              x1={x}
              y1="162"
              x2={x - (x - 100) * 0.2}
              y2="248"
              stroke={wrapShadow}
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          {wrap.texture === "kraft" && (
            <g opacity="0.18">
              <path
                d="M40 175 L160 175 M44 195 L156 195 M50 215 L150 215 M58 235 L142 235"
                stroke={wrapShadow}
                strokeWidth="0.4"
              />
            </g>
          )}
          {wrap.texture === "korean" && (
            <path
              d="M34 160 L166 160 L144 250 L56 250 Z"
              fill="url(#bv-wrap-fold-2)"
              opacity="0.4"
            />
          )}

          {/* Ribbon */}
          {ribbon && (
            <g>
              {/* Knot circle */}
              <ellipse
                cx="100"
                cy="208"
                rx="46"
                ry="7"
                fill={ribbon.color}
              />
              <ellipse
                cx="100"
                cy="208"
                rx="46"
                ry="3"
                fill="#000"
                opacity="0.18"
              />
              {/* Bow loops */}
              <ellipse
                cx="86"
                cy="206"
                rx="10"
                ry="7"
                fill={ribbon.color}
                transform="rotate(-15 86 206)"
              />
              <ellipse
                cx="114"
                cy="206"
                rx="10"
                ry="7"
                fill={ribbon.color}
                transform="rotate(15 114 206)"
              />
              {/* Bow center knot */}
              <ellipse cx="100" cy="208" rx="4" ry="5" fill={mix(ribbon.color, "#000", 0.25)} />
              {/* Tails */}
              <path
                d="M100 210 Q90 232 78 244 L82 246 Q96 234 102 213 Z"
                fill={ribbon.color}
              />
              <path
                d="M100 210 Q110 232 122 244 L118 246 Q104 234 100 213 Z"
                fill={mix(ribbon.color, "#000", 0.1)}
              />
            </g>
          )}
        </g>
      )}

      {/* Empty state */}
      {expanded.length === 0 && (
        <g>
          <circle
            cx="100"
            cy="100"
            r="62"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeDasharray="4 6"
          />
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="9"
            fill="currentColor"
            fillOpacity="0.45"
            fontFamily="var(--font-heading, serif)"
            fontStyle="italic"
          >
            tu ramo comienza aquí
          </text>
        </g>
      )}

      {/* Flowers */}
      {expanded.map((p, i) => {
        const f = getFlower(p.flowerId);
        if (!f) return null;
        const flowerSize = rnd3(64 * p.scale);
        const tx = rnd3(p.x - flowerSize / 2);
        const ty = rnd3(p.y - flowerSize / 2);
        const half = rnd3(flowerSize / 2);
        const innerScale = rnd3(flowerSize / 100);
        const rot = rnd3(p.rotation);
        return (
          <g key={i} transform={`translate(${tx} ${ty})`}>
            <g
              transform={`rotate(${rot} ${half} ${half}) scale(${innerScale})`}
            >
              <FlowerPaths
                kind={f.kind}
                color={f.color}
                accentColor={f.accentColor || "#444"}
                seed={p.seed}
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
