import { describe, expect, it } from "vitest";

import { getRussianCityName, getRussianCitySuggestions } from "./city";

describe("city helpers", () => {
  it("normalizes city name and returns canonical value", () => {
    expect(getRussianCityName("москва")).toBe("Москва");
  });

  it("returns limited suggestions", () => {
    const suggestions = getRussianCitySuggestions("м");
    expect(suggestions.length).toBeLessThanOrEqual(8);
    expect(Array.isArray(suggestions)).toBe(true);
  });
});
