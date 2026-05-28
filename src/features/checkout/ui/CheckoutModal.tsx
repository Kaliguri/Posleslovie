"use client";

import { useEffect, useState } from "react";

import { legalDocuments, type LegalDocumentSlug } from "@/shared/config/legal-documents";
import { siteConfig } from "@/shared/config/site";
import { formatRussianPhoneInput } from "@/shared/lib/phone";
import { CrossIcon } from "@/shared/ui/CrossIcon";
import { GoldRule } from "@/shared/ui/GoldRule";
import { SectionKicker } from "@/shared/ui/SectionKicker";
import { submitCheckoutToAmoCRM } from "@/features/checkout/model/api";
import {
  maxLogoFileSize,
  type CheckoutCallScheduling,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutLogoFile,
  type CheckoutStepNumber,
  type CheckoutState,
} from "@/features/checkout/model/types";
import {
  getDefaultCallScheduling,
  getStep1Errors,
  hasErrors,
  prepareCheckoutPayload,
  validateCallScheduling,
  validateCheckout,
} from "@/features/checkout/model/validation";
import { CheckoutOrderPanel } from "@/features/checkout/ui/checkout-modal/CheckoutOrderPanel";
import { CheckoutStep1Form } from "@/features/checkout/ui/checkout-modal/CheckoutStep1Form";
import { CheckoutStep2Form } from "@/features/checkout/ui/checkout-modal/CheckoutStep2Form";
import { CheckoutStep2Actions } from "@/features/checkout/ui/checkout-modal/CheckoutStep2Actions";
import { CheckoutStep3Actions } from "@/features/checkout/ui/checkout-modal/CheckoutStep3Actions";
import { CheckoutStep3Form } from "@/features/checkout/ui/checkout-modal/CheckoutStep3Form";
import { CheckoutStepper } from "@/features/checkout/ui/checkout-modal/CheckoutStepper";
import { LeadForm } from "@/features/checkout/ui/checkout-modal/LeadForm";
import { LegalDocumentModal } from "@/features/checkout/ui/checkout-modal/LegalDocumentModal";

export type ModalType = "partners" | "contacts" | "checkout" | LegalDocumentSlug | null;
export type CheckoutProduct = { title: string; price: number; image: string };

function readFileAsCheckoutLogo(file: File) {
  return new Promise<CheckoutLogoFile>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;

      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64,
      });
    };
    reader.onerror = () => reject(reader.error ?? new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(file);
  });
}

function isLegalDocumentSlug(type: ModalType): type is LegalDocumentSlug {
  return Boolean(type && legalDocuments.some((document) => document.slug === type));
}

function getModalHeader(type: Exclude<ModalType, null>, checkoutTitle: string) {
  if (isLegalDocumentSlug(type)) {
    const document = legalDocuments.find((item) => item.slug === type);
    return {
      kicker: "Документы",
      title: document?.title ?? "Документ",
    };
  }

  const headers = {
    partners: {
      kicker: "Партнерство",
      title: "Хотите стать нашим партнером?",
    },
    contacts: {
      kicker: "Контактные данные",
      title: "Свяжитесь с нами",
    },
    checkout: {
      kicker: "Оформление заказа",
      title: checkoutTitle,
    },
  } satisfies Record<
    Exclude<ModalType, LegalDocumentSlug | null>,
    { kicker: string; title: string }
  >;

  return headers[type];
}

export function HomeModal({
  type,
  checkoutProduct,
  checkoutState,
  onCheckoutFieldChange,
  onCheckoutQuantityChange,
  onCheckoutTabChange,
  withOverlay,
  onClose,
}: Readonly<{
  type: ModalType;
  checkoutProduct: CheckoutProduct;
  checkoutState: CheckoutState;
  onCheckoutFieldChange: (field: CheckoutField, value: string) => void;
  onCheckoutQuantityChange: (quantity: number) => void;
  onCheckoutTabChange: (tab: "personal" | "company") => void;
  withOverlay: boolean;
  onClose: () => void;
}>) {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStepNumber>(1);

  useEffect(() => {
    if (type !== "checkout") {
      queueMicrotask(() => setCheckoutStep(1));
    }
  }, [type]);

  useEffect(() => {
    if (!type) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, type]);

  if (!type) {
    return null;
  }

  const header = getModalHeader(type, checkoutProduct.title || "Товар");
  const isCheckout = type === "checkout";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-2 py-2 sm:px-4 sm:py-6 ${
        withOverlay ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[calc(100dvh-16px)] w-full max-w-[920px] flex-col overflow-hidden rounded-[22px] bg-white pb-3 shadow-2xl sm:max-h-[92vh] sm:rounded-[36px] sm:pb-8 lg:rounded-[50px] lg:pb-12"
      >
        <div className="sticky top-0 z-20 bg-white px-4 pb-4 pt-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:px-6 sm:pb-6 sm:pt-8 lg:px-12 lg:pt-12">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a] sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          >
            <CrossIcon />
          </button>
          <div className="pr-12 sm:pr-16">
            <SectionKicker>{header.kicker}</SectionKicker>
            <h2 className="mt-2 text-[24px] font-extrabold leading-[1.12] sm:text-3xl lg:text-[40px]">
              {header.title}
            </h2>
          </div>
          <GoldRule fullWidth />
          {isCheckout ? (
            <CheckoutStepper
              step={checkoutStep}
              onBack={() => {
                if (checkoutStep === 3) setCheckoutStep(2);
                else if (checkoutStep === 2) setCheckoutStep(1);
              }}
            />
          ) : null}
        </div>
        <div className="modal-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-5 sm:px-6 sm:pt-8 lg:px-12 lg:pb-4">
          {type === "partners" ? <PartnersModal /> : null}
          {type === "contacts" ? <ContactsModal /> : null}
          {isCheckout ? (
            <CheckoutModal
              checkoutProduct={checkoutProduct}
              checkoutState={checkoutState}
              step={checkoutStep}
              onStepChange={setCheckoutStep}
              onFieldChange={onCheckoutFieldChange}
              onQuantityChange={onCheckoutQuantityChange}
              onTabChange={onCheckoutTabChange}
            />
          ) : null}
          {isLegalDocumentSlug(type) ? <LegalDocumentModal slug={type} /> : null}
        </div>
      </div>
    </div>
  );
}

