import { ALLOWED_ORIGIN, ALLOWED_ORIGINS } from "./constants.js";

function resolveAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGIN;
}

export function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": resolveAllowedOrigin(origin),
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export function jsonResponse(body, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
