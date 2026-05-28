import { russianCities } from "@/shared/config/russian-cities";

function normalizeCitySearchValue(value: string) {
  return value.toLocaleLowerCase("ru").replaceAll("ё", "е").trim();
}

const normalizedRussianCities = new Map(
  russianCities.map((city) => [normalizeCitySearchValue(city), city]),
);

export function getRussianCityName(value: string) {
  return normalizedRussianCities.get(normalizeCitySearchValue(value)) ?? null;
}

export function getRussianCitySuggestions(value: string) {
  const query = normalizeCitySearchValue(value);
  if (!query) {
    return [];
  }

  return russianCities
    .filter((city) => normalizeCitySearchValue(city).startsWith(query))
    .slice(0, 8);
}
