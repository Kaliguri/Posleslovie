import { PRODUCT_PRICE } from "./constants.js";

function getContactMethodLabel(method) {
  const methods = {
    tg: "Telegram",
    max: "MAX",
  };

  return methods[method] ?? method;
}

function addLineIfValue(lines, label, value) {
  if (value) {
    lines.push(`${label}: ${value}`);
  }
}

function formatCallSchedulingNote(callScheduling) {
  if (!callScheduling) {
    return null;
  }

  if (callScheduling.skipScheduling) {
    return "Не назначать время звонка: да";
  }

  if (callScheduling.date && callScheduling.time) {
    return `Дата созвона: ${callScheduling.date}\nВремя созвона: ${callScheduling.time}`;
  }

  return null;
}

export function buildOrderNote({ quantity, total, unitPrice, formValues, callScheduling }) {
  // Prefer the unit price the site sent (sourced from the CMS) so the CRM note matches
  // what the customer actually saw; fall back to the constant only for legacy payloads.
  const resolvedUnitPrice = Number.isFinite(unitPrice) && unitPrice > 0 ? unitPrice : PRODUCT_PRICE;
  const lines = [
    "Заказ с сайта Posleslovie",
    "",
    "1. Детали заказа",
    "Товар: Бомбочка для ванны",
    `Количество: ${quantity} шт.`,
    `Цена за 1 шт.: ${resolvedUnitPrice} руб.`,
    `Сумма: ${total} руб.`,
    "",
    "2. Контакты",
    `Имя: ${formValues.name}`,
    `Телефон: ${formValues.phone}`,
    `Email: ${formValues.email}`,
  ];

  if (formValues.contactMethod) {
    lines.push(`Предпочтительный способ связи: ${getContactMethodLabel(formValues.contactMethod)}`);
  }

  if (formValues.contactMethod === "tg") {
    addLineIfValue(lines, "Ник (TG)", formValues.contactHandle);
  }

  lines.push("", "3. Доставка");
  addLineIfValue(lines, "Город доставки", formValues.city);

  lines.push("", "4. Пожелания");
  addLineIfValue(lines, "Цвет сургучной печати", formValues.sealColor);
  addLineIfValue(lines, "Художник", formValues.artist);
  addLineIfValue(lines, "Комментарий", formValues.comment);

  const callSchedulingNote = formatCallSchedulingNote(callScheduling);
  if (callSchedulingNote) {
    lines.push("", "5. Созвон", callSchedulingNote);
  }

  return lines.join("\n");
}
