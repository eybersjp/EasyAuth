import crypto from "node:crypto";
import http from "node:http";
import { URL } from "node:url";
import { config } from "./config.js";
import { buildProviderRegistry, listConfiguredProviders } from "./providers/providers.js";

const providers = buildProviderRegistry(config.env);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function routeRequest(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && requestUrl.pathname === "/health") {
    return sendJson(res, 200, { ok: true, service: "EasyAuth" });
  }

  if (req.method === "GET" && requestUrl.pathname === "/providers") {
    return sendJson(res, 200, {
      configuredProviders: listConfiguredProviders(providers),
      availableProviders: Object.keys(providers)
    });
  }

  const authStartMatch = requestUrl.pathname.match(/^\/auth\/([a-z0-9-]+)\/start$/i);
  if (req.method === "GET" && authStartMatch) {
    const providerName = authStartMatch[1];
    const provider = providers[providerName];

    if (!provider) {
      return sendJson(res, 404, { error: `Unknown provider: ${providerName}` });
    }

    if (!provider.config.clientId) {
      return sendJson(res, 400, {
        error: `Provider ${providerName} is not configured. Add ${providerName.toUpperCase()}_CLIENT_ID to your environment.`
      });
    }

    const state = requestUrl.searchParams.get("state") || crypto.randomUUID();
    const redirectUri =
      requestUrl.searchParams.get("redirect_uri") || `${config.appBaseUrl}/auth/${providerName}/callback`;

    const scope =
      requestUrl.searchParams.get("scope")?.split(",").map((value) => value.trim()) ||
      config.defaultScopes;

    const authorizationUrl = provider.buildAuthorizationUrl({
      state,
      redirectUri,
      scope
    });

    return sendJson(res, 200, {
      provider: providerName,
      authorizationUrl,
      state,
      redirectUri
    });
  }

  return sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer(routeRequest);

server.listen(config.port, () => {
  console.log(`EasyAuth broker listening on port ${config.port}`);
});
