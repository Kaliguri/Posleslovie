import { getRussianCityName } from "@/shared/lib/city";
import { isValidRussianPhone } from "@/shared/lib/phone";

import type {
  AmoCRMCheckoutPayload,
  CheckoutErrorField,
  CheckoutErrors,
  CheckoutFormValues,
} from "./types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function isValidTelegramHandle(value: string) {
  return /^@[a-zA-Z0-9_]{5,32}$/.test(value.trim());
}

export function validateCheckout(
  values: CheckoutFormValues,
  tab: "personal" | "company",
  quantity: number,
) {
  const errors: CheckoutErrors = {};

  if (!Number.isFinite(quantity) || quantity < 1) {
    errors.quantity = "Укажите количество от 1 штуки.";
  }

  if (!values.name.trim()) {
    errors.name = "Укажите имя.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Укажите телефон.";
  } else if (!isValidRussianPhone(values.phone)) {
    errors.phone = "Введите российский номер в формате +7XXXXXXXXXX.";
  }

  if (!values.email.trim()) {
    errors.email = "Укажите email.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Введите корректный email, например name@example.ru.";
  }

  if (tab === "company" && !values.company.trim()) {
    errors.company = "Укажите название компании.";
  }

  if (
    values.contactMethod === "tg" &&
    values.contactHandle.trim() &&
    !isValidTelegramHandle(values.contactHandle)
  ) {
    errors.contactHandle = "Введите @ и 5-32 символа: латиница, цифры или _.";
  }

  if (tab === "personal" && !values.city.trim()) {
    errors.city = "Укажите город доставки.";
  } else if (tab === "personal" && !getRussianCityName(values.city)) {
    errors.city = "Выберите город из списка подсказок.";
  }

  return errors;
}

export function getStep1Errors(errors: CheckoutErrors) {
  const step1Fields: CheckoutErrorField[] = [
    "name",
    "phone",
    "email",
    "company",
    "contactHandle",
    "city",
    "quantity",
  ];

  return step1Fields.reduce<CheckoutErrors>((acc, field) => {
    if (errors[field]) {
      acc[field] = errors[field];
    }

    return acc;
  }, {});
}

export function hasErrors(errors: CheckoutErrors) {
  return Object.keys(errors).length > 0;
}

export function prepareCheckoutPayload({
  tab,
  quantity,
  formValues,
  total,
  logoFile = null,
}: AmoCRMCheckoutPayload): AmoCRMCheckoutPayload {
  const trimmedValues = Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => [key, value.trim()]),
  ) as CheckoutFormValues;

  return {
    tab,
    quantity,
    total,
    logoFile,
    formValues: {
      ...trimmedValues,
      company: tab === "company" ? trimmedValues.company : "",
      inn: tab === "company" ? trimmedValues.inn : "",
      ogrn: tab === "company" ? trimmedValues.ogrn : "",
      city:
        tab === "personal" ? (getRussianCityName(trimmedValues.city) ?? trimmedValues.city) : "",
      contactHandle:
        trimmedValues.contactMethod === "tg" || trimmedValues.contactMethod === "max"
          ? trimmedValues.contactHandle
          : "",
    },
  };
}
