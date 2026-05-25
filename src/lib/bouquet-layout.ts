/**
 * Bouquet layout with collision-aware placement.
 *
 * Coordinate system: 200x280 SVG units.
 * Flowers cluster around (CENTER_X, CENTER_Y) and their stems converge
 * at the gather point near the top of the paper wrap.
 */

import { getFlower } from "./data";

export type Placement = {
  id: string;
  flowerId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  /** Visual radius in SVG units */
  radius: number;
  /** Layer order — lower renders behind */
  z: number;
  /** True when user has manually moved this flower (don't auto-reposition) */
  pinned?: boolean;
};

export type Stem = { flowerId: string; qty: number };

const CENTER_X = 100;
const CENTER_Y = 80;
const MAX_R = 72;

/** Point where all stems converge above the paper wrap. */
export const GATHER_X = 100;
export const GATHER_Y = 158;

function layerWeight(kind: string) {
  if (kind === "eucalyptus") return 0;
  if (kind === "babys-breath") return 1;
  if (kind === "lavender") return 2;
  return 3;
}

function visualRadius(kind: string) {
  // Tuned visual half-sizes — affect collision distance
  switch (kind) {
    case "peony":
      return 24;
    case "sunflower":
      return 26;
    case "lily":
      return 22;
    case "rose":
      return 20;
    case "hydrangea":
      return 22;
    case "tulip":
      return 18;
    case "daisy":
      return 20;
    case "lavender":
      return 12;
    case "eucalyptus":
      return 16;
    case "babys-breath":
      return 14;
    default:
      return 18;
  }
}

function visualScale(kind: string) {
  // Render scale (SVG flowerSize multiplier)
  return visualRadius(kind) / 100;
}

function seededAngle(seed: number, i: number) {
  const x = Math.sin((seed + i + 1) * 9173.137) * 10000;
  const v = x - Math.floor(x);
  return Math.round(v * 1000) / 1000;
}

function ringRadius(ring: number): number {
  // Generous ring spacing so flowers breathe
  if (ring === 0) return 0;
  if (ring === 1) return 26;
  if (ring === 2) return 46;
  if (ring === 3) return 62;
  return 72;
}

function ringCapacity(ring: number): number {
  if (ring === 0) return 1;
  if (ring === 1) return 6;
  if (ring === 2) return 10;
  if (ring === 3) return 14;
  return 18;
}

/** Compute initial placement for an existing array of stems. */
export function autoLayout(stems: Stem[]): Placement[] {
  // Expand stems
  const items: { flowerId: string; kind: string }[] = [];
  stems.forEach((s) => {
    const f = getFlower(s.flowerId);
    if (!f) return;
    for (let i = 0; i < s.qty; i++) {
      items.push({ flowerId: s.flowerId, kind: f.kind });
    }
  });

  // Sort so filler/greenery is placed first (z lower) and rendered behind
  items.sort((a, b) => layerWeight(a.kind) - layerWeight(b.kind));

  // Initial ring placement
  const placements: Placement[] = items.map((item, i) => {
    // Find which ring this index belongs to
    let cumulative = 0;
    let ring = 0;
    while (cumulative + ringCapacity(ring) <= i) {
      cumulative += ringCapacity(ring);
      ring++;
    }
    const idxInRing = i - cumulative;
    const ringCount = ringCapacity(ring);
    const angleOffset = ring * 0.31; // golden-ish offset per ring
    const jitter = (seededAngle(i * 7, ring) - 0.5) * 0.25;
    const angle =
      (idxInRing / Math.max(1, ringCount)) * Math.PI * 2 +
      angleOffset +
      jitter;
    const r = ringRadius(ring) * (0.92 + seededAngle(i * 13, ring) * 0.16);
    return {
      id: `auto-${i}-${item.flowerId}`,
      flowerId: item.flowerId,
      x: CENTER_X + Math.cos(angle) * r,
      y: CENTER_Y + Math.sin(angle) * r * 0.96,
      rotation: (seededAngle(i * 19, 0) - 0.5) * 50,
      scale: 0.92 + seededAngle(i * 23, 0) * 0.16,
      radius: visualRadius(item.kind),
      z: layerWeight(item.kind),
    };
  });

  // Collision relaxation
  return relax(placements, 12, 0.78);
}

