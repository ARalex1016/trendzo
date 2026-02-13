/**
 * Formats a number into Nepali/Indian numbering system
 * Example: 10000000 => 1,00,00,000
 */
export const formatNepaliAmount = (
  amount: number | string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '0';
  }

  const num = Number(amount);

  if (Number.isNaN(num)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options || {};

  const isNegative = num < 0;
  const absolute = Math.abs(num);

  // Detect if original input has decimals
  const hasDecimalInput =
    typeof amount === 'string'
      ? amount.includes('.')
      : !Number.isInteger(num);

  let integerPart: string;
  let decimalPart: string | undefined;

  if (hasDecimalInput) {
    const fixed = absolute.toFixed(maximumFractionDigits);
    [integerPart, decimalPart] = fixed.split('.');
  } else {
    integerPart = Math.trunc(absolute).toString();
    decimalPart = undefined;
  }

  // Apply Nepali grouping
  if (integerPart.length > 3) {
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);

    const remainingWithCommas = remaining.replace(
      /\B(?=(\d{2})+(?!\d))/g,
      ','
    );

    integerPart = `${remainingWithCommas},${lastThree}`;
  }

  let result = integerPart;

  if (decimalPart) {
    result = `${result}.${decimalPart}`;
  } else if (minimumFractionDigits > 0) {
    result = `${result}.${'0'.repeat(minimumFractionDigits)}`;
  }

  return isNegative ? `-${result}` : result;
}
