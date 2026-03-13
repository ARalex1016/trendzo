// Types
import type { ICartItem, CartTotals } from "@/types/cart.type";

/**
 * Formats a number into Nepali/Indian numbering system
 * Example: 10000000 => 1,00,00,000
 */
export const formatNepaliAmount = (
  amount: number | string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string => {
  if (amount === null || amount === undefined || amount === "") {
    return "0";
  }

  const num = Number(amount);

  if (Number.isNaN(num)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } =
    options || {};

  const isNegative = num < 0;
  const absolute = Math.abs(num);

  // Detect if original input has decimals
  const hasDecimalInput =
    typeof amount === "string" ? amount.includes(".") : !Number.isInteger(num);

  let integerPart: string;
  let decimalPart: string | undefined;

  if (hasDecimalInput) {
    const fixed = absolute.toFixed(maximumFractionDigits);
    [integerPart, decimalPart] = fixed.split(".");
  } else {
    integerPart = Math.trunc(absolute).toString();
    decimalPart = undefined;
  }

  // Apply Nepali grouping
  if (integerPart.length > 3) {
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);

    const remainingWithCommas = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

    integerPart = `${remainingWithCommas},${lastThree}`;
  }

  let result = integerPart;

  if (decimalPart) {
    result = `${result}.${decimalPart}`;
  } else if (minimumFractionDigits > 0) {
    result = `${result}.${"0".repeat(minimumFractionDigits)}`;
  }

  return isNegative ? `-${result}` : result;
};

export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
) => {
  const totalPageNumbers = siblingCount * 2 + 5;

  // If total pages small → show everything
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];

  pages.push(firstPageIndex);

  if (showLeftEllipsis) {
    pages.push("ellipsis-left");
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== firstPageIndex && i !== lastPageIndex) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push("ellipsis-right");
  }

  if (lastPageIndex !== firstPageIndex) {
    pages.push(lastPageIndex);
  }

  return pages;
};

export const calculateTotals = (items: ICartItem[]): CartTotals => {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const discount = 0;
  const deliveryCharge = 0;
  const tax = 0;

  const total = subtotal - discount + deliveryCharge + tax;

  return {
    itemsCount,
    subtotal,
    discount,
    deliveryCharge,
    tax,
    total,
  };
};
