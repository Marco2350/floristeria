"use client";

import { useEffect, useRef, useState } from "react";
import { FlowerPaths } from "./Flower";
import { getFlower, getRibbon, getWrap } from "@/lib/data";
import {
  clampToBounds,
  GATHER_X,
  GATHER_Y,
  type Placement,
} from "@/lib/bouquet-layout";

type Props = {
  placements: Placement[];
  wrapId?: string;
  ribbonId?: string;
  size?: number;
  showWrap?: boolean;
  className?: string;
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
    moved: boolean;
  } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sort back-to-front (lower z renders first)
  const sorted = [...placements].sort((a, b) => a.z - b.z);
  // Compute distance-from-center to apply atmospheric perspective
  const wrap = wrapId ? getWrap(wrapId) : undefined;
  const ribbon = ribbonId ? getRibbon(ribbonId) : undefined;

  const wrapBase = wrap?.color ?? "#C9A77C";
  const wrapShadow = mix(wrapBase, "#1a1006", 0.32);
  const wrapHighlight = mix(wrapBase, "#ffffff", 0.22);

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
    setSelectedId(p.id);
    const { x, y } = pointerToSvg(e.clientX, e.clientY);
    setDragging({
      id: p.id,
      offsetX: p.x - x,
      offsetY: p.y - y,
      moved: false,
    });
  }

  function handlePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!dragging || !onPlacementsChange) return;
    const { x, y } = pointerToSvg(e.clientX, e.clientY);
    const newX = x + dragging.offsetX;
    const newY = y + dragging.offsetY;
    setDragging((d) => (d ? { ...d, moved: true } : null));
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

  // Rotate hovered/selected flower with scroll wheel
  useEffect(() => {
    if (!interactive) return;
    function onWheel(e: WheelEvent) {
      const target = hoveredId || selectedId;
      if (!target || !onPlacementsChange) return;
      const svg = svgRef.current;
      if (!svg) return;
      // Only intercept when over the svg
      const rect = svg.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 8 : -8;
      onPlacementsChange(
        placements.map((p) =>
          p.id === target
            ? { ...p, rotation: p.rotation + delta, pinned: true }
            : p,
        ),
      );
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [interactive, hoveredId, selectedId, onPlacementsChange, placements]);

  // Click outside flowers deselects
  function svgClick(e: React.MouseEvent) {
    if (!interactive) return;
    if (e.target === svgRef.current) setSelectedId(null);
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
      onClick={svgClick}
    >
      <defs>
        {/* Atmospheric depth — back flowers get soft blur */}
        <filter id="bv-depth-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="bv-depth-blur-strong" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        {/* Saturation reduction for depth */}
        <filter id="bv-back" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.8" />
          <feColorMatrix
            type="matrix"
            values="0.85 0.05 0.05 0 0.04
                    0.05 0.85 0.05 0 0.04
                    0.05 0.05 0.85 0 0.04
                    0 0 0 1 0"
          />
        </filter>
        {/* Soft bokeh background */}
        <radialGradient id="bv-bokeh" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
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
          <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bv-petal-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background bokeh */}
      <circle cx="100" cy="90" r="95" fill="url(#bv-bokeh)" opacity="0.4" />

      {/* Ground shadow */}
      {placements.length > 0 && (
        <ellipse
          cx="100"
          cy={showWrap && wrap ? 265 : 195}
          rx={Math.min(80, 30 + placements.length * 1.5)}
          ry="9"
          fill="url(#bv-ground)"
        />
      )}


      {/* WRAP */}
      {showWrap && wrap && (
        <g>
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
              {/* Ribbon highlight */}
              <ellipse cx="86" cy="204" rx="6" ry="2" fill="#fff" opacity="0.25" transform="rotate(-15 86 204)" />
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

      {/* Stems from gather point to each flower */}
      {placements.length > 0 && (
        <g>
          {sorted.map((p) => {
            const f = getFlower(p.flowerId);
            if (!f) return null;
            const flowerRadius = p.radius * p.scale;
            const stemBottomY = p.y + flowerRadius * 0.4;
            if (stemBottomY >= GATHER_Y - 2) return null;

            const dx = p.x - GATHER_X;
            const dy = stemBottomY - GATHER_Y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Curve outward slightly — perpendicular to stem direction
            const baseMidX = GATHER_X + dx * 0.5;
            const baseMidY = GATHER_Y + dy * 0.5;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const curveAmt = Math.min(8, Math.abs(dx) * 0.1 + 2);
            const midX = rnd3(baseMidX + perpX * curveAmt * Math.sign(dx || 1));
            const midY = rnd3(baseMidY + perpY * curveAmt * Math.sign(dx || 1));

            // Per-stem variation from id
            const seedHash = (parseInt(p.id.slice(-4), 36) || 0) % 7;
            const toneOptions = [
              "#5e7257",
              "#6a8064",
              "#4a5d3f",
              "#7d9276",
              "#566a4f",
              "#869c7a",
              "#3f5236",
            ];
            const tone = toneOptions[seedHash];
            const thickness = 1.5 + (seedHash % 3) * 0.4;

            const d = `M${rnd3(GATHER_X)} ${rnd3(GATHER_Y)} Q${midX} ${midY} ${rnd3(p.x)} ${rnd3(stemBottomY)}`;

            // Leaves on a subset of stems
            const showLeaves = seedHash % 3 === 0 && f.kind !== "eucalyptus" && f.kind !== "lavender";
            const leafPositions = showLeaves ? [0.36, 0.62] : [];

            return (
              <g key={`stem-${p.id}`}>
                {/* Dark stroke for depth */}
                <path
                  d={d}
                  stroke="#2a3a20"
                  strokeWidth={thickness + 0.7}
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                {/* Main stem */}
                <path
                  d={d}
                  stroke={tone}
                  strokeWidth={thickness}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Highlight line */}
                <path
                  d={d}
                  stroke="#b3c4a4"
                  strokeWidth={thickness * 0.28}
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                {/* Leaves */}
                {leafPositions.map((tt, li) => {
                  const one = 1 - tt;
                  const lx =
                    one * one * GATHER_X +
                    2 * one * tt * midX +
                    tt * tt * p.x;
                  const ly =
                    one * one * GATHER_Y +
                    2 * one * tt * midY +
                    tt * tt * stemBottomY;
                  const tangentX =
                    2 * one * (midX - GATHER_X) + 2 * tt * (p.x - midX);
                  const tangentY =
                    2 * one * (midY - GATHER_Y) +
                    2 * tt * (stemBottomY - midY);
                  const angle = (Math.atan2(tangentY, tangentX) * 180) / Math.PI;
                  const leafSide = li % 2 === 0 ? 1 : -1;
                  return (
                    <g
                      key={li}
                      transform={`translate(${rnd3(lx)} ${rnd3(ly)}) rotate(${rnd3(angle + leafSide * 65)})`}
                    >
                      {/* Leaf shape */}
                      <path
                        d="M0 0 Q1.5 -1.6 4 -2.6 Q6 -3 6.5 -2 Q6 -0.8 4 -0.2 Q1.5 0.5 0 0 Z"
                        fill={tone}
                      />
                      {/* Leaf vein */}
                      <path
                        d="M0.5 -1 Q3 -1.8 6 -2.2"
                        stroke="#2a3a20"
                        strokeWidth="0.2"
                        opacity="0.4"
                        fill="none"
                      />
                      {/* Leaf shadow */}
                      <path
                        d="M0 0 Q1.5 -1.6 4 -2.6 Q6 -3 6.5 -2 Q6 -0.8 4 -0.2 Q1.5 0.5 0 0 Z"
                        fill="#000"
                        opacity="0.12"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
          {/* Tight bundle right at the gather — small dark cluster */}
          <ellipse cx={GATHER_X} cy={GATHER_Y - 1} rx="14" ry="3.5" fill="#2a3a20" opacity="0.45" />
          <ellipse cx={GATHER_X} cy={GATHER_Y - 2} rx="10" ry="2" fill="#5e7257" opacity="0.55" />
        </g>
      )}

      {/* Per-flower ground shadows */}
      {sorted.map((p) => {
        const f = getFlower(p.flowerId);
        if (!f) return null;
        const r = p.radius * p.scale;
        return (
          <ellipse
            key={`s-${p.id}`}
            cx={rnd3(p.x)}
            cy={rnd3(p.y + r * 0.55)}
            rx={rnd3(r * 0.7)}
            ry={rnd3(r * 0.2)}
            fill="url(#bv-petal-shadow)"
          />
        );
      })}

      {/* Flowers — with atmospheric depth for back layers */}
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
        const isSelected = selectedId === p.id;

        // Depth filter: greenery (z=0) gets blur+desat, filler (z=1) less, blooms (z>=3) crisp
        const depthFilter = p.z === 0 ? "url(#bv-back)" : p.z === 1 ? "url(#bv-depth-blur)" : undefined;

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
              filter={depthFilter}
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
            {interactive && (isHovered || isSelected) && !isDragging && (
              <circle
                cx={half}
                cy={half}
                r={p.radius * 1.15}
                fill="none"
                stroke="currentColor"
                strokeOpacity={isSelected ? 0.55 : 0.35}
                strokeDasharray={isSelected ? undefined : "3 3"}
                strokeWidth={isSelected ? 1 : 0.8}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
