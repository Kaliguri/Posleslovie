import { amoRequest } from "./client.js";
import { buildContactFields } from "./contact-fields.js";
import { uploadLogoFileToAmoCRM } from "./files.js";
import { buildOrderNote } from "./order-note.js";

function getLeadId(createdLeadResponse) {
  if (Array.isArray(createdLeadResponse)) {
    return createdLeadResponse[0]?.id;
  }

  return createdLeadResponse?._embedded?.leads?.[0]?.id ?? createdLeadResponse?.id;
}

export async function createAmoCRMCheckout(payload, token, amoBaseUrl) {
  const { quantity, total, formValues, logoFile } = payload;
  const contactFields = await buildContactFields(formValues, token, amoBaseUrl);

  const createdLeadResponse = await amoRequest(
    "/api/v4/leads/complex",
    token,
    [
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
    ],
    { defaultBaseUrl: amoBaseUrl },
  );

  const leadId = getLeadId(createdLeadResponse);

  if (!leadId) {
    return { leadId: null, warning: "Lead created, but lead id was not found in AmoCRM response." };
  }

  await amoRequest(
    `/api/v4/leads/${leadId}/notes`,
    token,
    [
      {
        note_type: "common",
        params: {
          text: buildOrderNote(payload),
        },
      },
    ],
    { defaultBaseUrl: amoBaseUrl },
  );

  if (logoFile) {
    const uploadedFile = await uploadLogoFileToAmoCRM(logoFile, token, amoBaseUrl);
    await amoRequest(
      `/api/v4/leads/${leadId}/notes`,
      token,
      [
        {
          note_type: "attachment",
          params: {
            file_uuid: uploadedFile.uuid,
            version_uuid: uploadedFile.version_uuid,
            file_name: logoFile.name,
          },
        },
      ],
      { defaultBaseUrl: amoBaseUrl },
    );
  }

  return { leadId };
}
