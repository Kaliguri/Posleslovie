import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  API_KEY_ADMIN: z.string().min(10),
  API_KEY_MANAGER: z.string().min(10),
  MEDIA_BUCKET_PUBLIC_URL: z.string().url(),
  PAYMENT_PROVIDER: z.enum(["mock", "yookassa_like"]).default("mock"),
  REDIS_URL: z.string().url().optional(),
  AMOCRM_WEBHOOK_URL: z.string().url().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  return envSchema.parse(config);
}
