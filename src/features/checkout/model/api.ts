import type { AmoCRMCheckoutPayload, AmoCRMLeadPayload } from "./types";

const amoCRMWorkerUrl =
  process.env.NEXT_PUBLIC_AMOCRM_WORKER_URL ?? "https://posleslovie-amocrm.kailgurika.workers.dev/";

export async function submitCheckoutToAmoCRM(payload: AmoCRMCheckoutPayload) {
  const response = await fetch(amoCRMWorkerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AmoCRM worker rejected checkout request: ${response.status}`);
  }
}

export async function submitLeadToAmoCRM(payload: AmoCRMLeadPayload) {
  const response = await fetch(amoCRMWorkerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AmoCRM worker rejected lead request: ${response.status}`);
  }
}
