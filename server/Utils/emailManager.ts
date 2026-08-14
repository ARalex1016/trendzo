export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return "***";
  }

  // Very short username
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  // Keep first 2 characters
  const visibleCharacters = 2;
  const maskedCharacters = "*".repeat(
    Math.max(localPart.length - visibleCharacters, 3),
  );

  return `${localPart.slice(0, visibleCharacters)}${maskedCharacters}@${domain}`;
};
