import { amoRequest } from "./client.js";
import { buildContactFields } from "./contact-fields.js";

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

function getLeadId(createdLeadResponse) {
  if (Array.isArray(createdLeadResponse)) {
    return createdLeadResponse[0]?.id;
  }

  return createdLeadResponse?._embedded?.leads?.[0]?.id ?? createdLeadResponse?.id;
}

export async function createAmoCRMLead(formValues, token, amoBaseUrl) {
  const contactFields = await buildContactFields(formValues, token, amoBaseUrl);

  const createdLeadResponse = await amoRequest(
    "/api/v4/leads/complex",
    token,
    [
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
    ],
    { defaultBaseUrl: amoBaseUrl },
  );

  const leadId = getLeadId(createdLeadResponse);

  if (!leadId) {
    return { leadId: null, warning: "Lead created, but lead id was not found." };
  }

  await amoRequest(
    `/api/v4/leads/${leadId}/notes`,
    token,
    [
      {
        note_type: "common",
        params: {
          text: buildLeadNote(formValues),
        },
      },
    ],
    { defaultBaseUrl: amoBaseUrl },
  );

  return { leadId };
}
