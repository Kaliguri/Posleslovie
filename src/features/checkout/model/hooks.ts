import { useEffect, useState } from "react";

import { loadCheckoutState, persistCheckoutState } from "./storage";
import { initialCheckoutState, type CheckoutField, type CheckoutState } from "./types";

export function useCheckoutState() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialCheckoutState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCheckoutState(loadCheckoutState());
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistCheckoutState(checkoutState);
  }, [checkoutState, isReady]);

  const updateQuantity = (quantity: number) => {
    setCheckoutState((current) => ({
      ...current,
      quantity: Math.max(1, Math.floor(quantity) || 1),
    }));
  };

  const updateField = (field: CheckoutField, value: string) => {
    setCheckoutState((current) => ({
      ...current,
      formValues: {
        ...current.formValues,
        [field]: value,
      },
    }));
  };

  const updateTab = (tab: "personal" | "company") => {
    setCheckoutState((current) => ({ ...current, tab: "personal" }));
  };

  return { checkoutState, updateQuantity, updateField, updateTab };
}
