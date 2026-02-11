import test from "node:test";
import assert from "node:assert/strict";
import { buildProviderRegistry, listConfiguredProviders } from "../src/providers/providers.js";

test("lists configured providers", () => {
  const providers = buildProviderRegistry({
    GITHUB_CLIENT_ID: "gh-client",
    GOOGLE_CLIENT_ID: "",
    AUTH0_CLIENT_ID: "auth0-client",
    AUTH0_DOMAIN: "https://tenant.auth0.com"
  });

  assert.deepEqual(listConfiguredProviders(providers), ["github", "auth0"]);
});

test("builds authorization URL with required params", () => {
  const providers = buildProviderRegistry({
    GITHUB_CLIENT_ID: "gh-client"
  });

  const url = providers.github.buildAuthorizationUrl({
    state: "abc",
    redirectUri: "http://localhost/callback",
    scope: ["openid", "email"]
  });

  assert.match(url, /^https:\/\/github.com\/login\/oauth\/authorize\?/);
  assert.match(url, /client_id=gh-client/);
  assert.match(url, /state=abc/);
  assert.match(url, /redirect_uri=http%3A%2F%2Flocalhost%2Fcallback/);
});
