export type TrackDifficulty = 'STANDARD' | 'PRO';

// Geometry, timing rules, and local-record identity must change together.
export const TRACK = {
  id: 'interlagos-inspired',
  version: 'v2',
  physicsVersion: 'timed-v1',
  title: 'BIT Sindri International Circuit',
  subtitle: 'Interlagos-inspired Formula Student layout',
  width: 1350,
  height: 900,
  sampleCount: 650,
  start: { x: 360, y: 270, pct: 0, heading: Math.atan2(160, -170), rotation: -40 },
  minLapMs: 10_000,
  minCheckpointMs: 300,
  maxForwardStepPct: 0.037,
  maxReverseStepPct: 0.0123,
  maxReverseProgress: 0.035,
  tolerance: { STANDARD: 40, PRO: 32 },
  asphaltWidth: 64,
  kerbWidth: 76,
  path: 'M 360 270 L 190 430 C 130 490, 80 500, 80 550 C 80 595, 120 615, 150 625 C 180 635, 150 710, 135 750 C 115 800, 180 815, 260 815 L 800 815 C 860 815, 885 780, 885 710 C 885 645, 855 595, 785 555 L 560 450 C 490 425, 465 365, 480 305 C 495 245, 560 235, 650 240 C 700 245, 720 325, 690 375 C 665 415, 710 430, 765 395 C 820 355, 905 245, 950 225 C 975 210, 985 245, 945 300 C 890 375, 865 440, 875 500 C 885 550, 940 580, 1030 580 C 1120 580, 1215 510, 1250 420 C 1285 330, 1260 205, 1160 155 C 1060 115, 700 125, 540 135 C 480 140, 420 210, 360 270 Z',
  checkpoints: [
    { id: 's1', label: 'S1', pct: 0.31, startPct: 0.28, endPct: 0.35, x: 870, y: 740, rotation: -65, color: '#38bdf8' },
    { id: 's2', label: 'S2', pct: 0.705, startPct: 0.67, endPct: 0.74, x: 995, y: 580, rotation: 10, color: '#a855f7' },
    { id: 's3', label: 'S3', pct: 0.825, startPct: 0.79, endPct: 0.86, x: 1210, y: 200, rotation: -60, color: '#f6b719' },
  ],
  grid: [
    { label: 'P1', x: 320, y: 305 },
    { label: 'P2', x: 280, y: 340 },
    { label: 'P3', x: 240, y: 375 },
  ],
} as const;

export interface CircuitPoint {
  x: number;
  y: number;
  pct: number;
}

interface Matrix2D {
  a: number; b: number; c: number; d: number; e: number; f: number;
}

export function trackToScreen(point: { x: number; y: number }, matrix: Matrix2D) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f,
  };
}

export function screenToTrack(point: { x: number; y: number }, matrix: Matrix2D) {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-10) return null;
  const x = point.x - matrix.e;
  const y = point.y - matrix.f;
  return { x: (matrix.d * x - matrix.c * y) / determinant, y: (-matrix.b * x + matrix.a * y) / determinant };
}

// Segment projection avoids false off-track results between sampled points.
export function closestTrackPosition(point: { x: number; y: number }, points: CircuitPoint[]) {
  let best = { x: 0, y: 0, pct: 0, distance: Infinity };
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1,
      ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq));
    const x = a.x + dx * t;
    const y = a.y + dy * t;
    const distance = Math.hypot(point.x - x, point.y - y);
    if (distance < best.distance) {
      const endPct = i === points.length - 1 ? 1 : b.pct;
      best = { x, y, pct: (a.pct + (endPct - a.pct) * t) % 1, distance };
    }
  }
  return best;
}
