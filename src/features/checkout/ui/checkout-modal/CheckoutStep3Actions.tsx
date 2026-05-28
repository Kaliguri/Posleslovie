"use client";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function CheckoutStep3Actions({
  isSubmitting,
  submitMessage,
  onSubmit,
}: Readonly<{
  isSubmitting: boolean;
  submitMessage: string | null;
  onSubmit: () => void;
}>) {
  return (
    <div className="mt-2 grid gap-3 sm:mt-0">
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-10">
        <div>
          <button
            type="button"
            title="Complete checkout"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-xl"
          >
            {isSubmitting ? "Отправляем..." : "Завершить оформление"}
            <ArrowIcon size={22} />
          </button>
          {submitMessage ? (
            <div className="mt-3 rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a] sm:mt-4">
              {submitMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
