import { z } from "zod";

import siteBehaviorJson from "../../../content/site-behavior.json";

/**
 * Site-wide behavior toggles editable by the client in the CMS (content/site-behavior.json).
 * Parsed once with safe defaults so a broken value never breaks the build.
 */
const siteBehaviorSchema = z.object({
  enableScrollAnimations: z.boolean().default(true),
  enableGlobalOverlays: z.boolean().default(true),
  enableCookieConsent: z.boolean().default(false),
});

function parseSiteBehavior() {
  try {
    return siteBehaviorSchema.parse(siteBehaviorJson);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[site-behavior] failed to parse site-behavior.json", error);
    }
    return siteBehaviorSchema.parse({});
  }
}

const siteBehavior = parseSiteBehavior();

export const globalOverlaysEnabled = Boolean(siteBehavior.enableGlobalOverlays);
export const scrollAnimationsEnabled = Boolean(siteBehavior.enableScrollAnimations);
/**
 * When true, analytics load only after the visitor accepts the cookie banner (152-ФЗ friendly).
 * Off by default: the client opts in via the CMS if they want a consent gate.
 */
export const cookieConsentEnabled = Boolean(siteBehavior.enableCookieConsent);
