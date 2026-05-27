const AMO_CRM_BASE_URL = "https://kailgurika.amocrm.ru";
const ALLOWED_ORIGIN = "https://posleslovie.online";
const PRODUCT_PRICE = 999;
const MAX_LOGO_FILE_SIZE = 3 * 1024 * 1024;
const AMO_OAUTH_TOKEN_URL = `${AMO_CRM_BASE_URL}/oauth2/access_token`;

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

function addLineIfValue(lines, label, value) {
  if (value) {
    lines.push(`${label}: ${value}`);
  }
}

function buildOrderNote({ tab, quantity, total, formValues }) {
  const isCompanyOrder = tab === "company";
  const lines = [
    "Заказ с сайта Posleslovie",
    "",
    "1. Детали заказа",
    `Тип заказа: ${isCompanyOrder ? "Для компании" : "Для себя"}`,
    "Товар: Бомбочка для ванны",
    `Количество: ${quantity} шт.`,
    `Цена за 1 шт.: ${PRODUCT_PRICE} руб.`,
    `Сумма: ${total} руб.`,
    "",
    "2. Контакты",
    `Имя: ${formValues.name}`,
    `Телефон: ${formValues.phone}`,
    `Email: ${formValues.email}`,
  ];

  if (formValues.contactMethod) {
    lines.push(`Предпочтительный способ связи: ${getContactMethodLabel(formValues.contactMethod)}`);
  }

  if (formValues.contactMethod === "tg") {
    addLineIfValue(lines, "Ник (TG)", formValues.contactHandle);
  }

  if (isCompanyOrder) {
    lines.push("", "3. Компания");
    addLineIfValue(lines, "Компания", formValues.company);
    addLineIfValue(lines, "ИНН", formValues.inn);
    addLineIfValue(lines, "ОГРН", formValues.ogrn);
  } else {
    lines.push("", "3. Доставка");
    addLineIfValue(lines, "Город доставки", formValues.city);
  }

  lines.push("", "4. Пожелания");
  addLineIfValue(lines, "Цвет сургучной печати", formValues.sealColor);
  addLineIfValue(lines, "Художник", formValues.artist);
  addLineIfValue(lines, "Комментарий", formValues.comment);

  return lines.join("\n");
}

async function amoRequest(path, token, body, options = {}) {
  const response = await fetch(`${options.baseUrl ?? AMO_CRM_BASE_URL}${path}`, {
    method: options.method ?? "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`AmoCRM ${path} failed with ${response.status}: ${text}`);
  }

  return data;
}

async function getAmoOAuthAccessToken(env) {
  if (!env.AmoClientId || !env.AmoClientSecret || !env.AmoRefreshToken) {
    throw new Error(
      "AmoCRM OAuth secrets are not configured. Expected AmoClientId, AmoClientSecret and AmoRefreshToken.",
    );
  }

  const response = await fetch(AMO_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.AmoClientId,
      client_secret: env.AmoClientSecret,
      grant_type: "refresh_token",
      refresh_token: env.AmoRefreshToken,
    }),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`AmoCRM token refresh failed with ${response.status}: ${text}`);
  }

  if (!data?.access_token) {
    throw new Error("AmoCRM token refresh response does not contain access_token.");
  }

  if (data?.refresh_token && data.refresh_token !== env.AmoRefreshToken) {
    console.warn(
      "AmoCRM returned a new refresh token. Update AmoRefreshToken secret in Cloudflare to avoid future auth issues.",
    );
  }

  return data.access_token;
}

async function getAmoCRMDriveUrl(token) {
  const account = await amoRequest("/api/v4/account?with=drive_url", token, null, { method: "GET" });
  const driveUrl = account?.drive_url ?? account?._links?.drive_url?.href;

  if (!driveUrl) {
    throw new Error("AmoCRM drive_url was not found. Check Files Access scope for the integration.");
  }

  return driveUrl.replace(/\/$/, "");
}

function decodeBase64File(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function validateLogoFile(logoFile) {
  if (!logoFile) {
    return;
  }

  if (!["image/jpeg", "image/png"].includes(logoFile.type)) {
    throw new Error("Logo file must be JPG or PNG.");
  }

  if (!logoFile.size || logoFile.size > MAX_LOGO_FILE_SIZE) {
    throw new Error("Logo file must be no larger than 3 MB.");
  }

  if (!logoFile.base64) {
    throw new Error("Logo file content is empty.");
  }
}

async function uploadLogoFileToAmoCRM(logoFile, token) {
  validateLogoFile(logoFile);

  const driveUrl = await getAmoCRMDriveUrl(token);
  const session = await amoRequest(
    "/v1.0/sessions",
    token,
    {
      file_name: logoFile.name,
      file_size: logoFile.size,
      content_type: logoFile.type,
      with_preview: true,
    },
    { baseUrl: driveUrl },
  );

  const bytes = decodeBase64File(logoFile.base64);
  const maxPartSize = session.max_part_size || bytes.length;
  let uploadUrl = session.upload_url;
  let uploadedFile = null;

  for (let offset = 0; offset < bytes.length; offset += maxPartSize) {
    const chunk = bytes.slice(offset, Math.min(offset + maxPartSize, bytes.length));
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": logoFile.type,
      },
      body: chunk,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(`AmoCRM file upload failed with ${response.status}: ${text}`);
    }

    if (data?.uuid) {
      uploadedFile = data;
    } else if (data?.next_url) {
      uploadUrl = data.next_url;
    }
  }

  if (!uploadedFile?.uuid) {
    throw new Error("AmoCRM file upload did not return file uuid.");
  }

  return uploadedFile;
}

function getLeadId(createdLeadResponse) {
  if (Array.isArray(createdLeadResponse)) {
    return createdLeadResponse[0]?.id;
  }

  return createdLeadResponse?._embedded?.leads?.[0]?.id ?? createdLeadResponse?.id;
}

async function createAmoCRMCheckout(payload, token) {
  const { tab, quantity, total, formValues, logoFile } = payload;
  const isCompanyOrder = tab === "company";
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
      name: `${isCompanyOrder ? "B2B" : "B2C"} заказ с сайта: Бомбочка для ванны x${quantity}${
        isCompanyOrder && formValues.company ? `, ${formValues.company}` : ""
      }`,
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

  if (logoFile) {
    const uploadedFile = await uploadLogoFileToAmoCRM(logoFile, token);
    await amoRequest(`/api/v4/leads/${leadId}/notes`, token, [
      {
        note_type: "attachment",
        params: {
          file_uuid: uploadedFile.uuid,
          version_uuid: uploadedFile.version_uuid,
          file_name: logoFile.name,
        },
      },
    ]);
  }

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

    try {
      const payload = await request.json();

      if (!payload?.formValues || !payload?.quantity || !payload?.total) {
        return jsonResponse({ error: "Invalid checkout payload" }, 400, origin);
      }

      const accessToken = await getAmoOAuthAccessToken(env);
      const result = await createAmoCRMCheckout(payload, accessToken);
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
