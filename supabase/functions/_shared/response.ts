import { corsHeaders } from "./cors.ts";

export const jsonResponse = (
  body: unknown,
  status = 200,
  headers: HeadersInit = {},
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });

export const errorResponse = (message: string, status: number): Response =>
  jsonResponse({ error: message }, status);
