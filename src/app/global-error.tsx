"use client";

import { useEffect } from "react";

import { reportError } from "@/shared/lib/report-error";

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    reportError(error, { boundary: "app/global-error", digest: error.digest });
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
          Что-то пошло не так
        </h1>
        <p style={{ marginTop: "0.75rem", maxWidth: 480, lineHeight: 1.6, color: "#475569" }}>
          Произошла непредвиденная ошибка. Попробуйте обновить страницу.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            borderRadius: 9999,
            background: "#e8c880",
            padding: "0.75rem 1.5rem",
            fontWeight: 700,
            color: "#0f172a",
            border: "none",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </body>
    </html>
  );
}
