"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";

import { legalDocuments, type LegalDocumentSlug } from "@/shared/config/legal-documents";
import { siteConfig } from "@/shared/config/site";
import { getRussianCitySuggestions } from "@/shared/lib/city";
import { assetPath } from "@/shared/lib/asset-path";
import { formatRussianPhoneInput } from "@/shared/lib/phone";
import { submitCheckoutToAmoCRM } from "@/features/checkout/model/api";
import {
  maxLogoFileSize,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutLogoFile,
  type CheckoutState,
} from "@/features/checkout/model/types";
import {
  getStep1Errors,
  hasErrors,
  prepareCheckoutPayload,
  validateCheckout,
} from "@/features/checkout/model/validation";

export type ModalType =
  | "delivery"
  | "partners"
  | "contacts"
  | "checkout"
  | LegalDocumentSlug
  | null;
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
    delivery: {
      kicker: "Оплата и доставка",
      title: "Условия оплаты и доставки",
    },
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
  withOverlay,
  onClose,
}: Readonly<{
  type: ModalType;
  checkoutProduct: CheckoutProduct;
  checkoutState: CheckoutState;
  onCheckoutFieldChange: (field: CheckoutField, value: string) => void;
  onCheckoutQuantityChange: (quantity: number) => void;
  withOverlay: boolean;
  onClose: () => void;
}>) {
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

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
          <div className="max-w-[760px] pr-12 sm:pr-16">
            <SectionKicker>{header.kicker}</SectionKicker>
            <h2 className="mt-2 text-[24px] font-extrabold leading-[1.12] sm:text-3xl lg:text-[40px]">
              {header.title}
            </h2>
            <GoldRule />
          </div>
          {isCheckout ? (
            <div className="mt-4 flex items-center justify-center gap-2 sm:mt-5 sm:gap-4">
              <div className="relative w-full max-w-[560px]">
                <button
                  type="button"
                  title="Back to step 1"
                  onClick={() => {
                    if (checkoutStep === 2) setCheckoutStep(1);
                  }}
                  disabled={checkoutStep === 1}
                  className={`absolute left-0 top-1/2 flex h-9 w-9 -translate-y-1/2 rotate-180 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
                    checkoutStep === 2
                      ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
                      : "cursor-default bg-[#d7d7d7] text-[#9a9b9c]"
                  }`}
                >
                  <ArrowIcon size={18} />
                </button>
                <div className="mx-auto flex max-w-[420px] items-center justify-between pl-11 sm:pl-12">
                  {[1, 2, 3].map((step, index) => (
                    <div key={step} className="contents">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold sm:h-11 sm:w-11 sm:text-xl ${
                          step === checkoutStep
                            ? "bg-[#e8c880] text-[#0f172a]"
                            : "bg-[#0f172a] text-white"
                        }`}
                        aria-current={step === checkoutStep ? "step" : undefined}
                      >
                        {step}
                      </div>
                      {index < 2 ? <div className="h-[2px] flex-1 bg-[#d7d7d7]" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="modal-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-5 sm:px-6 sm:pt-8 lg:px-12 lg:pb-4">
          {type === "delivery" ? <DeliveryModal /> : null}
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

function DeliveryModal() {
  return (
    <div className="max-w-[760px]">
      <div className="space-y-6 text-base leading-[1.75] text-[#0f172a]">
        <InfoBlock title="1. Оплата">
          Доступны СБП, банковская карта и оплата при получении. Онлайн-оплата будет подключаться
          через отдельный backend, потому что GitHub Pages обслуживает только статические файлы.
        </InfoBlock>
        <InfoBlock title="2. Способы доставки">
          При оформлении заказа доступны курьерская доставка до двери, доставка в пункт выдачи и
          постамат через сервисы доставки. Стоимость зависит от адреса, веса и объёма заказа.
        </InfoBlock>
        <InfoBlock title="3. Сроки">
          После подтверждения заказа менеджер согласует удобный интервал и финальные детали
          упаковки.
        </InfoBlock>
      </div>
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
        <ContactItem label="Адрес" value="г. Севастополь, ул. Бориса Михайлова 3А, кв. 44" />
        <div className="grid gap-3 sm:grid-cols-[234px_1fr]">
          <ContactItem label="ИНН" value="Будет указан после открытия ИП" compact />
          <ContactItem label="ОГРНИП" value="Будет указан после открытия ИП" compact />
        </div>
        <ContactItem label="ИП" value="Серебренникова Полина Кирилловна" />
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
}: Readonly<{
  checkoutProduct: CheckoutProduct;
  checkoutState: CheckoutState;
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onQuantityChange: (quantity: number) => void;
}>) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
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

  const handleSubmit = async () => {
    const nextErrors = validateCheckout(formValues, tab, quantity);

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
      }

      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("Отправляем заявку в AmoCRM...");

    try {
      await submitCheckoutToAmoCRM(
        prepareCheckoutPayload({ tab, quantity, formValues, total, logoFile }),
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
              onFieldChange={handleFieldChange}
              onContinue={handleContinue}
            />
          ) : (
            <CheckoutStep2Form
              tab={tab}
              values={formValues}
              errors={errors}
              onFieldChange={handleFieldChange}
              logoFile={logoFile}
              logoFileError={logoFileError}
              onLogoFileChange={handleLogoFileChange}
              isConsentAccepted={isConsentAccepted}
              onConsentChange={handleConsentChange}
              submitMessage={submitMessage}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <CheckoutOrderPanel
          checkoutProduct={checkoutProduct}
          quantity={quantity}
          total={total}
          error={errors.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </div>
  );
}

function CheckoutStep1Form({
  tab,
  values,
  errors,
  onFieldChange,
  onContinue,
}: Readonly<{
  tab: "personal" | "company";
  values: CheckoutState["formValues"];
  errors: CheckoutErrors;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onContinue: () => void;
}>) {
  const hasStepErrors = hasErrors(getStep1Errors(errors));

  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Контактная информация</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 grid gap-3 sm:mt-6">
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
            href="tel:+79786734701"
            className="font-bold underline underline-offset-2 hover:text-[#b08a35]"
          >
            +7 (978) 673-47-01
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

function CheckoutStep2Form({
  tab,
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
  tab: "personal" | "company";
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
        {hasErrors(errors) ? (
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
          {isSubmitting ? "Отправляем..." : tab === "personal" ? "Оплатить" : "Оставить заявку"}
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

function CheckoutOrderPanel({
  checkoutProduct,
  quantity,
  total,
  error,
  onQuantityChange,
}: Readonly<{
  checkoutProduct: CheckoutProduct;
  quantity: number;
  total: number;
  error?: string;
  onQuantityChange: (q: number) => void;
}>) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Детали заказа</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl bg-[#f8f8f8] p-3.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-4">
        <ZoomImage
          image={checkoutProduct.image}
          label={checkoutProduct.title}
          className="h-24 w-24 shrink-0 rounded-[10px] sm:h-[108px] sm:w-[108px]"
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-bold">{checkoutProduct.title}</p>
          <div className="mt-4 flex items-center gap-3">
            <CounterButton onClick={() => onQuantityChange(quantity - 1)} disabled={quantity <= 1}>
              -
            </CounterButton>
            <input
              type="number"
              min={1}
              value={quantity}
              title="Product quantity"
              aria-label="Количество бомбочек"
              aria-invalid={Boolean(error)}
              onChange={(event) => onQuantityChange(Number(event.target.value))}
              className={`h-10 w-16 rounded-full border bg-white text-center font-bold outline-none ${
                error ? "border-red-500" : "border-[#e8c880]"
              }`}
            />
            <CounterButton onClick={() => onQuantityChange(quantity + 1)}>+</CounterButton>
          </div>
          {error ? <FieldErrorMessage message={error} /> : null}
        </div>
        <p className="shrink-0 font-bold sm:self-start">{checkoutProduct.price} ₽</p>
      </div>
      <div className="mt-5 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-6" />
      <div className="mt-5 space-y-2 text-base sm:mt-6 sm:space-y-4 sm:text-xl">
        <p className="font-light">Количество: {quantity} шт.</p>
        <p className="font-light">Цена за 1 шт.: {checkoutProduct.price} руб.</p>
        <p className="font-extrabold">Итоговая сумма: {total} руб.</p>
      </div>
    </div>
  );
}

function FormFieldTextarea({
  label,
  placeholder,
  value,
  error,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <div
      className={`rounded border bg-[#f8f8f8] px-3.5 py-3 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
    >
      <p className="text-base font-bold text-[#0f172a]">{label}</p>
      <textarea
        placeholder={placeholder}
        value={value}
        title={label}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full resize-none bg-transparent text-sm text-[#0f172a] placeholder-[rgba(101,101,101,0.5)] outline-none"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </div>
  );
}

function LegalDocumentModal({ slug }: Readonly<{ slug: LegalDocumentSlug }>) {
  const document = legalDocuments.find((item) => item.slug === slug);

  if (!document) {
    return null;
  }

  return (
    <article className="max-w-[760px]">
      <div className="space-y-4 text-sm leading-[1.7] text-[#0f172a] lg:text-base">
        {document.content.map((paragraph, index) => (
          <p key={`${document.slug}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

function LeadForm({
  submitLabel,
  company = false,
  requiredOnly = false,
}: Readonly<{ submitLabel: string; company?: boolean; requiredOnly?: boolean }>) {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    contactMethod: "",
  });
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const updateField = (field: keyof typeof formValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="mt-5 grid gap-3 sm:mt-6"
      onSubmit={(event) => {
        event.preventDefault();
        setDebugMessage(
          `Нажали "${submitLabel}". Имя: ${formValues.name || "не указано"}, телефон: ${
            formValues.phone || "не указан"
          }, email: ${formValues.email || "не указан"}.`,
        );
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          label={requiredOnly ? "Имя*" : "Имя"}
          placeholder="Ваше имя"
          value={formValues.name}
          onChange={(value) => updateField("name", value)}
        />
        <FormField
          label={requiredOnly ? "Телефон*" : "Телефон"}
          placeholder="+7 (000) 000-00-00"
          value={formValues.phone}
          onChange={(value) => updateField("phone", value)}
        />
      </div>
      <FormField
        label={requiredOnly ? "Email*" : "Email"}
        placeholder="Ваш email"
        value={formValues.email}
        onChange={(value) => updateField("email", value)}
      />
      {company || requiredOnly ? (
        <FormField
          label="Компания"
          placeholder="Название компании"
          value={formValues.company}
          onChange={(value) => updateField("company", value)}
        />
      ) : null}
      <FormField
        label="Как с вами удобнее связаться?"
        placeholder="Телеграм"
        value={formValues.contactMethod}
        onChange={(value) => updateField("contactMethod", value)}
      />
      {requiredOnly ? (
        <p className="text-xs font-light">( * - обязательные для заполнения )</p>
      ) : (
        <label className="mt-2 flex gap-3 text-base leading-[1.4]">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#0f172a]" />
          <span className="min-w-0">
            Нажимая на кнопку, вы соглашаетесь с обработкой <u>персональных данных</u>. Ознакомлены
            с <u>политикой конфиденциальности</u>
          </span>
        </label>
      )}
      <button
        type="submit"
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#e8c880] px-5 py-3.5 text-base font-bold text-[#0f172a] transition hover:bg-[#ffecbf] sm:mt-4 sm:gap-5 sm:px-6 sm:py-4 sm:text-2xl"
      >
        {submitLabel}
        <ArrowIcon />
      </button>
      {debugMessage ? (
        <div className="rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a]">
          {debugMessage}
        </div>
      ) : null}
    </form>
  );
}

function FormField({
  label,
  placeholder,
  value,
  error,
  required = false,
  type = "text",
  autoComplete,
  inputMode,
  list,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  list?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label
      className={`grid min-h-[60px] gap-1 rounded border bg-[#f8f8f8] px-3.5 py-3 sm:min-h-16 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
    >
      <span className="font-bold">
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-label="обязательное поле">
            *
          </span>
        ) : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        aria-invalid={Boolean(error)}
        aria-required={required}
        className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#656565]/50 sm:text-xs"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </label>
  );
}

function CitySelectField({
  label,
  placeholder,
  value,
  error,
  required = false,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}>) {
  const [isFocused, setIsFocused] = useState(false);
  const suggestions = getRussianCitySuggestions(value);
  const showSuggestions = isFocused && value.trim().length > 0 && suggestions.length > 0;

  const handleSelect = (city: string) => {
    onChange(city);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <label
        className={`grid min-h-[60px] gap-1 rounded border bg-[#f8f8f8] px-3.5 py-3 sm:min-h-16 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
      >
        <span className="font-bold">
          {label}
          {required ? (
            <span className="ml-1 text-red-600" aria-label="обязательное поле">
              *
            </span>
          ) : null}
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-required={required}
          className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#656565]/50 sm:text-xs"
        />
        {error ? <FieldErrorMessage message={error} /> : null}
      </label>

      {showSuggestions ? (
        <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-30 overflow-hidden rounded-2xl border border-[#e8c880] bg-white shadow-[0_-14px_40px_rgba(15,23,42,0.16)]">
          <div className="max-h-[190px] overflow-y-auto py-2">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(city);
                }}
                className="block w-full px-4 py-3 text-left text-sm font-bold text-[#0f172a] transition hover:bg-[#fff4d8]"
              >
                {city}
              </button>
            ))}
          </div>
          <p className="border-t border-[#e8c880]/40 px-4 py-2 text-xs text-[#656565]">
            Выберите город из списка
          </p>
        </div>
      ) : null}
    </div>
  );
}

function RequiredFieldsNote() {
  return (
    <p className="text-xs text-[#656565]">
      <span className="font-bold text-red-600">*</span> обязательные поля
    </p>
  );
}

function FormErrorSummary({ message }: Readonly<{ message: string }>) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700">
      {message}
    </div>
  );
}

function FieldErrorMessage({ message }: Readonly<{ message: string }>) {
  return <span className="mt-1 text-xs font-bold text-red-600">{message}</span>;
}

function InfoBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-2xl bg-[#f8f8f8] p-4 sm:p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{children}</p>
    </section>
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

function SectionKicker({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-xs font-bold uppercase tracking-[2px] text-[#e8c880] sm:text-base sm:tracking-[3px] lg:text-lg xl:text-xl">
      {children}
    </p>
  );
}

function GoldRule({ centered = false }: Readonly<{ centered?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mt-4 flex w-full max-w-[700px] items-center sm:mt-6 ${centered ? "mx-auto" : ""}`}
    >
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
      <span className="h-px flex-1 bg-[#e8c880]" />
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
    </div>
  );
}

function ZoomImage({
  image,
  label,
  className,
}: Readonly<{ image: string; label: string; className: string }>) {
  return (
    <div
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      className={`overflow-hidden bg-[#f8f8f8] zoom-frame ${className}`}
    >
      <div
        className="zoom-media h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function CounterButton({
  children,
  disabled = false,
  onClick,
}: Readonly<{ children: React.ReactNode; disabled?: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      title={children === "+" ? "Increase product quantity" : "Decrease product quantity"}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f172a]/50 font-bold transition hover:border-[#e8c880] hover:text-[#e8c880] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ArrowIcon({ size = 24 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
