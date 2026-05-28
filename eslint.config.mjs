import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: ["backend/dist/**", "temp/**", "videos/**"],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
