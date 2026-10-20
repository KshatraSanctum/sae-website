import { AuthError, requireUser } from "../_shared/server.ts";
import { optionsResponse } from "../_shared/cors.ts";
import { generateSessionToken, sha256Hex } from "../_shared/hash.ts";
import { isRecord, readJsonBody } from "../_shared/input.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";

const DEFAULT_TRACK_ID = "interlagos-inspired";
const DEFAULT_DIFFICULTY = "STANDARD";
const SESSION_DURATION_MS = 15 * 60 * 1000;

const TRACK_RULE_SELECT = [
  "id",
  "track_id",
  "track_version",
  "physics_version",
  "difficulty",
  "min_lap_ms",
  "min_checkpoint_ms",
  "max_forward_step_pct",
  "max_reverse_step_pct",
  "max_reverse_progress",
  "tolerance",
  "checkpoint_rules",
].join(",");

const asOptionalText = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const makeRulesSnapshot = (rule: Record<string, unknown>) => ({
  id: String(rule.id),
  trackId: String(rule.track_id),
  trackVersion: String(rule.track_version),
  physicsVersion: String(rule.physics_version),
  difficulty: String(rule.difficulty),
  minLapMs: Number(rule.min_lap_ms),
  minCheckpointMs: Number(rule.min_checkpoint_ms),
  maxForwardStepPct: Number(rule.max_forward_step_pct),
  maxReverseStepPct: Number(rule.max_reverse_step_pct),
  maxReverseProgress: Number(rule.max_reverse_progress),
  tolerance: Number(rule.tolerance),
  checkpointRules: rule.checkpoint_rules,
});

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (request.method !== "POST") {
    return errorResponse("Only POST requests are supported", 405);
  }

  try {
    const { user, admin } = await requireUser(request);
    const rawBody = await readJsonBody(request);
    if (!isRecord(rawBody)) {
      return errorResponse("Request body must be a JSON object", 400);
    }
    const body = rawBody;

    if (
      (body.trackId !== undefined && body.trackId !== null &&
        (typeof body.trackId !== "string" || !body.trackId.trim())) ||
      (body.difficulty !== undefined && body.difficulty !== null &&
        (typeof body.difficulty !== "string" || !body.difficulty.trim())) ||
      (body.trackVersion !== undefined && body.trackVersion !== null &&
        (typeof body.trackVersion !== "string" || !body.trackVersion.trim())) ||
      (body.physicsVersion !== undefined && body.physicsVersion !== null &&
        (typeof body.physicsVersion !== "string" || !body.physicsVersion.trim()))
    ) {
      return errorResponse("track and difficulty fields must be strings", 400);
    }

    const trackId = asOptionalText(body.trackId) ?? DEFAULT_TRACK_ID;
    const difficulty = (asOptionalText(body.difficulty) ?? DEFAULT_DIFFICULTY).toUpperCase();
    const trackVersion = asOptionalText(body.trackVersion);
    const physicsVersion = asOptionalText(body.physicsVersion);

    if (!/^[a-z0-9][a-z0-9_-]{0,79}$/i.test(trackId)) {
      return errorResponse("trackId is invalid", 400);
    }

    if (difficulty !== "STANDARD" && difficulty !== "PRO") {
      return errorResponse("difficulty must be STANDARD or PRO", 400);
    }

    let ruleQuery = admin
      .from("track_rules")
      .select(TRACK_RULE_SELECT)
      .eq("track_id", trackId)
      .eq("difficulty", difficulty)
      .eq("active", true);

    if (trackVersion) {
      ruleQuery = ruleQuery.eq("track_version", trackVersion);
    }
    if (physicsVersion) {
      ruleQuery = ruleQuery.eq("physics_version", physicsVersion);
    }

    const { data: rule, error: ruleError } = await ruleQuery.maybeSingle();
    if (ruleError) {
      console.error("Unable to load active track rule", ruleError);
      return errorResponse("Unable to load the active track rule", 500);
    }
    if (!rule) {
      return errorResponse("No active track rule matches the requested circuit", 404);
    }

    const trackRules = makeRulesSnapshot(rule as Record<string, unknown>);
    const sessionToken = generateSessionToken();
    const sessionTokenHash = await sha256Hex(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    const { data: session, error: sessionError } = await admin
      .from("race_sessions")
      .insert({
        user_id: user.id,
        track_rule_id: trackRules.id,
        session_token_hash: sessionTokenHash,
        track_rules_snapshot: trackRules,
        expires_at: expiresAt,
      })
      .select("id, expires_at, started_at")
      .single();

    if (sessionError || !session) {
      console.error("Unable to create race session", sessionError);
      return errorResponse("Unable to start the race", 500);
    }

    return jsonResponse({
      sessionId: session.id,
      sessionToken,
      trackId: trackRules.trackId,
      trackVersion: trackRules.trackVersion,
      physicsVersion: trackRules.physicsVersion,
      difficulty: trackRules.difficulty,
      startedAt: session.started_at,
      expiresAt: session.expires_at,
      rules: trackRules,
    }, 201);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, error.status);
    }

    console.error("Unexpected start-race error", error);
    return errorResponse("Unable to start the race", 500);
  }
});
