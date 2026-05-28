import { describe, expect, it } from "vitest";

import { formatRussianPhoneInput, isValidRussianPhone } from "./phone";

describe("phone helpers", () => {
  it("formats phone to +7 mask", () => {
    expect(formatRussianPhoneInput("89786734701")).toBe("+7 (978) 673-47-01");
  });

  it("validates russian 10-digit body", () => {
    expect(isValidRussianPhone("+7 (978) 673-47-01")).toBe(true);
    expect(isValidRussianPhone("+7 (978) 673-47")).toBe(false);
  });
});
