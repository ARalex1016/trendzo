// utils/format-currency.ts

import { BRAND } from "@/config/brand";

interface FormatCurrencyOptions {
  decimals?: boolean;
  symbol?: "default" | "symbol" | "alternate";
}

export const formatCurrency = (
  amount: number,
  options: FormatCurrencyOptions = {},
): string => {
  const { decimals = true, symbol = "default" } = options;

  const formattedAmount = new Intl.NumberFormat(BRAND.currency.locale, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(amount);

  const currencySymbol =
    symbol === "alternate"
      ? BRAND.currency.alternateSymbol
      : symbol === "symbol"
        ? BRAND.currency.symbol
        : BRAND.currency.code;

  return `${currencySymbol} ${formattedAmount}`;
};
