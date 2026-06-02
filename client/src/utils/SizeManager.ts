export type FileSizeUnit = "B" | "KB" | "MB" | "GB";

interface FormatFileSizeOptions {
  from?: FileSizeUnit; // default: "B"
  to?: FileSizeUnit; // default: auto
  decimals?: number; // default: 2
  binary?: boolean; // default: false (1000 base; true = 1024 base)
}

/**
 * Converts file size between units or auto-formats it.
 */
export function formatFileSize(
  size: number,
  options: FormatFileSizeOptions = {},
): string {
  const { from = "B", to, decimals = 2, binary = false } = options;

  const base = binary ? 1024 : 1000;

  const unitMap: Record<FileSizeUnit, number> = {
    B: 1,
    KB: base,
    MB: base ** 2,
    GB: base ** 3,
  };

  // Normalize to bytes first
  const sizeInBytes = size * unitMap[from];

  // If target unit is specified → direct conversion
  if (to) {
    const result = sizeInBytes / unitMap[to];
    return `${result.toFixed(decimals)} ${to}`;
  }

  // Otherwise auto format
  const units: FileSizeUnit[] = ["B", "KB", "MB", "GB"];

  let unitIndex = 0;
  let value = sizeInBytes;

  while (value >= base && unitIndex < units.length - 1) {
    value /= base;
    unitIndex++;
  }

  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}
