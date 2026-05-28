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
  company: string;
  inn: string;
  ogrn: string;
  contactMethod: string;
  contactHandle: string;
  city: string;
  comment: string;
  sealColor: string;
  artist: string;
};

export type CheckoutState = {
  quantity: number;
  tab: "personal" | "company";
  formValues: CheckoutFormValues;
};

export type CheckoutField = keyof CheckoutFormValues;
export type CheckoutErrorField = CheckoutField | "quantity" | "consent";
export type CheckoutErrors = Partial<Record<CheckoutErrorField, string>>;

export type AmoCRMCheckoutPayload = CheckoutState & {
  total: number;
  logoFile?: CheckoutLogoFile | null;
};

export const checkoutStorageKey = "posleslovie:checkout-state";
export const maxLogoFileSize = 3 * 1024 * 1024;

export const initialCheckoutState: CheckoutState = {
  quantity: 3,
  tab: "personal",
  formValues: {
    name: "",
    phone: "+7 ",
    email: "",
    company: "",
    inn: "",
    ogrn: "",
    contactMethod: "tg",
    contactHandle: "",
    city: "",
    comment: "",
    sealColor: "red",
    artist: "",
  },
};
