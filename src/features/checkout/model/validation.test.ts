import { describe, expect, it } from "vitest";

import { initialCheckoutState } from "./types";
import { clearErrorFields, prepareCheckoutPayload, validateCheckout } from "./validation";

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

  it("forwards the unit price into the payload", () => {
    const payload = prepareCheckoutPayload({
      quantity: 2,
      total: 1998,
      unitPrice: 999,
      logoFile: null,
      formValues: { ...initialCheckoutState.formValues, name: "Полина", city: "Москва" },
    });

    expect(payload.unitPrice).toBe(999);
  });
});

describe("clearErrorFields", () => {
  it("removes the listed fields", () => {
    const result = clearErrorFields({ name: "err", phone: "err" }, ["name"]);
    expect(result).toEqual({ phone: "err" });
  });

  it("returns the same reference when nothing matches", () => {
    const errors = { phone: "err" };
    expect(clearErrorFields(errors, ["name", "city"])).toBe(errors);
  });
});
