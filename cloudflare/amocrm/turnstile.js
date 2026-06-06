// Cloudflare Turnstile server-side verification.
// Only enforced when a secret is configured (see the worker), so the endpoint keeps working
// before Turnstile is set up.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token, secret, remoteIp) {
  if (!token) {
    return false;
  }

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const data = await response.json();
    return Boolean(data?.success);
  } catch {
    return false;
  }
}
