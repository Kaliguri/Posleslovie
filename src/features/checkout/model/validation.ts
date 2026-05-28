import { getRussianCityName } from "@/shared/lib/city";
import { isValidRussianPhone } from "@/shared/lib/phone";

import type {
  AmoCRMCheckoutPayload,
  CheckoutCallScheduling,
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

export const RUSSIAN_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export const RUSSIAN_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const CALL_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getSelectableCallDateKeys() {
  const today = startOfLocalDay();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return toLocalDateKey(date);
  });
}

export function getDefaultCallScheduling(): CheckoutCallScheduling {
  const [firstDate] = getSelectableCallDateKeys();
  return {
    skipScheduling: false,
    date: firstDate,
    time: CALL_TIME_SLOTS[0],
  };
}

export function validateCallScheduling(scheduling: CheckoutCallScheduling) {
  const errors: CheckoutErrors = {};

  if (scheduling.skipScheduling) {
    return errors;
  }

  const selectableDates = new Set(getSelectableCallDateKeys());

  if (!scheduling.date || !selectableDates.has(scheduling.date)) {
    errors.callDate = "Выберите дату созвона в ближайшие 7 дней.";
  }

  if (
    !scheduling.time ||
    !CALL_TIME_SLOTS.includes(scheduling.time as (typeof CALL_TIME_SLOTS)[number])
  ) {
    errors.callTime = "Выберите удобное время звонка.";
  }

  return errors;
}

export function prepareCheckoutPayload({
  tab,
  quantity,
  formValues,
  total,
  logoFile = null,
  callScheduling,
}: AmoCRMCheckoutPayload): AmoCRMCheckoutPayload {
  const trimmedValues = Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => [key, value.trim()]),
  ) as CheckoutFormValues;

  return {
    tab,
    quantity,
    total,
    logoFile,
    callScheduling,
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
