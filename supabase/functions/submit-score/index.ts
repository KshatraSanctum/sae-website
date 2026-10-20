import { AuthError, requireUser } from "../_shared/server.ts";
import { optionsResponse } from "../_shared/cors.ts";
import { sha256Hex } from "../_shared/hash.ts";
import { isRecord, readJsonBody } from "../_shared/input.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";

const MAX_LAP_MS = 15 * 60 * 1000;
const CHECKPOINT_IDS = ["s1", "s2", "s3"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type CheckpointId = (typeof CHECKPOINT_IDS)[number];

type RulesSnapshot = {
  minLapMs: number;
  minCheckpointMs: number;
  checkpointRules?: unknown;
};

type CheckpointValue = {
  elapsedMs: number;
  progressPct?: number;
};

type CheckpointValidation = {
  status: "accepted" | "flagged" | "pending";
  reason: string | null;
  normalized: Record<string, CheckpointValue> | null;
};

const asSafeInteger = (value: unknown): number | null => {
  const num = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof num === "number" && Number.isFinite(num)) {
    const rounded = Math.round(num);
    return Number.isSafeInteger(rounded) ? rounded : null;
  }
  return null;
};

const asFiniteNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const normalizeCheckpointInput = (value: unknown): Record<string, unknown> | null => {
  if (Array.isArray(value)) {
    if (value.length !== CHECKPOINT_IDS.length) {
      return null;
    }
    return Object.fromEntries(CHECKPOINT_IDS.map((id, index) => [id, value[index]]));
  }

  return isRecord(value) ? value : null;
};

const readCheckpointValue = (value: unknown): CheckpointValue | null => {
  if (typeof value === "number" || typeof value === "string") {
    const elapsedMs = asSafeInteger(value);
    return elapsedMs === null || elapsedMs < 0 ? null : { elapsedMs };
  }

  if (!isRecord(value)) {
    return null;
  }

  const elapsedMs = asSafeInteger(value.elapsedMs ?? value.timeMs ?? value.time);
  if (elapsedMs === null || elapsedMs < 0) {
    return null;
  }

  const rawProgress = value.progressPct ?? value.progress;
  if (rawProgress === undefined) {
    return { elapsedMs };
  }

  const progressPct = asFiniteNumber(rawProgress);
  if (progressPct === null || progressPct < 0 || progressPct > 1.04) {
    return null;
  }

  return { elapsedMs, progressPct };
};

const checkpointWindow = (rules: RulesSnapshot, id: CheckpointId): { start: number; end: number } | null => {
  if (!isRecord(rules.checkpointRules) || !isRecord(rules.checkpointRules[id])) {
    return null;
  }

  const rule = rules.checkpointRules[id];
  const start = asFiniteNumber(rule.startPct ?? rule.start ?? rule.min);
  const end = asFiniteNumber(rule.endPct ?? rule.end ?? rule.max);
  return start !== null && end !== null && start <= end ? { start, end } : null;
};

