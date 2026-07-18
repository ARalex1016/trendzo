export const AUTH_CONFIG = {
  accessTokenExpires: "15m",

  refreshTokenExpires: "30d",

  passwordMinLength: 8,

  maxLoginAttempts: 5,

  lockoutMinutes: 30,
} as const;
