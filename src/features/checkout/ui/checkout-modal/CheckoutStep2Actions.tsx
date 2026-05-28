"use client";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";

import { FieldErrorMessage, RequiredFieldsNote } from "./FormParts";

export function CheckoutStep2Actions({
  isConsentAccepted,
  onConsentChange,
  consentError,
  message,
  onProceed,
}: Readonly<{
  isConsentAccepted: boolean;
  onConsentChange: (isAccepted: boolean) => void;
  consentError?: string;
  message: string | null;
  onProceed: () => void;
}>) {
  return (
    <div className="mt-2 grid gap-3 sm:mt-0">
      <label
        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-sm leading-[1.45] sm:p-4 sm:text-base sm:leading-[1.5] ${
          consentError ? "border-red-500 bg-red-50" : "border-transparent"
        }`}
      >
        <input
          type="checkbox"
          checked={isConsentAccepted}
          onChange={(event) => onConsentChange(event.target.checked)}
          aria-invalid={Boolean(consentError)}
          aria-required="true"
          className="mt-1 h-4 w-4 shrink-0 rounded border-[#0f172a]"
        />
        <span className="min-w-0 flex-1 text-left">
          <span className="font-bold">
            Согласие с условиями
            <span className="ml-1 text-red-600" aria-label="обязательное поле">
              *
            </span>
          </span>{" "}
          Нажимая на кнопку, вы соглашаетесь с обработкой{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/documents/personal-data-consent.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#e8c880]"
          >
            персональных данных
          </a>{" "}
          и ознакомлены с{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/documents/privacy.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#e8c880]"
          >
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>
      {consentError ? <FieldErrorMessage message={consentError} /> : null}
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-10">
        <div>
          <RequiredFieldsNote />
          <button
            type="button"
            title="Schedule a call"
            onClick={onProceed}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-xl"
          >
            Договориться о созвоне
            <ArrowIcon size={22} />
          </button>
          {message ? (
            <div className="mt-3 rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a] sm:mt-4">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