/**
 * Push apart placements that overlap. `slack` (0-1) allows partial overlap
 * for a more natural bouquet density.
 */
export function relax(
  placements: Placement[],
  iterations = 8,
  slack = 0.78,
): Placement[] {
  const arr = placements.map((p) => ({ ...p }));
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i];
        const b = arr[j];
        if (a.pinned && b.pinned) continue;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.001) {
          dx = 1;
          dy = 0;
          dist = 1;
        }
        const minDist = (a.radius + b.radius) * slack;
        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          if (!a.pinned) {
            a.x -= nx * overlap;
            a.y -= ny * overlap;
          }
          if (!b.pinned) {
            b.x += nx * overlap;
            b.y += ny * overlap;
          }
        }
      }
      // Gentle pull toward center (so bouquet stays cohesive)
      const p = arr[i];
      if (!p.pinned) {
        const dx = CENTER_X - p.x;
        const dy = CENTER_Y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetMax = MAX_R;
        if (dist > targetMax) {
          const pull = (dist - targetMax) * 0.5;
          p.x += (dx / dist) * pull;
          p.y += (dy / dist) * pull;
        }
      }
    }
  }
  return arr;
}

/** Add a flower placement near the outer ring. */
export function addPlacement(
  current: Placement[],
  flowerId: string,
): Placement[] {
  const f = getFlower(flowerId);
  if (!f) return current;
  const radius = visualRadius(f.kind);
  // Pick an angle on the outer ring with minimal crowding
  const trialAngles = 12;
  let bestAngle = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < trialAngles; i++) {
    const angle = (i / trialAngles) * Math.PI * 2;
    const x = CENTER_X + Math.cos(angle) * 55;
    const y = CENTER_Y + Math.sin(angle) * 55;
    // Score: distance to nearest existing flower (further = better)
    let minDist = Infinity;
    for (const p of current) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < minDist) minDist = d;
    }
    if (minDist > bestScore) {
      bestScore = minDist;
      bestAngle = angle;
    }
  }
  const r = current.length < 4 ? 28 : 50;
  const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const seed = current.length;
  const next: Placement = {
    id,
    flowerId,
    x: CENTER_X + Math.cos(bestAngle) * r,
    y: CENTER_Y + Math.sin(bestAngle) * r * 0.96,
    rotation: (seededAngle(seed * 19, 0) - 0.5) * 50,
    scale: 0.92 + seededAngle(seed * 23, 0) * 0.16,
    radius,
    z: layerWeight(f.kind),
  };
  // Relax all (except pinned) so they make room for the new one
  return relax([...current, next], 10, 0.78);
}

/** Remove the last (non-pinned, then any) placement of a given flowerId. */
export function removePlacement(
  current: Placement[],
  flowerId: string,
): Placement[] {
  let idx = -1;
  for (let i = current.length - 1; i >= 0; i--) {
    if (current[i].flowerId === flowerId && !current[i].pinned) {
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    for (let i = current.length - 1; i >= 0; i--) {
      if (current[i].flowerId === flowerId) {
        idx = i;
        break;
      }
    }
  }
  if (idx === -1) return current;
  const next = current.slice();
  next.splice(idx, 1);
  return next;
}

export function clampToBounds(p: Placement): Placement {
  const dx = p.x - CENTER_X;
  const dy = p.y - CENTER_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = MAX_R;
  if (dist > maxR) {
    return {
      ...p,
      x: CENTER_X + (dx / dist) * maxR,
      y: CENTER_Y + (dy / dist) * maxR,
    };
  }
  return p;
}

export function countByFlower(placements: Placement[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of placements) {
    out[p.flowerId] = (out[p.flowerId] ?? 0) + 1;
  }
  return out;
}

export function totalStems(placements: Placement[]): number {
  return placements.length;
}

export { visualScale };
