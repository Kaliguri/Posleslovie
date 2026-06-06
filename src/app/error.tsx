"use client";

import { useEffect } from "react";

import { reportError } from "@/shared/lib/report-error";

export default function Error({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    reportError(error, { boundary: "app/error", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">Что-то пошло не так</h1>
      <p className="mt-3 max-w-[480px] text-base leading-[1.6] text-[#475569]">
        Произошла ошибка при загрузке страницы. Попробуйте обновить — если проблема повторится,
        свяжитесь с нами по телефону или в мессенджере.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#e8c880] px-6 py-3 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf]"
      >
        Попробовать снова
      </button>
    </div>
  );
}
