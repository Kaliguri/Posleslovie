export type CheckoutLogoFile = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

export type CheckoutFormValues = {
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  contactHandle: string;
  city: string;
  comment: string;
  sealColor: string;
  artist: string;
};

export type CheckoutState = {
  quantity: number;
  formValues: CheckoutFormValues;
};

export type CheckoutField = keyof CheckoutFormValues;
export type CheckoutStepNumber = 1 | 2 | 3;
export type CheckoutErrorField = CheckoutField | "quantity" | "consent" | "callDate" | "callTime";
export type CheckoutErrors = Partial<Record<CheckoutErrorField, string>>;
export type CheckoutCallScheduling = {
  skipScheduling: boolean;
  date: string;
  time: string;
};

export type AmoCRMCheckoutPayload = CheckoutState & {
  total: number;
  logoFile?: CheckoutLogoFile | null;
  callScheduling?: CheckoutCallScheduling;
};

export type AmoCRMLeadPayload = {
  mode: "lead";
  formValues: {
    name: string;
    phone: string;
    email: string;
    contactHandle?: string;
    company?: string;
    contactMethod?: string;
    comment?: string;
  };
};

export const checkoutStorageKey = "posleslovie:checkout-state";
export const maxLogoFileSize = 3 * 1024 * 1024;

export const initialCheckoutState: CheckoutState = {
  quantity: 3,
  formValues: {
    name: "",
    phone: "+7 ",
    email: "",
    contactMethod: "tg",
    contactHandle: "",
    city: "",
    comment: "",
    sealColor: "red",
    artist: "",
  },
};
