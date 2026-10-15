import { TRACK, type TrackDifficulty } from './trackCircuit';

type BestStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const bestLapStorageKey = (mode: TrackDifficulty) =>
  `sae_track_best_lap:${TRACK.id}:${TRACK.version}:${TRACK.physicsVersion}:${mode}`;

export function readPersonalBest(storage: BestStorage | null, mode: TrackDifficulty): number | null {
  try {
    const raw = storage?.getItem(bestLapStorageKey(mode));
    if (!raw) return null;
    const timeMs = Number(raw);
    return Number.isSafeInteger(timeMs) && timeMs >= TRACK.minLapMs ? timeMs : null;
  } catch {
    return null;
  }
}

export function savePersonalBest(
  storage: BestStorage | null, mode: TrackDifficulty, lapMs: number, sessionBest: number | null,
) {
  const stored = readPersonalBest(storage, mode);
  const previous = Math.min(stored ?? Infinity, sessionBest ?? Infinity);
  const valid = Number.isSafeInteger(lapMs) && lapMs >= TRACK.minLapMs;
  const isNewRecord = valid && lapMs < previous;
  const timeMs = isNewRecord ? lapMs : Number.isFinite(previous) ? previous : null;
  let persisted = stored !== null && timeMs === stored;
  if (isNewRecord && storage) {
    try {
      storage.setItem(bestLapStorageKey(mode), String(lapMs));
      persisted = true;
    } catch { /* Racing remains available when browser storage is blocked/full. */ }
  }
  return { timeMs, isNewRecord, persisted };
}
