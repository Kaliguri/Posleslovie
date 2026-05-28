"use client";

import type { CheckoutErrors, CheckoutField, CheckoutState } from "@/features/checkout/model/types";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { siteConfig } from "@/shared/config/site";

import {
  CitySelectField,
  FormErrorSummary,
  FormField,
  FormFieldTextarea,
  RequiredFieldsNote,
} from "./FormParts";

export function CheckoutStep1Form({
  tab,
  values,
  errors,
  hasStepErrors,
  onFieldChange,
  onContinue,
  onTabChange,
}: Readonly<{
  tab: "personal" | "company";
  values: CheckoutState["formValues"];
  errors: CheckoutErrors;
  hasStepErrors: boolean;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onContinue: () => void;
  onTabChange: (tab: "personal" | "company") => void;
}>) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Контактная информация</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 grid gap-3 sm:mt-6">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f8f8f8] p-1">
          <button
            type="button"
            onClick={() => onTabChange("personal")}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition sm:text-base ${
              tab === "personal"
                ? "bg-[#e8c880] text-[#0f172a]"
                : "text-[#0f172a]/75 hover:bg-white"
            }`}
          >
            Для себя
          </button>
          <button
            type="button"
            onClick={() => onTabChange("company")}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition sm:text-base ${
              tab === "company" ? "bg-[#e8c880] text-[#0f172a]" : "text-[#0f172a]/75 hover:bg-white"
            }`}
          >
            Для компании
          </button>
        </div>
        {hasStepErrors ? (
          <FormErrorSummary message="Проверьте контактные данные и детали заказа." />
        ) : null}
        <FormField
          label="Имя"
          placeholder="Ваше имя"
          value={values.name}
          error={errors.name}
          required
          autoComplete="name"
          onChange={(v) => onFieldChange("name", v)}
        />
        <FormField
          label="Телефон"
          placeholder="+7 (000) 000-00-00"
          value={values.phone}
          error={errors.phone}
          required
          autoComplete="tel"
          inputMode="tel"
          onChange={(v) => onFieldChange("phone", v)}
        />
        <FormField
          label="Email"
          placeholder="Ваш email"
          value={values.email}
          error={errors.email}
          required
          type="email"
          autoComplete="email"
          onChange={(v) => onFieldChange("email", v)}
        />
        {tab === "company" ? (
          <>
            <FormField
              label="Компания"
              placeholder="Название компании"
              value={values.company}
              error={errors.company}
              required
              autoComplete="organization"
              onChange={(v) => onFieldChange("company", v)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label="ИНН"
                placeholder="ИНН"
                value={values.inn}
                inputMode="numeric"
                onChange={(v) => onFieldChange("inn", v)}
              />
              <FormField
                label="ОГРН"
                placeholder="ОГРН"
                value={values.ogrn}
                inputMode="numeric"
                onChange={(v) => onFieldChange("ogrn", v)}
              />
            </div>
          </>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-transparent bg-[#f8f8f8] px-3.5 py-3 text-center sm:px-4 sm:text-left">
            <p className="text-base font-bold text-[#0f172a]">Как с вами удобнее связаться?</p>
            <select
              title="Contact method"
              value={values.contactMethod}
              onChange={(e) => onFieldChange("contactMethod", e.target.value)}
              className="mt-2 w-full bg-transparent text-sm text-[#0f172a] outline-none"
            >
              <option value="tg">Telegram</option>
              <option value="max">MAX</option>
              <option value="phone">Телефон</option>
              <option value="email">Почта</option>
            </select>
          </div>
          <FormField
            label="Данные для связи"
            placeholder="@username"
            value={values.contactHandle}
            error={errors.contactHandle}
            onChange={(v) => onFieldChange("contactHandle", v)}
          />
        </div>
        {tab === "personal" ? (
          <CitySelectField
            label="Город доставки"
            placeholder="Москва"
            value={values.city}
            error={errors.city}
            required
            onChange={(v) => onFieldChange("city", v)}
          />
        ) : (
          <FormFieldTextarea
            label="Комментарий к заказу"
            placeholder="Комментарии, которые помогут нам лучше узнать о задаче"
            value={values.comment}
            onChange={(v) => onFieldChange("comment", v)}
          />
        )}
        <RequiredFieldsNote />
        <p className="text-sm leading-[1.5] text-[#0f172a] sm:text-left">
          В случае вопросов с доставкой свяжитесь с менеджером по телефону{" "}
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="font-bold underline underline-offset-2 hover:text-[#b08a35]"
          >
            {siteConfig.phone}
          </a>
          .
        </p>
        <button
          type="button"
          title="Continue to step 2"
          onClick={onContinue}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-xl"
        >
          Продолжить оформление
          <ArrowIcon size={22} />
        </button>
      </div>
    </div>
  );
}