function PartnersModal() {
  return (
    <div className="max-w-[760px]">
      <p className="max-w-[700px] text-base leading-[1.8] lg:text-lg">
        Предлагаем выгодные условия для региональных дистрибьюторов, розничных магазинов и селлеров.
        Расширьте свой ассортимент продуктом, который продает сам себя.
      </p>
      <p className="mt-6 max-w-[620px] text-lg font-bold leading-[1.6] sm:mt-8 sm:text-xl sm:leading-[1.8]">
        Оставьте заявку и мы свяжемся с вами, чтобы обсудить все детали
      </p>
      <GoldRule />
      <LeadForm submitLabel="Стать партнером" company />
    </div>
  );
}

function ContactsModal() {
  return (
    <div className="max-w-[552px]">
      <dl className="grid gap-3 text-base">
        <ContactItem
          label="Телефон"
          value={siteConfig.phone}
          href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
        />
        <ContactItem label="Почта" value={siteConfig.email} href={`mailto:${siteConfig.email}`} />
        {siteConfig.address ? <ContactItem label="Адрес" value={siteConfig.address} /> : null}
        {siteConfig.inn || siteConfig.ogrnip ? (
          <div className="grid gap-3 sm:grid-cols-[234px_1fr]">
            {siteConfig.inn ? <ContactItem label="ИНН" value={siteConfig.inn} compact /> : null}
            {siteConfig.ogrnip ? (
              <ContactItem label="ОГРНИП" value={siteConfig.ogrnip} compact />
            ) : null}
          </div>
        ) : null}
        {siteConfig.ownerName ? <ContactItem label="ИП" value={siteConfig.ownerName} /> : null}
      </dl>
    </div>
  );
}

