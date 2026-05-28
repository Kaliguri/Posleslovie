function getRussianPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  const hasVisibleCountryCode = value.trim().startsWith("+7");

  if (hasVisibleCountryCode && digits.startsWith("7")) {
    return digits.slice(1, 11);
  }

  if (digits.length > 10 && /^[78]/.test(digits)) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

export function formatRussianPhoneInput(value: string) {
  const digits = getRussianPhoneDigits(value);
  const parts = ["+7"];

  if (digits.length > 0) {
    parts.push(` (${digits.slice(0, 3)}`);
  }

  if (digits.length >= 3) {
    parts[1] += ")";
  }

  if (digits.length > 3) {
    parts.push(` ${digits.slice(3, 6)}`);
  }

  if (digits.length > 6) {
    parts.push(`-${digits.slice(6, 8)}`);
  }

  if (digits.length > 8) {
    parts.push(`-${digits.slice(8, 10)}`);
  }

  return digits.length > 0 ? parts.join("") : "+7 ";
}

export function isValidRussianPhone(value: string) {
  return getRussianPhoneDigits(value).length === 10;
}
