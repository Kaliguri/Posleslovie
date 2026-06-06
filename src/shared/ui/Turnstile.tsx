"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import { env } from "@/shared/config/env";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile bot-protection widget.
 *
 * Renders nothing when no site key is configured, so the forms keep working unchanged until
 * Turnstile is set up (the worker likewise only enforces verification when its secret is set).
 * `onVerify` receives the token on success and "" when it expires or errors.
 */
export function Turnstile({ onVerify }: Readonly<{ onVerify: (token: string) => void }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: env.turnstileSiteKey,
      callback: (token) => onVerify(token),
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
  }, [onVerify]);

  useEffect(() => {
    if (scriptReady) {
      renderWidget();
    }
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, renderWidget]);

  if (!env.turnstileEnabled) {
    return null;
  }

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
