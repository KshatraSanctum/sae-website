import { AuthError, requireUser } from "../_shared/server.ts";
import { optionsResponse } from "../_shared/cors.ts";
import { isRecord, readJsonBody } from "../_shared/input.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVAILABILITY_OPTIONS = new Set([
  "2-4 hours per week",
  "5-8 hours per week",
  "8+ hours per week",
  "Depends on academic schedule",
]);

const readRequiredText = (
  body: Record<string, unknown>,
  key: string,
  minLength: number,
  maxLength: number,
): string | null => {
  const value = body[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength ? trimmed : null;
};

const readOptionalText = (
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
): string | null => {
  const value = body[key];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
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

    const name = readRequiredText(rawBody, "name", 2, 120);
    const roll = readRequiredText(rawBody, "roll", 1, 80);
    const branch = readRequiredText(rawBody, "branch", 1, 100);
    const year = readRequiredText(rawBody, "year", 1, 100);
    const phone = readRequiredText(rawBody, "phone", 5, 40);
    const crew = readRequiredText(rawBody, "crew", 1, 120);
    const subdomain = readRequiredText(rawBody, "subdomain", 0, 120);
    const skills = readOptionalText(rawBody, "skills", 3000);
    const availability = readRequiredText(rawBody, "availability", 1, 80);
    const motivation = readRequiredText(rawBody, "motivation", 20, 3000);
    const whatsappConsent = rawBody.whatsappConsent === true;

    if (!name || !roll || !branch || !year || !phone || !crew || skills === null || !availability || !motivation) {
      return errorResponse("Please complete all required application fields", 400);
    }
    if (!AVAILABILITY_OPTIONS.has(availability)) {
      return errorResponse("Please select a valid weekly availability option", 400);
    }
    if (!whatsappConsent) {
      return errorResponse("Please agree to WhatsApp contact for induction updates", 400);
    }

    const { data: authUserData, error: authUserError } = await admin.auth.admin.getUserById(user.id);
    if (authUserError) {
      console.error("Unable to read authenticated Google account", authUserError);
      return errorResponse("Unable to read the signed-in Google account", 500);
    }

    const email = authUserData.user?.email?.trim() ?? "";
    if (!email) {
      return errorResponse("Your Google account does not provide an email address", 400);
    }
    if (!EMAIL_PATTERN.test(email)) {
      return errorResponse("email must be a valid email address", 400);
    }

    const { data: application, error: applicationError } = await admin
      .from("join_applications")
      .upsert({
        user_id: user.id,
        name,
        roll,
        branch,
        year,
        email,
        phone,
        crew,
        subdomain: subdomain ?? "",
        skills,
        availability,
        motivation,
        whatsapp_consent: whatsappConsent,
        status: "pending",
      }, { onConflict: "user_id" })
      .select("id, status, created_at, updated_at")
      .single();

    if (applicationError || !application) {
      console.error("Unable to store join application", applicationError);
      return errorResponse("Unable to save your society application", 500);
    }

    return jsonResponse({
      applicationId: application.id,
      status: application.status,
      submittedAt: application.updated_at ?? application.created_at,
    }, 200);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, error.status);
    }

    console.error("Unexpected submit-join-application error", error);
    return errorResponse("Unable to save your society application", 500);
  }
});
