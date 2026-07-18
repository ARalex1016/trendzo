const SUPPORTED_COUNTRIES: readonly string[] = ["Nepal", "India"];

export const USER_CONFIG = {
  address: {
    maxAddresses: 5,
    // defaultCountry: "Nepal",
    supportedCountries: SUPPORTED_COUNTRIES,
  },
} as const;
