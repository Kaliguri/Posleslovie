const SUPPORTED_PROVIDERS = ["github", "gitlab"];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {{
 *   provider?: string;
 *   token?: string;
 *   error?: string;
 *   errorCode?: string;
 * }} args
 */
function outputAuthHTML({ provider = "unknown", token = "", error = "", errorCode = "" }) {
  const state = error ? "error" : "success";
  const content = error ? { provider, error, errorCode } : { provider, token };

  return new Response(
    `<!doctype html><html><body><script>
(() => {
  window.addEventListener("message", ({ data, origin }) => {
    if (data === "authorizing:${provider}") {
      window.opener?.postMessage(
        "authorization:${provider}:${state}:${JSON.stringify(content)}",
        origin,
      );
    }
  });
  window.opener?.postMessage("authorizing:${provider}", "*");
})();
</script></body></html>`,
    {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Set-Cookie": "csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure",
      },
    },
  );
}

function createCsrfToken() {
  let token = "";
  for (let i = 0; i < 32; i += 1) {
    token += Math.floor(Math.random() * 16).toString(16);
  }
  return token;
}

function isAllowedDomain(domain, allowedDomains) {
  if (!allowedDomains) {
    return true;
  }

  return allowedDomains.split(",").some((entry) =>
    (domain ?? "").match(
      new RegExp(`^${escapeRegExp(entry.trim()).replace("\\*", ".+")}$`),
    ),
  );
}

async function handleCmsAuth(request, env) {
  const { origin, searchParams } = new URL(request.url);
  const { provider, site_id: domain } = Object.fromEntries(searchParams);

  if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
    return outputAuthHTML({
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!isAllowedDomain(domain, env.ALLOWED_DOMAINS)) {
    return outputAuthHTML({
      provider,
      error: "Your domain is not allowed to use the authenticator.",
      errorCode: "UNSUPPORTED_DOMAIN",
    });
  }

  const csrfToken = createCsrfToken();

  if (provider === "github") {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return outputAuthHTML({
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }

    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      scope: "repo,user",
      state: csrfToken,
    });

    const authURL = `https://${env.GITHUB_HOSTNAME ?? "github.com"}/login/oauth/authorize?${params.toString()}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: authURL,
        "Set-Cookie":
          `csrf-token=${provider}_${csrfToken}; ` +
          "HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure",
      },
    });
  }

  if (provider === "gitlab") {
    if (!env.GITLAB_CLIENT_ID || !env.GITLAB_CLIENT_SECRET) {
      return outputAuthHTML({
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }

    const params = new URLSearchParams({
      client_id: env.GITLAB_CLIENT_ID,
      redirect_uri: `${origin}/callback`,
      response_type: "code",
      scope: "api",
      state: csrfToken,
    });

    const authURL = `https://${env.GITLAB_HOSTNAME ?? "gitlab.com"}/oauth/authorize?${params.toString()}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: authURL,
        "Set-Cookie":
          `csrf-token=${provider}_${csrfToken}; ` +
          "HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure",
      },
    });
  }

  return outputAuthHTML({
    provider,
    error: "Your Git backend is not supported by the authenticator.",
    errorCode: "UNSUPPORTED_BACKEND",
  });
}

async function handleCmsCallback(request, env) {
  const { origin, searchParams } = new URL(request.url);
  const { code, state } = Object.fromEntries(searchParams);

  const [, provider, csrfToken] =
    request.headers.get("Cookie")?.match(/\bcsrf-token=([a-z-]+?)_([0-9a-f]{32})\b/) ?? [];

  if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
    return outputAuthHTML({
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!code || !state) {
    return outputAuthHTML({
      provider,
      error: "Failed to receive an authorization code. Please try again later.",
      errorCode: "AUTH_CODE_REQUEST_FAILED",
    });
  }

  if (!csrfToken || state !== csrfToken) {
    return outputAuthHTML({
      provider,
      error: "Potential CSRF attack detected. Authentication flow aborted.",
      errorCode: "CSRF_DETECTED",
    });
  }

  let tokenURL = "";
  let requestBody = {};

  if (provider === "github") {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return outputAuthHTML({
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }

    tokenURL = `https://${env.GITHUB_HOSTNAME ?? "github.com"}/login/oauth/access_token`;
    requestBody = {
      code,
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
    };
  }

  if (provider === "gitlab") {
    if (!env.GITLAB_CLIENT_ID || !env.GITLAB_CLIENT_SECRET) {
      return outputAuthHTML({
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }

    tokenURL = `https://${env.GITLAB_HOSTNAME ?? "gitlab.com"}/oauth/token`;
    requestBody = {
      code,
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: `${origin}/callback`,
    };
  }

  let response;

  try {
    response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    return outputAuthHTML({
      provider,
      error: "Failed to request an access token. Please try again later.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  let token = "";
  let error = "";

  try {
    ({ access_token: token, error } = await response.json());
  } catch {
    return outputAuthHTML({
      provider,
      error: "Server responded with malformed data. Please try again later.",
      errorCode: "MALFORMED_RESPONSE",
    });
  }

  return outputAuthHTML({ provider, token, error });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const { method } = request;

    if (method === "GET" && ["/auth", "/oauth/authorize"].includes(pathname)) {
      return handleCmsAuth(request, env);
    }

    if (method === "GET" && ["/callback", "/oauth/redirect"].includes(pathname)) {
      return handleCmsCallback(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};
