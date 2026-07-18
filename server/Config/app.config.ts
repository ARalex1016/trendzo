export const APP_CONFIG = {
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },

  address: {
    maxAddresses: 5,
    // defaultCountry: "Nepal",
    supportedCountries: ["Nepal"],
  },

  currency: {
    code: "NPR",
    symbol: "Rs.",
  },
} as const;
