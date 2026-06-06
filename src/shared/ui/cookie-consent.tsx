"use client";

import { useEffect, useState } from "react";

import { env } from "@/shared/config/env";
import { withBasePath } from "@/shared/config/seo";
import { YandexMetrica } from "@/shared/ui/yandex-metrica";

const STORAGE_KEY = "posleslovie:cookie-consent";

type Consent = "accepted" | "declined";

/**
 * Cookie/analytics consent gate. Yandex.Metrica (which sets cookies) loads only after the user
 * accepts. Renders nothing when no Metrica counter is configured — there is nothing to consent to.
 */
export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "declined") {
        setConsent(stored);
      }
      setResolved(true);
    });
  }, []);

  const choose = (value: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage failures (private mode etc.)
    }
    setConsent(value);
  };

  if (!env.yandexMetricaId) {
    return null;
  }

  return (
    <>
      {consent === "accepted" ? <YandexMetrica /> : null}
      {resolved && consent === null ? (
        <div
          role="dialog"
          aria-label="Согласие на использование cookie"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[640px] rounded-2xl border border-[#e8c880] bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-5"
        >
          <p className="text-sm leading-[1.55] text-[#0f172a]">
            Мы используем cookie и сервис аналитики, чтобы улучшать сайт. Продолжая, вы соглашаетесь
            с обработкой данных согласно{" "}
            <a
              href={withBasePath("/images/documents/privacy.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-[#b08a35] underline-offset-2 hover:text-[#b08a35]"
            >
              политике конфиденциальности
            </a>
            .
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => choose("declined")}
              className="rounded-full border border-[#cbd5e1] px-5 py-2 text-sm font-bold text-[#0f172a] transition hover:bg-[#f1f5f9]"
            >
              Только необходимые
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full bg-[#e8c880] px-5 py-2 text-sm font-bold text-[#0f172a] transition hover:bg-[#ffecbf]"
            >
              Принять
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
