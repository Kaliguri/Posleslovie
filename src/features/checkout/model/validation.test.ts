import { describe, expect, it } from "vitest";

import { initialCheckoutState } from "./types";
import { prepareCheckoutPayload, validateCheckout } from "./validation";

describe("checkout validation", () => {
  it("returns no errors for valid personal checkout", () => {
    const values = {
      ...initialCheckoutState.formValues,
      name: "Полина",
      phone: "+7 (978) 673-47-01",
      email: "test@example.ru",
      city: "Москва",
    };

    expect(validateCheckout(values, "personal", 2)).toEqual({});
  });

  it("returns company error when company tab and company name empty", () => {
    const values = {
      ...initialCheckoutState.formValues,
      name: "Полина",
      phone: "+7 (978) 673-47-01",
      email: "test@example.ru",
      company: "",
    };

    const result = validateCheckout(values, "company", 2);
    expect(result.company).toBeTruthy();
  });

  it("trims and clears irrelevant fields in payload", () => {
    const payload = prepareCheckoutPayload({
      tab: "personal",
      quantity: 3,
      total: 3000,
      logoFile: null,
      formValues: {
        ...initialCheckoutState.formValues,
        name: " Полина ",
        phone: "+7 (978) 673-47-01",
        email: " test@example.ru ",
        city: "москва",
        company: " Should be removed ",
      },
    });

    expect(payload.formValues.name).toBe("Полина");
    expect(payload.formValues.email).toBe("test@example.ru");
    expect(payload.formValues.company).toBe("");
    expect(payload.formValues.city).toBe("Москва");
  });
});
