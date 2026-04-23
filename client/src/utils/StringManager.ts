export const capitalize = (input: string): string => {
  if (!input) return ""; // handle empty string
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "";

  const parts: string[] = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
}

export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
};