const validateCheckpointTimes = (
  rawValue: unknown,
  rules: RulesSnapshot,
  lapMs: number,
): CheckpointValidation | { invalid: string } => {
  if (rawValue === undefined || rawValue === null) {
    return {
      status: "pending",
      reason: "checkpoint_times_missing",
      normalized: null,
    };
  }

  const input = normalizeCheckpointInput(rawValue);
  if (!input) {
    return { invalid: "checkpointTimes must be an object or an array of three checkpoints" };
  }

  const normalized: Record<string, CheckpointValue> = {};
  const suspiciousReasons: string[] = [];

  for (const id of CHECKPOINT_IDS) {
    const checkpoint = readCheckpointValue(input[id]);
    if (!checkpoint) {
      if (input[id] === undefined) {
        suspiciousReasons.push(`${id}_missing`);
        continue;
      }
      return { invalid: `${id} checkpoint time is invalid` };
    }
    normalized[id] = checkpoint;
  }

  const s1 = normalized.s1;
  const s2 = normalized.s2;
  const s3 = normalized.s3;

  if (!s1 || !s2 || !s3) {
    suspiciousReasons.push("checkpoint_times_incomplete");
  } else {
    if (s1.elapsedMs >= s2.elapsedMs || s2.elapsedMs >= s3.elapsedMs) {
      suspiciousReasons.push("checkpoint_times_not_increasing");
    }

    if (
      s1.elapsedMs < rules.minCheckpointMs ||
      s2.elapsedMs - s1.elapsedMs < rules.minCheckpointMs ||
      s3.elapsedMs - s2.elapsedMs < rules.minCheckpointMs
    ) {
      suspiciousReasons.push("checkpoint_spacing_too_short");
    }

    if (s3.elapsedMs > lapMs) {
      suspiciousReasons.push("checkpoint_after_lap");
    }
  }

  for (const id of CHECKPOINT_IDS) {
    const checkpoint = normalized[id];
    if (checkpoint?.progressPct === undefined) {
      continue;
    }

    const window = checkpointWindow(rules, id);
    if (window && (checkpoint.progressPct < window.start || checkpoint.progressPct > window.end)) {
      suspiciousReasons.push(`${id}_progress_out_of_window`);
    }
  }

  return {
    status: suspiciousReasons.length > 0 ? "flagged" : "accepted",
    reason: suspiciousReasons.length > 0 ? suspiciousReasons.join(",") : null,
    normalized,
  };
};

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

    const sessionId = typeof rawBody.sessionId === "string" ? rawBody.sessionId.trim() : "";
    const sessionToken = typeof rawBody.sessionToken === "string" ? rawBody.sessionToken.trim() : "";
    const lapMs = asSafeInteger(rawBody.lapMs);

    if (!sessionId || !sessionToken) {
      return errorResponse("sessionId and sessionToken are required", 400);
    }
    if (!UUID_PATTERN.test(sessionId)) {
      return errorResponse("sessionId must be a UUID", 400);
    }
    if (lapMs === null) {
      return errorResponse("lapMs must be an integer number of milliseconds", 400);
    }

    const { data: session, error: sessionError } = await admin
      .from("race_sessions")
      .select("id, user_id, track_rule_id, session_token_hash, track_rules_snapshot, status, expires_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (sessionError) {
      console.error("Unable to load race session", sessionError);
      return errorResponse("Unable to load the race session", 500);
    }
    if (!session) {
      return errorResponse("Race session not found", 404);
    }

    const suppliedTokenHash = await sha256Hex(sessionToken);
    if (suppliedTokenHash !== session.session_token_hash) {
      return errorResponse("Race session token is invalid", 401);
    }

    if (session.status !== "active") {
      return errorResponse("Race session is no longer active", 409);
    }

    const expiresAt = Date.parse(session.expires_at);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      await admin
        .from("race_sessions")
        .update({ status: "expired" })
        .eq("id", session.id)
        .eq("status", "active");
      return errorResponse("Race session has expired", 410);
    }

    const rules = session.track_rules_snapshot as RulesSnapshot;
    if (
      !rules ||
      !Number.isSafeInteger(rules.minLapMs) ||
      !Number.isSafeInteger(rules.minCheckpointMs)
    ) {
      console.error("Race session has an invalid rules snapshot", session.id);
      return errorResponse("Race session rules are invalid", 500);
    }

    if (lapMs < rules.minLapMs || lapMs > MAX_LAP_MS) {
      return errorResponse(
        `lapMs must be between ${rules.minLapMs} and ${MAX_LAP_MS} milliseconds`,
        400,
      );
    }

    const checkpointValidation = validateCheckpointTimes(rawBody.checkpointTimes, rules, lapMs);
    if ("invalid" in checkpointValidation) {
      return errorResponse(checkpointValidation.invalid, 400);
    }

    let metadata: Record<string, unknown> = {};
    if (rawBody.metadata !== undefined) {
      if (!isRecord(rawBody.metadata)) {
        return errorResponse("metadata must be a JSON object", 400);
      }
      metadata = rawBody.metadata;
    }

    const { data: submission, error: submissionError } = await admin
      .from("score_submissions")
      .insert({
        race_session_id: session.id,
        user_id: user.id,
        track_rule_id: session.track_rule_id,
        lap_ms: lapMs,
        checkpoint_times: checkpointValidation.normalized,
        metadata,
        validation_status: checkpointValidation.status,
        validation_reason: checkpointValidation.reason,
      })
      .select("id, validation_status, created_at")
      .single();

    if (submissionError || !submission) {
      console.error("Unable to store score submission", submissionError);
      return errorResponse("Unable to submit the score", 500);
    }

    const { error: completionError } = await admin
      .from("race_sessions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", session.id)
      .eq("status", "active");
    if (completionError) {
      console.error("Score stored but race session could not be completed", completionError);
    }

    return jsonResponse({
      submissionId: submission.id,
      status: submission.validation_status,
      lapMs,
      createdAt: submission.created_at,
    }, 201);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, error.status);
    }

    console.error("Unexpected submit-score error", error);
    return errorResponse("Unable to submit the score", 500);
  }
});
