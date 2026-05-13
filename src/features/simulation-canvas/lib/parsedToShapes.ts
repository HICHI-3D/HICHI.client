/**
 * 백엔드에서 받은 ParsedFloorPlan → Editor가 이해하는 Shape 배열 변환.
 *
 * Pipeline (모두 mm 단위):
 *  1. Drop short segments  (< MIN_LENGTH_MM)
 *  2. Axis snap            (angle within ANGLE_SNAP_DEG of 0° or 90°)
 *  3. Merge near-collinear (same direction ± ANGLE_TOL, perp-dist < DIST_TOL_MM)
 *  4. Snap nearby endpoints (cluster radius SNAP_RADIUS_MM)
 *  5. Drop degenerate      (< MIN_LENGTH_MM after snapping)
 */

import type { ParsedFloorPlan } from '@shared/api';

import type { Shape } from '../model/types';

// ─── Tunable constants ────────────────────────────────────────────────────────

const MIN_LENGTH_MM = 400;
const ANGLE_SNAP_DEG = 10; // a touch wider — apartment plans are orthogonal
const ANGLE_TOL = 4; // degrees – collinear-merge grouping
const DIST_TOL_MM = 350; // perpendicular distance – collinear-merge grouping
const SNAP_RADIUS_MM = 350; // endpoint clustering radius
const ORTHO_TOL_DEG = 10; // for outlier-drop step
const ORTHO_DROP_RATIO = 0.7; // if ≥70% walls are orthogonal, drop the rest

// ─── Internal helpers ─────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10);

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function segLength(s: Seg): number {
  return Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
}

/**
 * Returns the direction angle of a segment in degrees, normalised to [0, 180).
 * Direction-agnostic: (x1,y1)→(x2,y2) and (x2,y2)→(x1,y1) give the same value.
 */
function segAngleDeg(s: Seg): number {
  let deg = (Math.atan2(s.y2 - s.y1, s.x2 - s.x1) * 180) / Math.PI;
  // normalise to [0, 180)
  deg = ((deg % 180) + 180) % 180;
  return deg;
}

/**
 * Angular distance between two [0,180) angles, wrapping at 180° boundary.
 */
function angleDiffDeg(a: number, b: number): number {
  const d = Math.abs(a - b) % 180;
  return d > 90 ? 180 - d : d;
}

// ── Step 0 ────────────────────────────────────────────────────────────────────

/**
 * If the input is overwhelmingly orthogonal (apartment plan), drop the diagonal
 * segments — they're almost certainly noise (text edges, gray-region borders).
 */
