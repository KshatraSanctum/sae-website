import { optionsResponse } from "../_shared/cors.ts";
import { isRecord, readJsonBody } from "../_shared/input.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getPublicAdmin } from "../_shared/server.ts";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MAX_OFFSET = 100_000;

type FilterSource = URLSearchParams | Readonly<Record<string, unknown>>;

const readFilterValue = (source: FilterSource, ...names: string[]): unknown => {
  for (const name of names) {
    if (source instanceof URLSearchParams) {
      const value = source.get(name)?.trim();
      if (value) {
        return value;
      }
      continue;
    }

    const value = source[name];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
};

const readTextFilter = (source: FilterSource, ...names: string[]): string | undefined => {
  const value = readFilterValue(source, ...names);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const readBoundedInteger = (
  source: FilterSource,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number | { error: string } => {
  const value = readFilterValue(source, name);
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const rawValue = typeof value === "number" ? String(value) : String(value).trim();
  if (!/^\d+$/.test(rawValue)) {
    return { error: `${name} must be a non-negative integer` };
  }

  const parsed = Number(rawValue);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    return { error: `${name} must be between ${minimum} and ${maximum}` };
  }

  return parsed;
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return errorResponse("Only GET and POST requests are supported", 405);
  }

  try {
    let filters: FilterSource;
    if (request.method === "GET") {
      filters = new URL(request.url).searchParams;
    } else {
      const body = await readJsonBody(request);
      if (!isRecord(body)) {
        return errorResponse("Request body must be a JSON object", 400);
      }
      filters = body;
    }

    const trackId = readTextFilter(filters, "trackId", "track_id", "competition");
    const trackVersion = readTextFilter(filters, "trackVersion", "track_version");
    const physicsVersion = readTextFilter(filters, "physicsVersion", "physics_version");
    const difficulty = readTextFilter(filters, "difficulty")?.toUpperCase();
    const limit = readBoundedInteger(filters, "limit", DEFAULT_LIMIT, 1, MAX_LIMIT);
    const offset = readBoundedInteger(filters, "offset", 0, 0, MAX_OFFSET);

    if (typeof limit !== "number") {
      return errorResponse(limit.error, 400);
    }
    if (typeof offset !== "number") {
      return errorResponse(offset.error, 400);
    }
    if (trackId && !/^[a-z0-9][a-z0-9_-]{0,79}$/i.test(trackId)) {
      return errorResponse("trackId is invalid", 400);
    }
    if (trackVersion && !/^[a-z0-9][a-z0-9._-]{0,39}$/i.test(trackVersion)) {
      return errorResponse("trackVersion is invalid", 400);
    }
    if (physicsVersion && !/^[a-z0-9][a-z0-9._-]{0,79}$/i.test(physicsVersion)) {
      return errorResponse("physicsVersion is invalid", 400);
    }
    if (difficulty && difficulty !== "STANDARD" && difficulty !== "PRO") {
      return errorResponse("difficulty must be STANDARD or PRO", 400);
    }

    const admin = await getPublicAdmin(request);
    let query = admin
      .from("leaderboard_entries")
      .select("id, player_name, score, rank, created_at, metadata")
      .order("score", { ascending: true })
      .order("created_at", { ascending: true });

    if (trackId) {
      query = query.eq("track_id", trackId);
    }
    if (trackVersion) {
      query = query.eq("track_version", trackVersion);
    }
    if (physicsVersion) {
      query = query.eq("physics_version", physicsVersion);
    }
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      console.error("Unable to load leaderboard", error);
      return errorResponse("Unable to load the leaderboard", 500);
    }

    const entries = (data ?? []).map((entry: {
      id: string;
      player_name: string;
      score: number | string;
      rank: number | string;
      created_at: string;
      metadata: Record<string, unknown> | null;
    }) => ({
      id: entry.id,
      playerName: entry.player_name,
      score: Number(entry.score),
      rank: Number(entry.rank),
      createdAt: entry.created_at,
      metadata: entry.metadata ?? {},
    }));

    return jsonResponse({ entries });
  } catch (error) {
    console.error("Unexpected get-leaderboard error", error);
    return errorResponse("Unable to load the leaderboard", 500);
  }
});
