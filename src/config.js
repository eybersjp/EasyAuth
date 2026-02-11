export const config = {
  port: Number(process.env.PORT || 3000),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  defaultScopes: (process.env.DEFAULT_SCOPES || "openid,profile,email")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  env: process.env
};