function dropDiagonalOutliers(segs: Seg[]): Seg[] {
  if (segs.length === 0) return segs;
  const isOrtho = (s: Seg) => {
    const a = segAngleDeg(s);
    const toH = Math.min(a, 180 - a);
    const toV = Math.abs(a - 90);
    return Math.min(toH, toV) <= ORTHO_TOL_DEG;
  };
  const orthoCount = segs.filter(isOrtho).length;
  if (orthoCount / segs.length >= ORTHO_DROP_RATIO) {
    return segs.filter(isOrtho);
  }
  return segs;
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

function dropShort(segs: Seg[]): Seg[] {
  return segs.filter((s) => segLength(s) >= MIN_LENGTH_MM);
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

/**
 * Snaps a segment to be exactly horizontal or vertical when its angle is within
 * ANGLE_SNAP_DEG of the axis.  Rotation is performed around the midpoint.
 */
function axisSnap(segs: Seg[]): Seg[] {
  return segs.map((s) => {
    const deg = segAngleDeg(s);
    // distance to nearest axis: 0°/180° (horizontal) or 90° (vertical)
    const toH = Math.min(deg, 180 - deg); // distance to 0°/180°
    const toV = Math.abs(deg - 90); // distance to 90°

    const snapH = toH <= ANGLE_SNAP_DEG;
    const snapV = toV <= ANGLE_SNAP_DEG;

    if (!snapH && !snapV) return s;

    const mx = (s.x1 + s.x2) / 2;
    const my = (s.y1 + s.y2) / 2;
    const halfLen = segLength(s) / 2;

    if (snapH) {
      // Make exactly horizontal; preserve direction sign
      const sign = s.x2 >= s.x1 ? 1 : -1;
      return { x1: mx - sign * halfLen, y1: my, x2: mx + sign * halfLen, y2: my };
    } else {
      // Make exactly vertical; preserve direction sign
      const sign = s.y2 >= s.y1 ? 1 : -1;
      return { x1: mx, y1: my - sign * halfLen, x2: mx, y2: my + sign * halfLen };
    }
  });
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

/**
 * Perpendicular distance from point (px,py) to the infinite line through
 * (lx,ly) with unit direction (dx,dy).
 */
function perpDist(px: number, py: number, lx: number, ly: number, dx: number, dy: number): number {
  // Cross product magnitude: |(p-l) × d|
  return Math.abs((px - lx) * dy - (py - ly) * dx);
}

/**
 * Average direction (unit vector) for a group of segments.
 * Flips each segment's vector so all point roughly the same half-plane before
 * averaging – necessary because angles are normalised to [0,180).
 */
function averageDirection(segs: Seg[]): { dx: number; dy: number } {
  // Reference direction: first segment
  const ref = segs[0];
  const refDx = ref.x2 - ref.x1;
  const refDy = ref.y2 - ref.y1;
  const refLen = Math.hypot(refDx, refDy) || 1;
  const refUx = refDx / refLen;
  const refUy = refDy / refLen;

  let sumX = 0;
  let sumY = 0;
  for (const s of segs) {
    let dx = s.x2 - s.x1;
    let dy = s.y2 - s.y1;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    // Flip if pointing opposite to reference
    if (dx * refUx + dy * refUy < 0) {
      dx = -dx;
      dy = -dy;
    }
    sumX += dx;
    sumY += dy;
  }
  const mag = Math.hypot(sumX, sumY) || 1;
  return { dx: sumX / mag, dy: sumY / mag };
}

function mergeCollinear(segs: Seg[]): Seg[] {
  const used = new Array<boolean>(segs.length).fill(false);
  const result: Seg[] = [];

  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;

    const group: number[] = [i];
    const angleI = segAngleDeg(segs[i]);
    // Anchor point for the line: midpoint of segment i
    const ax = (segs[i].x1 + segs[i].x2) / 2;
    const ay = (segs[i].y1 + segs[i].y2) / 2;

    for (let j = i + 1; j < segs.length; j++) {
      if (used[j]) continue;
      const angleJ = segAngleDeg(segs[j]);
      if (angleDiffDeg(angleI, angleJ) > ANGLE_TOL) continue;

      // Compute a representative direction for the current group so far
      const { dx, dy } = averageDirection(group.map((k) => segs[k]));
      // Perpendicular distance from midpoint of j to the anchor line
      const mjx = (segs[j].x1 + segs[j].x2) / 2;
      const mjy = (segs[j].y1 + segs[j].y2) / 2;
      if (perpDist(mjx, mjy, ax, ay, dx, dy) <= DIST_TOL_MM) {
        group.push(j);
      }
    }

    // Mark all group members as used
    group.forEach((k) => (used[k] = true));

    if (group.length === 1) {
      result.push(segs[i]);
      continue;
    }

    // Merge: project all endpoints onto the average direction line through the
    // average midpoint, then take the two extreme projected points.
    const { dx, dy } = averageDirection(group.map((k) => segs[k]));

    // Average anchor: centroid of all midpoints
    let cx = 0;
    let cy = 0;
    for (const k of group) {
      cx += (segs[k].x1 + segs[k].x2) / 2;
      cy += (segs[k].y1 + segs[k].y2) / 2;
    }
    cx /= group.length;
    cy /= group.length;

    let minT = Infinity;
    let maxT = -Infinity;
    for (const k of group) {
      for (const pt of [
        { x: segs[k].x1, y: segs[k].y1 },
        { x: segs[k].x2, y: segs[k].y2 },
      ]) {
        // Scalar projection along direction (dx,dy)
        const t = (pt.x - cx) * dx + (pt.y - cy) * dy;
        if (t < minT) minT = t;
        if (t > maxT) maxT = t;
      }
    }

    result.push({
      x1: cx + minT * dx,
      y1: cy + minT * dy,
      x2: cx + maxT * dx,
      y2: cy + maxT * dy,
    });
  }

  return result;
}

// ── Step 4 ────────────────────────────────────────────────────────────────────

interface IndexedPoint {
  x: number;
  y: number;
  /** which segment and which endpoint (0=start, 1=end) */
  segIdx: number;
  endIdx: 0 | 1;
}

/**
 * Greedy endpoint clustering: repeatedly find the pair of unclustered points
 * within SNAP_RADIUS_MM and merge them.  Replace every point in each cluster
 * with the cluster centroid.
 */
function snapEndpoints(segs: Seg[]): Seg[] {
  // Flatten all endpoints into a mutable list
  const pts: IndexedPoint[] = [];
  for (let i = 0; i < segs.length; i++) {
    pts.push({ x: segs[i].x1, y: segs[i].y1, segIdx: i, endIdx: 0 });
    pts.push({ x: segs[i].x2, y: segs[i].y2, segIdx: i, endIdx: 1 });
  }

  // Union-Find over pts indices
  const parent = pts.map((_, i) => i);
  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]; // path compression
      i = parent[i];
    }
    return i;
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) <= SNAP_RADIUS_MM) {
        union(i, j);
      }
    }
  }

  // Compute centroid for each cluster root
  const clusterSum = new Map<number, { sx: number; sy: number; count: number }>();
  for (let i = 0; i < pts.length; i++) {
    const root = find(i);
    const cur = clusterSum.get(root) ?? { sx: 0, sy: 0, count: 0 };
    cur.sx += pts[i].x;
    cur.sy += pts[i].y;
    cur.count += 1;
    clusterSum.set(root, cur);
  }

  // Apply centroids back to segments (copy to avoid mutation of input)
  const out: Seg[] = segs.map((s) => ({ ...s }));
  for (let i = 0; i < pts.length; i++) {
    const root = find(i);
    const { sx, sy, count } = clusterSum.get(root)!;
    const p = pts[i];
    if (p.endIdx === 0) {
      out[p.segIdx].x1 = sx / count;
      out[p.segIdx].y1 = sy / count;
    } else {
      out[p.segIdx].x2 = sx / count;
      out[p.segIdx].y2 = sy / count;
    }
  }

  return out;
}

// ─── Public entry point ───────────────────────────────────────────────────────

export const parsedToShapes = (parsed: ParsedFloorPlan): Shape[] => {
  let segs: Seg[] = parsed.walls.map((w) => ({
    x1: w.x1,
    y1: w.y1,
    x2: w.x2,
    y2: w.y2,
  }));

  // 0. If overwhelmingly orthogonal, drop diagonal outliers
  segs = dropDiagonalOutliers(segs);

  // 1. Drop short segments
  segs = dropShort(segs);

  // 2. Axis snap
  segs = axisSnap(segs);

  // 3. Merge near-collinear segments
  segs = mergeCollinear(segs);

  // 4. Snap nearby endpoints
  segs = snapEndpoints(segs);

  // 5. Drop degenerate (collapsed by snapping)
  segs = dropShort(segs);

  return segs.map<Shape>((s) => ({
    id: uid(),
    type: 'wall',
    start: { x: s.x1, y: s.y1 },
    end: { x: s.x2, y: s.y2 },
  }));
};
