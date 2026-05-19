const AMO_CRM_BASE_URL = "https://kailgurika.amocrm.ru";
const ALLOWED_ORIGIN = "https://kaliguri.github.io";
const PRODUCT_PRICE = 999;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(body, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function getContactMethodLabel(method) {
  const methods = {
    tg: "Telegram",
    max: "MAX",
  };

  return methods[method] ?? method;
}

function buildOrderNote({ tab, quantity, total, formValues }) {
  return [
    "Заказ с сайта Posleslovie",
    `Тип клиента: ${tab === "company" ? "Компания" : "Для себя"}`,
    "Товар: Бомбочка для ванны",
    `Количество: ${quantity} шт.`,
    `Цена за 1 шт.: ${PRODUCT_PRICE} руб.`,
    `Сумма: ${total} руб.`,
    "",
    `Имя: ${formValues.name || "не указано"}`,
    `Телефон: ${formValues.phone || "не указан"}`,
    `Email: ${formValues.email || "не указан"}`,
    `Компания: ${formValues.company || "не указана"}`,
    `ИНН: ${formValues.inn || "не указан"}`,
    `ОГРН: ${formValues.ogrn || "не указан"}`,
    `Предпочтительный способ связи: ${
      formValues.contactMethod ? getContactMethodLabel(formValues.contactMethod) : "не указан"
    }`,
    `Ник или номер: ${formValues.contactHandle || "не указан"}`,
    `Город доставки: ${formValues.city || "не указан"}`,
    `Цвет сургучной печати: ${formValues.sealColor || "не указан"}`,
    `Художник: ${formValues.artist || "не указан"}`,
    `Комментарий: ${formValues.comment || "не указан"}`,
  ].join("\n");
}

async function amoRequest(path, token, body) {
  const response = await fetch(`${AMO_CRM_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`AmoCRM ${path} failed with ${response.status}: ${text}`);
  }

  return data;
}

function getLeadId(createdLeadResponse) {
  if (Array.isArray(createdLeadResponse)) {
    return createdLeadResponse[0]?.id;
  }

  return createdLeadResponse?._embedded?.leads?.[0]?.id ?? createdLeadResponse?.id;
}

async function createAmoCRMCheckout(payload, token) {
  const { quantity, total, formValues } = payload;
  const contactFields = [
    formValues.phone
      ? {
          field_code: "PHONE",
          values: [{ value: formValues.phone, enum_code: "WORK" }],
        }
      : null,
    formValues.email
      ? {
          field_code: "EMAIL",
          values: [{ value: formValues.email, enum_code: "WORK" }],
        }
      : null,
  ].filter(Boolean);

  const createdLeadResponse = await amoRequest("/api/v4/leads/complex", token, [
    {
      name: `Заказ с сайта: Бомбочка для ванны x${quantity}`,
      price: total,
      _embedded: {
        contacts: [
          {
            first_name: formValues.name || "Клиент с сайта",
            custom_fields_values: contactFields,
          },
        ],
      },
    },
  ]);

  const leadId = getLeadId(createdLeadResponse);

  if (!leadId) {
    return { leadId: null, warning: "Lead created, but lead id was not found in AmoCRM response." };
  }

  await amoRequest(`/api/v4/leads/${leadId}/notes`, token, [
    {
      note_type: "common",
      params: {
        text: buildOrderNote(payload),
      },
    },
  ]);

  return { leadId };
}

const worker = {
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

    if (!env.Token22) {
      return jsonResponse({ error: "Token22 secret is not configured" }, 500, origin);
    }

    try {
      const payload = await request.json();

      if (!payload?.formValues || !payload?.quantity || !payload?.total) {
        return jsonResponse({ error: "Invalid checkout payload" }, 400, origin);
      }

      const result = await createAmoCRMCheckout(payload, env.Token22);
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

export default worker;
