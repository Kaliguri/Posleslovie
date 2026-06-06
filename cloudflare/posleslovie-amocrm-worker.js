import { ALLOWED_ORIGIN } from "./amocrm/constants.js";
import { corsHeaders, jsonResponse } from "./amocrm/cors.js";
import { resolveAmoCRMBaseUrl } from "./amocrm/client.js";
import { createAmoCRMCheckout } from "./amocrm/checkout.js";
import { createAmoCRMLead } from "./amocrm/lead.js";
import { validateCheckoutPayload, validateLeadPayload } from "./amocrm/validate.js";
import { verifyTurnstile } from "./amocrm/turnstile.js";

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

    if (!env.AmoBaseUrl) {
      return jsonResponse({ error: "AmoBaseUrl is not configured" }, 500, origin);
    }

    try {
      const amoBaseUrl = resolveAmoCRMBaseUrl(env);
      const payload = await request.json();

      // Bot protection: only enforced when a Turnstile secret is configured.
      if (env.TurnstileSecret) {
        const isHuman = await verifyTurnstile(
          payload?.turnstileToken,
          env.TurnstileSecret,
          request.headers.get("CF-Connecting-IP"),
        );
        if (!isHuman) {
          return jsonResponse({ error: "Turnstile verification failed" }, 403, origin);
        }
      }

      if (payload?.mode === "lead") {
        const leadError = validateLeadPayload(payload);
        if (leadError) {
          return jsonResponse({ error: leadError }, 400, origin);
        }
        const result = await createAmoCRMLead(payload.formValues, env.AmoToken, amoBaseUrl);
        return jsonResponse({ ok: true, ...result }, 200, origin);
      }

      const checkoutError = validateCheckoutPayload(payload);
      if (checkoutError) {
        return jsonResponse({ error: checkoutError }, 400, origin);
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
