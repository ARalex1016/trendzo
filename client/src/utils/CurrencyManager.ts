// utils/format-currency.ts

import { BRAND } from "@/config/brand";

const currencyFormatter = new Intl.NumberFormat(BRAND.currency.locale, {
  style: "currency",
  currency: BRAND.currency.code,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount);
};
