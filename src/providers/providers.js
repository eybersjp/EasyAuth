import { OAuthProvider } from "./base.js";

export function buildProviderRegistry(env) {
  return {
    github: new OAuthProvider("github", {
      clientId: env.GITHUB_CLIENT_ID,
      authorizationUrl: "https://github.com/login/oauth/authorize"
    }),
    google: new OAuthProvider("google", {
      clientId: env.GOOGLE_CLIENT_ID,
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth"
    }),
    auth0: new OAuthProvider("auth0", {
      clientId: env.AUTH0_CLIENT_ID,
      authorizationUrl: `${env.AUTH0_DOMAIN}/authorize`
    })
  };
}

export function listConfiguredProviders(registry) {
  return Object.entries(registry)
    .filter(([, provider]) => Boolean(provider.config.clientId))
    .map(([name]) => name);
}
