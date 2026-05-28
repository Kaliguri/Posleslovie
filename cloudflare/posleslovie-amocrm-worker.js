import { ALLOWED_ORIGIN } from "./amocrm/constants.js";
import { corsHeaders, jsonResponse } from "./amocrm/cors.js";
import { resolveAmoCRMBaseUrl } from "./amocrm/client.js";
import { createAmoCRMCheckout } from "./amocrm/checkout.js";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    if (!env.AmoToken) {
      return jsonResponse({ error: "AmoToken secret is not configured" }, 500, origin);
    }

    try {
      const amoBaseUrl = resolveAmoCRMBaseUrl(env);
      const payload = await request.json();

      if (!payload?.formValues || !payload?.quantity || !payload?.total) {
        return jsonResponse({ error: "Invalid checkout payload" }, 400, origin);
      }

      const result = await createAmoCRMCheckout(payload, env.AmoToken, amoBaseUrl);
      return jsonResponse({ ok: true, ...result }, 200, origin);
    } catch (error) {
      console.error(error);
      return jsonResponse(
        {
          error: "Failed to send checkout to AmoCRM",
          details: error instanceof Error ? error.message : String(error),
        },
        502,
        origin,
      );
    }
  },
};
