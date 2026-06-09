"use client";

import { useState } from "react";

import { submitLeadToAmoCRM } from "@/features/checkout/model/api";
import { env } from "@/shared/config/env";
import { withBasePath } from "@/shared/config/seo";
import { formatRussianPhoneInput } from "@/shared/lib/phone";
import { reachGoal } from "@/shared/lib/metrica";
import { reportError } from "@/shared/lib/report-error";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { Turnstile } from "@/shared/ui/Turnstile";

type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  company: string;
  contactMethod: string;
  contactHandle: string;
  comment: string;
};

export function LeadForm({
  submitLabel,
  company = false,
  requiredOnly = false,
}: Readonly<{ submitLabel: string; company?: boolean; requiredOnly?: boolean }>) {
  const [formValues, setFormValues] = useState<LeadFormValues>({
    name: "",
    phone: "",
    email: "",
    company: "",
    contactMethod: "",
    contactHandle: "",
    comment: "",
  });
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const consentRequired = !requiredOnly;

  const updateField = (field: keyof LeadFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="mt-5 grid gap-3 sm:mt-6"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!formValues.name.trim() || !formValues.phone.trim() || !formValues.email.trim()) {
          setSubmitMessage("Заполните имя, телефон и email.");
          return;
        }
        if (consentRequired && !consentAccepted) {
          setSubmitMessage("Подтвердите согласие на обработку персональных данных.");
          return;
        }
        if (env.turnstileEnabled && !turnstileToken) {
          setSubmitMessage("Подтвердите, что вы не робот.");
          return;
        }
        setIsSubmitting(true);
        setSubmitMessage("Отправляем заявку...");
        try {
          await submitLeadToAmoCRM({
            mode: "lead",
            formValues: {
              name: formValues.name.trim(),
              phone: formatRussianPhoneInput(formValues.phone),
              email: formValues.email.trim(),
              company: formValues.company.trim(),
              contactMethod: formValues.contactMethod.trim(),
              contactHandle: formValues.contactHandle.trim(),
              comment: formValues.comment.trim(),
            },
            turnstileToken,
          });
          reachGoal("lead");
          setSubmitMessage("Заявка отправлена. Мы свяжемся с вами в ближайшее время.");
        } catch (error) {
          reportError(error, { feature: "lead-submit" });
          setSubmitMessage("Не удалось отправить заявку. Попробуйте позже.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <LeadTextField
          label={requiredOnly ? "Имя*" : "Имя"}
          placeholder="Ваше имя"
          value={formValues.name}
          onChange={(value) => updateField("name", value)}
        />
        <LeadTextField
          label={requiredOnly ? "Телефон*" : "Телефон"}
          placeholder="+7 (000) 000-00-00"
          value={formValues.phone}
          onChange={(value) => updateField("phone", value)}
        />
      </div>
      <LeadTextField
        label={requiredOnly ? "Email*" : "Email"}
        placeholder="Ваш email"
        value={formValues.email}
        onChange={(value) => updateField("email", value)}
      />
      {company || requiredOnly ? (
        <LeadTextField
          label="Компания"
          placeholder="Название компании"
          value={formValues.company}
          onChange={(value) => updateField("company", value)}
        />
      ) : null}
      <LeadTextField
        label="Как с вами удобнее связаться?"
        placeholder="Телеграм"
        value={formValues.contactMethod}
        onChange={(value) => updateField("contactMethod", value)}
      />
      <LeadTextField
        label="Данные для связи"
        placeholder="@username или номер"
        value={formValues.contactHandle}
        onChange={(value) => updateField("contactHandle", value)}
      />
      <LeadTextField
        label="Комментарий"
        placeholder="Коротко о задаче"
        value={formValues.comment}
        onChange={(value) => updateField("comment", value)}
      />
      {requiredOnly ? (
        <p className="text-xs font-light">( * - обязательные для заполнения )</p>
      ) : (
        <label className="mt-2 flex gap-3 text-base leading-[1.4]">
          <input
            type="checkbox"
            checked={consentAccepted}
            onChange={(event) => setConsentAccepted(event.target.checked)}
            aria-required="true"
            className="mt-1 h-4 w-4 rounded border-[#0f172a]"
          />
          <span className="min-w-0">
            Нажимая на кнопку, вы соглашаетесь с обработкой{" "}
            <a
              href={withBasePath("/images/documents/personal-data-consent.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-[#b08a35] underline-offset-2 hover:text-[#b08a35]"
            >
              персональных данных
            </a>{" "}
            и ознакомлены с{" "}
            <a
              href={withBasePath("/images/documents/privacy.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-[#b08a35] underline-offset-2 hover:text-[#b08a35]"
            >
              политикой конфиденциальности
            </a>
            .
          </span>
        </label>
      )}
      <Turnstile onVerify={setTurnstileToken} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] disabled:opacity-70 sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-2xl"
      >
        {isSubmitting ? "Отправляем..." : submitLabel}
        <ArrowIcon />
      </button>
      {submitMessage ? (
        <div className="rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a]">
          {submitMessage}
        </div>
      ) : null}
    </form>
  );
}

function LeadTextField({
  label,
  placeholder,
  value,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="grid min-h-[60px] gap-1 rounded border border-transparent bg-[#f8f8f8] px-3.5 py-3 sm:min-h-16 sm:px-4">
      <span className="font-bold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#656565]/50 sm:text-xs"
      />
    </label>
  );
}
