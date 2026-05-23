"use client";

import { useRef, useState } from "react";
import { FlowerPaths } from "./Flower";
import { getFlower, getRibbon, getWrap } from "@/lib/data";
import { clampToBounds, type Placement } from "@/lib/bouquet-layout";

type Props = {
  placements: Placement[];
  wrapId?: string;
  ribbonId?: string;
  size?: number;
  showWrap?: boolean;
  className?: string;
  /** When true, flowers are draggable; clicking selects them. */
  interactive?: boolean;
  onPlacementsChange?: (next: Placement[]) => void;
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
  return `#${[r, g, c].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function InteractiveBouquetView({
  placements,
  wrapId,
  ribbonId,
  size = 360,
  showWrap = true,
  className,
  interactive = false,
  onPlacementsChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sorted = [...placements].sort((a, b) => a.z - b.z);
  const wrap = wrapId ? getWrap(wrapId) : undefined;
  const ribbon = ribbonId ? getRibbon(ribbonId) : undefined;

  const wrapBase = wrap?.color ?? "#C9A77C";
  const wrapShadow = mix(wrapBase, "#1a1006", 0.32);
  const wrapHighlight = mix(wrapBase, "#ffffff", 0.22);

  // Convert pointer event to SVG coordinates
  function pointerToSvg(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const transformed = pt.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  function handlePointerDown(
    e: React.PointerEvent<SVGGElement>,
    p: Placement,
  ) {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const { x, y } = pointerToSvg(e.clientX, e.clientY);
    setDragging({
      id: p.id,
      offsetX: p.x - x,
      offsetY: p.y - y,
    });
  }

  function handlePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!dragging || !onPlacementsChange) return;
    const { x, y } = pointerToSvg(e.clientX, e.clientY);
    const newX = x + dragging.offsetX;
    const newY = y + dragging.offsetY;
    onPlacementsChange(
      placements.map((p) => {
        if (p.id !== dragging.id) return p;
        const moved = clampToBounds({ ...p, x: newX, y: newY, pinned: true });
        return moved;
      }),
    );
  }

  function handlePointerUp(e: React.PointerEvent<SVGGElement>) {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragging(null);
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 280"
      width={size}
      className={className}
      role="img"
      aria-label="Vista previa del ramo"
      overflow="visible"
      style={{ touchAction: interactive ? "none" : "auto" }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <defs>
        {/* Soft bokeh background */}
        <radialGradient id="bv-bokeh" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
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
        <radialGradient id="bv-petal-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
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

      {/* Background bokeh */}
      <circle cx="100" cy="90" r="95" fill="url(#bv-bokeh)" opacity="0.5" />

      {/* Ground shadow */}
      {placements.length > 0 && (
        <ellipse
          cx="100"
          cy={showWrap && wrap ? 265 : 195}
          rx={Math.min(80, 30 + placements.length * 1.5)}
          ry="8"
          fill="url(#bv-ground)"
        />
      )}

      {/* Stems behind wrap */}
      {showWrap && wrap && placements.length > 0 && (
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
          <path
            d="M28 158 L172 158 L150 252 L50 252 Z"
            fill={wrapShadow}
            opacity="0.7"
          />
          <path
            d="M34 160 L166 160 L144 250 L56 250 Z"
            fill="url(#bv-wrap-fold)"
          />
          <path
            d="M34 160 L80 160 L66 250 L56 250 Z"
            fill={wrapHighlight}
            opacity="0.35"
          />
          <path
            d="M120 160 L166 160 L144 250 L134 250 Z"
            fill={wrapShadow}
            opacity="0.35"
          />
          <path
            d="M34 160 L166 160"
            stroke={wrapShadow}
            strokeWidth="0.8"
            opacity="0.4"
          />
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

          {ribbon && (
            <g>
              <ellipse cx="100" cy="208" rx="46" ry="7" fill={ribbon.color} />
              <ellipse
                cx="100"
                cy="208"
                rx="46"
                ry="3"
                fill="#000"
                opacity="0.18"
              />
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
              <ellipse
                cx="100"
                cy="208"
                rx="4"
                ry="5"
                fill={mix(ribbon.color, "#000", 0.25)}
              />
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
      {placements.length === 0 && (
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

      {/* Per-flower ground shadows (subtle) */}
      {sorted.map((p) => {
        const f = getFlower(p.flowerId);
        if (!f) return null;
        const r = p.radius * p.scale;
        return (
          <ellipse
            key={`s-${p.id}`}
            cx={rnd3(p.x)}
            cy={rnd3(p.y + r * 0.55)}
            rx={rnd3(r * 0.65)}
            ry={rnd3(r * 0.18)}
            fill="url(#bv-petal-shadow)"
          />
        );
      })}

      {/* Flowers */}
      {sorted.map((p) => {
        const f = getFlower(p.flowerId);
        if (!f) return null;
        const flowerSize = rnd3(p.radius * 2 * p.scale);
        const tx = rnd3(p.x - flowerSize / 2);
        const ty = rnd3(p.y - flowerSize / 2);
        const half = rnd3(flowerSize / 2);
        const innerScale = rnd3(flowerSize / 100);
        const rot = rnd3(p.rotation);
        const isHovered = hoveredId === p.id;
        const isDragging = dragging?.id === p.id;

        return (
          <g
            key={p.id}
            transform={`translate(${tx} ${ty})`}
            style={{
              cursor: interactive ? (isDragging ? "grabbing" : "grab") : "default",
              transition: isDragging
                ? "none"
                : "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)",
            }}
            onPointerDown={(e) => handlePointerDown(e, p)}
            onPointerEnter={() => interactive && setHoveredId(p.id)}
            onPointerLeave={() => interactive && setHoveredId(null)}
          >
            <g
              transform={`rotate(${rot} ${half} ${half}) scale(${innerScale})`}
              style={{
                transform: isHovered || isDragging ? "translateY(-2px)" : undefined,
                transition: "transform 0.2s ease",
              }}
            >
              <FlowerPaths
                kind={f.kind}
                color={f.color}
                accentColor={f.accentColor || "#444"}
                seed={parseInt(p.id.slice(-4), 36) || 0}
              />
            </g>
            {interactive && isHovered && !isDragging && (
              <circle
                cx={half}
                cy={half}
                r={p.radius * 1.1}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                strokeWidth="0.8"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
