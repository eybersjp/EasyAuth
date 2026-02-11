# EasyAuth

EasyAuth is a lightweight authentication broker that sits between your app (web, mobile, desktop, IDE plugin, CLI) and external identity providers.

## Goal

Set up once, connect many times:

- **1 command** with Docker: `docker build -t easyauth . && docker run --env-file .env -p 3000:3000 easyauth`
- **2 commands** with Node: `cp .env.example .env` then `npm start`

## What this starter does

- Exposes a single API surface for multiple providers.
- Normalizes authorization URL generation for GitHub, Google, and Auth0.
- Lets any client platform call the same `/auth/:provider/start` endpoint.

## Quick start

1. Copy environment template:

```bash
cp .env.example .env
```

2. Add at least one provider client id in `.env`.

3. Start service:

```bash
npm start
```

4. Verify:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/providers
```

5. Start auth flow:

```bash
curl "http://localhost:3000/auth/github/start?state=my-state"
```

## API

### `GET /health`
Returns service health.

### `GET /providers`
Returns configured provider names and all supported providers.

### `GET /auth/:provider/start`
Builds a provider authorization URL.

Query params:
- `state` (optional)
- `redirect_uri` (optional)
- `scope` (optional comma-separated list)

## Next steps for production

- Add callback endpoint to exchange auth code for tokens.
- Persist state/nonce in Redis.
- Add provider-specific token/userinfo adapters.
- Add OIDC discovery for "any provider" registration.
- Add signed JWT session issuance for downstream apps.
- Add multi-tenant config storage.