function CheckoutModal({
  checkoutProduct,
  checkoutState,
  step,
  onStepChange,
  onFieldChange,
  onQuantityChange,
  onTabChange,
}: Readonly<{
  checkoutProduct: CheckoutProduct;
  checkoutState: CheckoutState;
  step: CheckoutStepNumber;
  onStepChange: (step: CheckoutStepNumber) => void;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onQuantityChange: (quantity: number) => void;
  onTabChange: (tab: "personal" | "company") => void;
}>) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [callScheduling, setCallScheduling] =
    useState<CheckoutCallScheduling>(getDefaultCallScheduling);
  const [logoFile, setLogoFile] = useState<CheckoutLogoFile | null>(null);
  const [logoFileError, setLogoFileError] = useState<string | null>(null);
  const { tab, quantity, formValues } = checkoutState;
  const total = quantity * checkoutProduct.price;

  useEffect(() => {
    queueMicrotask(() => {
      setErrors({});
      setSubmitMessage(null);
    });
  }, [tab]);

  const handleFieldChange = (field: CheckoutField, value: string) => {
    onFieldChange(field, field === "phone" ? formatRussianPhoneInput(value) : value);
    setErrors((current) => {
      if (!current[field] && !(field === "contactMethod" && current.contactHandle)) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      if (field === "contactMethod") {
        delete next.contactHandle;
      }
      return next;
    });
  };

  const handleConsentChange = (isAccepted: boolean) => {
    setIsConsentAccepted(isAccepted);
    setErrors((current) => {
      if (!current.consent) {
        return current;
      }

      const next = { ...current };
      delete next.consent;
      return next;
    });
  };

  const handleLogoFileChange = async (file: File | null) => {
    setLogoFile(null);
    setLogoFileError(null);

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setLogoFileError("Загрузите файл в формате JPG или PNG.");
      return;
    }

    if (file.size > maxLogoFileSize) {
      setLogoFileError("Файл должен быть не больше 3 МБ.");
      return;
    }

    try {
      setLogoFile(await readFileAsCheckoutLogo(file));
    } catch {
      setLogoFileError("Не удалось прочитать файл. Попробуйте выбрать его ещё раз.");
    }
  };

  const handleQuantityChange = (nextQuantity: number) => {
    onQuantityChange(nextQuantity);
    setErrors((current) => {
      if (!current.quantity) {
        return current;
      }

      const next = { ...current };
      delete next.quantity;
      return next;
    });
  };

  const handleContinue = () => {
    const nextErrors = getStep1Errors(validateCheckout(formValues, tab, quantity));
    setErrors(nextErrors);
    setSubmitMessage(null);

    if (!hasErrors(nextErrors)) {
      onStepChange(2);
    }
  };

  const handleProceedToCall = () => {
    const nextErrors = validateCheckout(formValues, tab, quantity);

    if (!isConsentAccepted) {
      nextErrors.consent = "Подтвердите согласие с условиями, чтобы продолжить оформление.";
    }

    if (logoFileError) {
      setSubmitMessage(logoFileError);
      return;
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setSubmitMessage("Проверьте выделенные поля и исправьте ошибки.");

      if (hasErrors(getStep1Errors(nextErrors))) {
        onStepChange(1);
      }

      return;
    }

    setSubmitMessage(null);
    setErrors((current) => {
      const next = { ...current };
      delete next.callDate;
      delete next.callTime;
      delete next.consent;
      return next;
    });
    onStepChange(3);
  };

  const handleCallSchedulingChange = (patch: Partial<CheckoutCallScheduling>) => {
    setCallScheduling((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      if (patch.date !== undefined) {
        delete next.callDate;
      }
      if (patch.time !== undefined) {
        delete next.callTime;
      }
      if (patch.skipScheduling !== undefined) {
        delete next.callDate;
        delete next.callTime;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors = {
      ...validateCheckout(formValues, tab, quantity),
      ...validateCallScheduling(callScheduling),
    };

    if (!isConsentAccepted) {
      nextErrors.consent = "Подтвердите согласие с условиями, чтобы оформить заказ.";
    }

    if (logoFileError) {
      setSubmitMessage(logoFileError);
      return;
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setSubmitMessage("Проверьте выделенные поля и исправьте ошибки.");

      if (hasErrors(getStep1Errors(nextErrors))) {
        onStepChange(1);
      } else if (nextErrors.consent) {
        onStepChange(2);
      }

      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("Отправляем заявку в AmoCRM...");

    try {
      await submitCheckoutToAmoCRM(
        prepareCheckoutPayload({
          tab,
          quantity,
          formValues,
          total,
          logoFile,
          callScheduling,
        }),
      );
      setSubmitMessage("Ваша заявка отправлена в AmoCRM. Мы свяжемся с вами в ближайшее время.");
    } catch (error) {
      console.error(error);
      setSubmitMessage(
        "Не удалось отправить заявку в AmoCRM. Проверьте токен, CORS и доступы интеграции.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid gap-7 lg:grid-cols-2 lg:gap-10">
        <div>
          {step === 1 ? (
            <CheckoutStep1Form
              tab={tab}
              values={formValues}
              errors={errors}
              hasStepErrors={hasErrors(getStep1Errors(errors))}
              onFieldChange={handleFieldChange}
              onContinue={handleContinue}
              onTabChange={onTabChange}
            />
          ) : null}
          {step === 2 ? (
            <CheckoutStep2Form
              values={formValues}
              errors={errors}
              onFieldChange={handleFieldChange}
              logoFile={logoFile}
              logoFileError={logoFileError}
              onLogoFileChange={handleLogoFileChange}
            />
          ) : null}
          {step === 3 ? (
            <CheckoutStep3Form
              scheduling={callScheduling}
              errors={errors}
              onSchedulingChange={handleCallSchedulingChange}
            />
          ) : null}
        </div>

        <CheckoutOrderPanel
          checkoutProduct={checkoutProduct}
          quantity={quantity}
          total={total}
          error={errors.quantity}
          onQuantityChange={handleQuantityChange}
        />
        {step === 2 ? (
          <div className="lg:col-span-2">
            <CheckoutStep2Actions
              isConsentAccepted={isConsentAccepted}
              onConsentChange={handleConsentChange}
              consentError={errors.consent}
              message={submitMessage}
              onProceed={handleProceedToCall}
            />
          </div>
        ) : null}
        {step === 3 ? (
          <div className="lg:col-span-2">
            <CheckoutStep3Actions
              isSubmitting={isSubmitting}
              submitMessage={submitMessage}
              onSubmit={handleSubmit}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
  compact = false,
}: Readonly<{ label: string; value: string; href?: string; compact?: boolean }>) {
  return (
    <div
      className={`break-words bg-[#f8f8f8] px-3.5 py-3 sm:px-4 ${compact ? "" : "min-h-[60px] sm:min-h-16"}`}
    >
      <dt className="font-bold text-[#0f172a]">{label}</dt>
      <dd className="mt-2 text-xs font-bold text-black [font-family:var(--font-inter)]">
        {href ? (
          <a href={href} title="Open contact link" className="underline underline-offset-2">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
