export class OAuthProvider {
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }

  buildAuthorizationUrl({ state, redirectUri, scope }) {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
      scope: Array.isArray(scope) ? scope.join(" ") : scope
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }
}
