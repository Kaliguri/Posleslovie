import { describe, expect, it } from "vitest";

import { parseCheckoutState } from "./storage";

describe("checkout storage parser", () => {
  it("normalizes malformed quantity and form values", () => {
    const parsed = parseCheckoutState(
      JSON.stringify({
        quantity: 0,
        formValues: {
          phone: "8 978 673 4701",
          contactMethod: "unknown",
        },
      }),
    );

    expect(parsed.quantity).toBe(3);
    expect(parsed.formValues.contactMethod).toBe("tg");
    expect(parsed.formValues.phone.startsWith("+7")).toBe(true);
  });
});
