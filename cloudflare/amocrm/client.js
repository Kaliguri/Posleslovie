export function parseJsonResponse(text, context) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`AmoCRM ${context} returned a non-JSON response: ${text}`);
  }
}

export async function amoRequest(path, token, body, options = {}) {
  const baseUrl = options.baseUrl ?? options.defaultBaseUrl;
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`AmoCRM ${path} failed with ${response.status}: ${text}`);
  }

  return parseJsonResponse(text, path);
}

export function resolveAmoCRMBaseUrl(env) {
  const configuredValue = env.AmoBaseUrl?.trim();

  if (!configuredValue) {
    throw new Error("AmoBaseUrl is not configured.");
  }

  const withProtocol = /^https?:\/\//i.test(configuredValue)
    ? configuredValue
    : `https://${configuredValue}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    throw new Error(
      `AmoBaseUrl is invalid: "${configuredValue}". Expected value like "https://example.amocrm.ru".`,
    );
  }
}
