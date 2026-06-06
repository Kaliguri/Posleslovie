import { ALLOWED_ORIGIN } from "./amocrm/constants.js";
import { buildContactFields } from "./amocrm/contact-fields.js";
import { corsHeaders, jsonResponse } from "./amocrm/cors.js";
import { resolveAmoCRMBaseUrl } from "./amocrm/client.js";
import { createAmoCRMCheckout } from "./amocrm/checkout.js";

function buildLeadNote(formValues) {
  const lines = [
    "Lead с сайта Posleslovie",
    "",
    `Имя: ${formValues.name || "-"}`,
    `Телефон: ${formValues.phone || "-"}`,
    `Email: ${formValues.email || "-"}`,
  ];

  if (formValues.company) {
    lines.push(`Компания: ${formValues.company}`);
  }
  if (formValues.contactMethod) {
    lines.push(`Предпочтительный способ связи: ${formValues.contactMethod}`);
  }
  if (formValues.contactHandle) {
    lines.push(`Данные для связи: ${formValues.contactHandle}`);
  }
  if (formValues.comment) {
    lines.push(`Комментарий: ${formValues.comment}`);
  }

  return lines.join("\n");
}

async function createAmoCRMLead(formValues, token, amoBaseUrl) {
  const contactFields = await buildContactFields(formValues, token, amoBaseUrl);

  const leadPayload = [
    {
      name: `Lead с сайта: ${formValues.name || "Новый контакт"}`,
      _embedded: {
        contacts: [
          {
            first_name: formValues.name || "Клиент с сайта",
            custom_fields_values: contactFields,
          },
        ],
      },
    },
  ];

  const createResponse = await fetch(`${amoBaseUrl}/api/v4/leads/complex`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadPayload),
  });

  if (!createResponse.ok) {
    throw new Error(`AmoCRM lead create failed: ${createResponse.status}`);
  }

  const createdLeadResponse = await createResponse.json();
  const leadId =
    createdLeadResponse?._embedded?.leads?.[0]?.id ??
    createdLeadResponse?.id ??
    (Array.isArray(createdLeadResponse) ? createdLeadResponse[0]?.id : null);

  if (!leadId) {
    return { leadId: null, warning: "Lead created, but lead id was not found." };
  }

  const noteResponse = await fetch(`${amoBaseUrl}/api/v4/leads/${leadId}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        note_type: "common",
        params: {
          text: buildLeadNote(formValues),
        },
      },
    ]),
  });

  if (!noteResponse.ok) {
    throw new Error(`AmoCRM lead note failed: ${noteResponse.status}`);
  }

  return { leadId };
}

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

      if (payload?.mode === "lead") {
        if (
          !payload?.formValues?.name ||
          !payload?.formValues?.phone ||
          !payload?.formValues?.email
        ) {
          return jsonResponse({ error: "Invalid lead payload" }, 400, origin);
        }
        const result = await createAmoCRMLead(payload.formValues, env.AmoToken, amoBaseUrl);
        return jsonResponse({ ok: true, ...result }, 200, origin);
      }

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
