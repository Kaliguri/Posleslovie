import type { AmoCRMCheckoutPayload, AmoCRMLeadPayload } from "./types";

function getAmoCRMWorkerUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_AMOCRM_WORKER_URL?.trim();
  if (!configuredUrl) {
    throw new Error("NEXT_PUBLIC_AMOCRM_WORKER_URL is not configured.");
  }
  return configuredUrl;
}

async function parseWorkerError(response: Response) {
  const rawBody = await response.text();
  if (!rawBody) {
    return "";
  }

  try {
    const parsed = JSON.parse(rawBody) as { error?: string; details?: string };
    return [parsed.error, parsed.details].filter(Boolean).join(" | ");
  } catch {
    return rawBody;
  }
}

async function postToAmoWorker(payload: AmoCRMCheckoutPayload | AmoCRMLeadPayload, requestType: string) {
  const amoCRMWorkerUrl = getAmoCRMWorkerUrl();
  let response: Response;

  try {
    response = await fetch(amoCRMWorkerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      `Failed to reach AmoCRM worker at ${amoCRMWorkerUrl}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    const details = await parseWorkerError(response);
    throw new Error(
      `AmoCRM worker rejected ${requestType} request: ${response.status}${details ? ` (${details})` : ""}`,
    );
  }
}

export async function submitCheckoutToAmoCRM(payload: AmoCRMCheckoutPayload) {
  await postToAmoWorker(payload, "checkout");
}

export async function submitLeadToAmoCRM(payload: AmoCRMLeadPayload) {
  await postToAmoWorker(payload, "lead");
}
