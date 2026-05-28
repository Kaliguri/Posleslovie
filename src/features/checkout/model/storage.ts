import { formatRussianPhoneInput } from "@/shared/lib/phone";

import { checkoutStorageKey, initialCheckoutState, type CheckoutState } from "./types";

export function parseCheckoutState(value: string | null): CheckoutState {
  if (!value) {
    return initialCheckoutState;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CheckoutState>;
    const formValues = {
      ...initialCheckoutState.formValues,
      ...(parsed.formValues ?? {}),
    };

    const contactMethod =
      formValues.contactMethod === "max" ||
      formValues.contactMethod === "phone" ||
      formValues.contactMethod === "email"
        ? formValues.contactMethod
        : "tg";

    return {
      quantity: Math.max(1, Number(parsed.quantity) || initialCheckoutState.quantity),
      tab: "personal",
      formValues: {
        ...formValues,
        phone: formatRussianPhoneInput(formValues.phone),
        contactMethod,
      },
    };
  } catch {
    return initialCheckoutState;
  }
}

export function loadCheckoutState(): CheckoutState {
  return parseCheckoutState(window.localStorage.getItem(checkoutStorageKey));
}

export function persistCheckoutState(state: CheckoutState) {
  window.localStorage.setItem(checkoutStorageKey, JSON.stringify(state));
}
