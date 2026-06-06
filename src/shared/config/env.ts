import { z } from "zod";

/**
 * Single, validated source of truth for public (browser-exposed) configuration.
 *
 * Each `process.env.NEXT_PUBLIC_*` is referenced literally so Next.js inlines it at build time.
 * Values are format-checked with Zod: misconfiguration is logged loudly in dev instead of failing
 * silently deep inside a feature (e.g. a missing worker URL only surfacing when a user submits).
 * We intentionally do not throw, so a misconfigured non-critical var never white-screens the site.
 */

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

// Referenced once here so Next.js statically inlines the value into the client bundle.
const rawProductPrice = clean(process.env.NEXT_PUBLIC_PRODUCT_PRICE);

const envSchema = z.object({
  amoCRMWorkerUrl: z.union([z.string().url(), z.literal("")]),
  siteUrl: z.union([z.string().url(), z.literal("")]),
  basePath: z.string(),
  productPrice: z.number().positive().nullable(),
  yandexMetricaId: z.string().regex(/^\d*$/),
  turnstileSiteKey: z.string(),
  errorReportUrl: z.union([z.string().url(), z.literal("")]),
});

const rawEnv = {
  amoCRMWorkerUrl: clean(process.env.NEXT_PUBLIC_AMOCRM_WORKER_URL),
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  productPrice: rawProductPrice ? Number(rawProductPrice) : null,
  yandexMetricaId: clean(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID),
  turnstileSiteKey: clean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  errorReportUrl: clean(process.env.NEXT_PUBLIC_ERROR_REPORT_URL),
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success && process.env.NODE_ENV !== "production") {
  console.error(
    "[env] Invalid public environment configuration:",
    parsed.error.flatten().fieldErrors,
  );
}

const values = parsed.success ? parsed.data : rawEnv;

export const env = {
  amoCRMWorkerUrl: values.amoCRMWorkerUrl,
  siteUrl: values.siteUrl,
  basePath: values.basePath,
  productPrice: values.productPrice,
  /** Empty string when no valid numeric counter id is configured. */
  yandexMetricaId: /^\d+$/.test(values.yandexMetricaId) ? values.yandexMetricaId : "",
  turnstileSiteKey: values.turnstileSiteKey,
  errorReportUrl: values.errorReportUrl,
  /** Whether bot protection is configured on the client. */
  turnstileEnabled: values.turnstileSiteKey.length > 0,
} as const;
