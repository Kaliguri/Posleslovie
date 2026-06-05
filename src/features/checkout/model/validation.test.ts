import { describe, expect, it } from "vitest";

import { initialCheckoutState } from "./types";
import { prepareCheckoutPayload, validateCheckout } from "./validation";

describe("checkout validation", () => {
  it("returns no errors for valid checkout", () => {
    const values = {
      ...initialCheckoutState.formValues,
      name: "Полина",
      phone: "+7 (978) 673-47-01",
      email: "test@example.ru",
      city: "Москва",
    };

    expect(validateCheckout(values, 2)).toEqual({});
  });

  it("requires a delivery city", () => {
    const values = {
      ...initialCheckoutState.formValues,
      name: "Полина",
      phone: "+7 (978) 673-47-01",
      email: "test@example.ru",
      city: "",
    };

    const result = validateCheckout(values, 2);
    expect(result.city).toBeTruthy();
  });

  it("trims values and normalizes the city in payload", () => {
    const payload = prepareCheckoutPayload({
      quantity: 3,
      total: 3000,
      logoFile: null,
      formValues: {
        ...initialCheckoutState.formValues,
        name: " Полина ",
        phone: "+7 (978) 673-47-01",
        email: " test@example.ru ",
        city: "москва",
      },
    });

    expect(payload.formValues.name).toBe("Полина");
    expect(payload.formValues.email).toBe("test@example.ru");
    expect(payload.formValues.city).toBe("Москва");
  });
});
