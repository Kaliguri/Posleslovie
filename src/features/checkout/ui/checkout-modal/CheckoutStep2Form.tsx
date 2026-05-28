"use client";

import { useState } from "react";

import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutLogoFile,
  CheckoutState,
} from "@/features/checkout/model/types";
import { assetPath } from "@/shared/lib/asset-path";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { CrossIcon } from "@/shared/ui/CrossIcon";

import {
  FieldErrorMessage,
  FormErrorSummary,
  FormFieldTextarea,
  RequiredFieldsNote,
} from "./FormParts";

export function CheckoutStep2Form({
  values,
  errors,
  onFieldChange,
  logoFile,
  logoFileError,
  onLogoFileChange,
  isConsentAccepted,
  onConsentChange,
  submitMessage,
  isSubmitting,
  onSubmit,
}: Readonly<{
  values: CheckoutState["formValues"];
  errors: CheckoutErrors;
  onFieldChange: (field: CheckoutField, value: string) => void;
  logoFile: CheckoutLogoFile | null;
  logoFileError: string | null;
  onLogoFileChange: (file: File | null) => void;
  isConsentAccepted: boolean;
  onConsentChange: (isAccepted: boolean) => void;
  submitMessage: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}>) {
  const [artworkModalSrc, setArtworkModalSrc] = useState<string | null>(null);
  const sealColors = [
    { id: "red", label: "Красный", image: assetPath("/images/photos/seal-red.png") },
    { id: "gold", label: "Золотой", image: assetPath("/images/photos/seal-gold.png") },
    { id: "green", label: "Зелёный", image: assetPath("/images/photos/seal-green.png") },
    { id: "blue", label: "Синий", image: assetPath("/images/photos/seal-blue.png") },
  ];

  const activeSeal = values.sealColor || "red";
  const resolvedActiveSeal = sealColors.some((sc) => sc.id === activeSeal) ? activeSeal : "red";
  const selectedArtist = values.artist === "spiritsveta" ? "spiritsveta" : "mortida";
  const artistShowcase = {
    mortida: {
      label: "Mortida",
      linkHref: "https://vk.ru/mortiidoo",
      linkLabel: "vk.ru/mortiidoo",
      works: [
        assetPath("/images/photos/artist-mortida-1.png"),
        assetPath("/images/photos/artist-mortida-2.png"),
        assetPath("/images/photos/artist-mortida-3.png"),
      ],
    },
    spiritsveta: {
      label: "SpiritSveta",
      linkHref: "https://t.me/SpiritSveta",
      linkLabel: "t.me/SpiritSveta",
      works: [
        assetPath("/images/photos/artist-spiritsveta-1.png"),
        assetPath("/images/photos/artist-spiritsveta-2.png"),
        assetPath("/images/photos/artist-spiritsveta-3.png"),
      ],
    },
  } as const;
  const currentArtist = artistShowcase[selectedArtist];

  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Пожелания в подарок</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 grid gap-3 sm:mt-6">
        {Object.keys(errors).length > 0 ? (
          <FormErrorSummary message="В заказе остались ошибки. Вернитесь к выделенным полям." />
        ) : null}
        <div
          className={`relative rounded border bg-[#f8f8f8] p-3.5 pr-12 text-center sm:p-4 sm:text-left ${logoFileError ? "border-red-500" : "border-transparent"}`}
        >
          <p className="text-base font-bold text-[#0f172a]">Логотип</p>
          <p className="mt-1 text-xs text-[rgba(101,101,101,0.7)]">
            {logoFile ? `Выбран файл: ${logoFile.name}` : "Файлы формата .jpg .png не больше 3мб"}
          </p>
          {logoFileError ? <FieldErrorMessage message={logoFileError} /> : null}
          <label
            title="Upload logo file"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                stroke="#0f172a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={(event) => onLogoFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="rounded bg-[#f8f8f8] p-3.5 text-center sm:p-4 sm:text-left">
          <p className="text-base font-bold text-[#0f172a]">Выбор художника</p>
          <select
            title="Choose artist"
            value={selectedArtist}
            onChange={(e) => onFieldChange("artist", e.target.value)}
            className="mt-2 w-full bg-transparent text-sm text-[rgba(101,101,101,0.7)] outline-none"
          >
            <option value="mortida">Mortida</option>
            <option value="spiritsveta">SpiritSveta</option>
          </select>

          <div className="mt-3 grid grid-cols-3 justify-items-center gap-2 sm:justify-items-start sm:gap-4">
            {currentArtist.works.map((src, index) => (
              <button
                key={`${selectedArtist}-${index}`}
                type="button"
                onClick={() => setArtworkModalSrc(src)}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880]"
                title="Открыть изображение"
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${src})` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
                <div className="pointer-events-none absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M10 18a8 8 0 1 1 5.3-14 8 8 0 0 1-5.3 14Z"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <path
                      d="M21 21l-4.2-4.2"
                      stroke="#0f172a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 8v4m-2-2h4"
                      stroke="#0f172a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start">
            <a
              href={currentArtist.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-2 text-[#0f172a]"
            >
              {currentArtist.label}: {currentArtist.linkLabel}
            </a>
          </div>
        </div>

        <div className="rounded bg-[#f8f8f8] p-3.5 text-center sm:p-4 sm:text-left">
          <p className="text-base font-bold text-[#0f172a]">Цвет сургутной печати</p>
          <p className="mt-1 text-xs text-[rgba(101,101,101,0.7)]">
            Фото не является эталонным продуктом*
          </p>
          <div className="mt-3 grid grid-cols-4 justify-items-center gap-2 sm:justify-items-start sm:gap-4">
            {sealColors.map((sc) => (
              <button
                key={sc.id}
                type="button"
                title={`Выбрать цвет: ${sc.label}`}
                onClick={() => onFieldChange("sealColor", sc.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`h-12 w-12 rounded bg-cover bg-center shadow-sm transition sm:h-[72px] sm:w-[72px] ${
                    resolvedActiveSeal === sc.id
                      ? "outline outline-[3px] outline-offset-2 outline-[#e8c880]"
                      : "opacity-60 hover:opacity-90"
                  }`}
                  style={{ backgroundImage: `url(${sc.image})` }}
                />
                <span
                  className={`text-xs ${resolvedActiveSeal === sc.id ? "font-bold text-[#0f172a]" : "text-[rgba(0,0,0,0.5)]"}`}
                >
                  {sc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <FormFieldTextarea
          label="Комментарий к заказу"
          placeholder="Комментарии, которые помогут нам лучше узнать о задаче"
          value={values.comment}
          onChange={(v) => onFieldChange("comment", v)}
        />

        <label
          className={`mt-2 flex gap-3 rounded-2xl border p-3.5 text-sm leading-[1.4] sm:p-4 ${
            errors.consent ? "border-red-500 bg-red-50" : "border-transparent"
          }`}
        >
          <input
            type="checkbox"
            checked={isConsentAccepted}
            onChange={(event) => onConsentChange(event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-required="true"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#0f172a]"
          />
          <span>
            <span className="font-bold">
              Согласие с условиями
              <span className="ml-1 text-red-600" aria-label="обязательное поле">
                *
              </span>
            </span>
            <br />
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
        {errors.consent ? <FieldErrorMessage message={errors.consent} /> : null}
        <RequiredFieldsNote />

        <button
          type="button"
          title="Submit order"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-xl"
        >
          {isSubmitting ? "Отправляем..." : "Оставить заявку"}
          <ArrowIcon size={22} />
        </button>

        {submitMessage ? (
          <div className="rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a]">
            {submitMessage}
          </div>
        ) : null}
      </div>

      {artworkModalSrc ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3 py-3 backdrop-blur-sm sm:px-6 sm:py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setArtworkModalSrc(null);
          }}
        >
          <div className="relative w-full max-w-[1100px] overflow-hidden rounded-[22px] bg-[#0b1321] shadow-2xl sm:rounded-[36px]">
            <button
              type="button"
              onClick={() => setArtworkModalSrc(null)}
              aria-label="Закрыть"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white hover:bg-white/10 sm:right-5 sm:top-5 sm:h-12 sm:w-12"
            >
              <CrossIcon />
            </button>
            <div className="grid">
              <div className="grid place-items-center p-3 sm:p-5">
                <img
                  src={artworkModalSrc}
                  alt=""
                  className="max-h-[86vh] w-auto max-w-full rounded-[14px] bg-transparent sm:rounded-[18px]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
