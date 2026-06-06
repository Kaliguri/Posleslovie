import { env } from "@/shared/config/env";

/**
 * Report a client-side error. Always logs to the console; additionally ships a compact report to
 * NEXT_PUBLIC_ERROR_REPORT_URL when configured (e.g. a logging worker or error-tracking ingest).
 * No-op on the server and never throws.
 */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  console.error(error, context);

  if (typeof window === "undefined" || !env.errorReportUrl) {
    return;
  }

  try {
    const payload = JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(env.errorReportUrl, payload);
    } else {
      void fetch(env.errorReportUrl, { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // never let error reporting throw
  }
}
