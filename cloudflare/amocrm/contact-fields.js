import { amoRequest } from "./client.js";

const contactsFieldCache = new Map();

async function getContactsFieldMeta(token, amoBaseUrl) {
  const cacheKey = `${amoBaseUrl}`;
  if (contactsFieldCache.has(cacheKey)) {
    return contactsFieldCache.get(cacheKey);
  }

  const response = await amoRequest("/api/v4/contacts/custom_fields", token, null, {
    method: "GET",
    defaultBaseUrl: amoBaseUrl,
  });

  const fields = response?._embedded?.custom_fields ?? [];
  const meta = {
    phoneField: fields.find((field) => field?.code === "PHONE") ?? null,
    emailField: fields.find((field) => field?.code === "EMAIL") ?? null,
  };

  contactsFieldCache.set(cacheKey, meta);
  return meta;
}

function pickEnumCode(field, preferredCode) {
  const enums = field?.enums;
  if (!Array.isArray(enums) || enums.length === 0) {
    return undefined;
  }

  if (enums.some((item) => item?.value === preferredCode)) {
    return preferredCode;
  }

  return enums[0]?.value;
}

function buildMultitextValue(value, enumCode) {
  if (!value) {
    return null;
  }

  return enumCode ? { value, enum_code: enumCode } : { value };
}

export async function buildContactFields(formValues, token, amoBaseUrl) {
  const phone = formValues.phone?.trim();
  const email = formValues.email?.trim();

  if (!phone && !email) {
    return [];
  }

  try {
    const { phoneField, emailField } = await getContactsFieldMeta(token, amoBaseUrl);
    const phoneEnum = pickEnumCode(phoneField, "WORK");
    const emailEnum = pickEnumCode(emailField, "WORK");

    const fields = [];

    if (phone && phoneField) {
      fields.push({
        field_code: "PHONE",
        values: [buildMultitextValue(phone, phoneEnum)].filter(Boolean),
      });
    }

    if (email && emailField) {
      fields.push({
        field_code: "EMAIL",
        values: [buildMultitextValue(email, emailEnum)].filter(Boolean),
      });
    }

    return fields;
  } catch (error) {
    console.warn("Failed to resolve contact field metadata, using fallback mapping", error);
    return [
      phone
        ? {
            field_code: "PHONE",
            values: [{ value: phone, enum_code: "WORK" }],
          }
        : null,
      email
        ? {
            field_code: "EMAIL",
            values: [{ value: email, enum_code: "WORK" }],
          }
        : null,
    ].filter(Boolean);
  }
}
