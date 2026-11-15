import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac } from "node:crypto";
import { pathToFileURL } from "node:url";

type FixtureRecord = Record<string, unknown>;

export function createProviderServer() {
  const state = {
    leads: new Map<string, FixtureRecord>(),
    notifications: new Map<string, FixtureRecord>(),
    mailAttempts: [] as string[],
    otpRequests: 0,
    verificationRequests: 0,
    refreshRequests: 0,
    databaseFailure: false,
    intakeFunctionMissing: false,
    intakeLockTimeout: false,
    intakeRetryAfter: null as number | null,
    mailFailure: false,
    trackingFailure: false,
    authFailure: false,
    signOutFailure: false,
  };

  function reset() {
    state.leads.clear();
    state.notifications.clear();
    state.mailAttempts.length = 0;
    state.otpRequests = 0;
    state.verificationRequests = 0;
    state.refreshRequests = 0;
    state.databaseFailure = state.mailFailure = state.trackingFailure = false;
    state.intakeFunctionMissing = state.intakeLockTimeout = false;
    state.intakeRetryAfter = null;
    state.authFailure = state.signOutFailure = false;
  }

  const user = {
    id: "3a65dd4b-07cb-4aaf-ab56-e9a839840118", aud: "authenticated", role: "authenticated",
    email: "local-coach@example.test", app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {}, created_at: new Date().toISOString(),
  };
  const tokenPayload = {
    sub: user.id, email: user.email, aud: "authenticated", role: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 3600, iat: Math.floor(Date.now() / 1000),
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const signature = createHmac("sha256", "local-test-secret-only").update(`${header}.${payload}`).digest("base64url");
  const accessToken = `${header}.${payload}.${signature}`;

  function respond(response: ServerResponse, status: number, body?: unknown) {
    response.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS" });
    response.end(body === undefined ? undefined : JSON.stringify(body));
  }

  async function jsonBody(request: IncomingMessage): Promise<FixtureRecord> {
    const chunks = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const text = Buffer.concat(chunks).toString();
    return text ? JSON.parse(text) : {};
  }

  const server = createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    try {
      if (request.method === "OPTIONS") return respond(response, 204);
      if (url.pathname === "/health") return respond(response, 200, { ok: true });
      if (url.pathname === "/__control" && request.method === "POST") {
        const body = await jsonBody(request);
        if (body.reset) reset();
        for (const key of ["databaseFailure", "intakeFunctionMissing", "intakeLockTimeout", "mailFailure", "trackingFailure", "authFailure", "signOutFailure"] as const) {
          if (typeof body[key] === "boolean") state[key] = body[key];
        }
        if (typeof body.intakeRetryAfter === "number" || body.intakeRetryAfter === null) state.intakeRetryAfter = body.intakeRetryAfter;
        return respond(response, 200, { ok: true });
      }
      if (url.pathname === "/__state") {
        return respond(response, 200, { leads: [...state.leads.values()], notifications: [...state.notifications.values()],
          otpRequests: state.otpRequests, verificationRequests: state.verificationRequests,
          refreshRequests: state.refreshRequests, mailAttempts: state.mailAttempts });
      }

      if (url.pathname === "/rest/v1/rpc/accept_lead_v1" && request.method === "POST") {
        if (request.headers.apikey !== "fixture-service-role") return respond(response, 403, { message: "server key required" });
        if (state.databaseFailure) return respond(response, 500, { message: "fixture database outage" });
        if (state.intakeFunctionMissing) return respond(response, 404, { code: "PGRST202", message: "fixture RPC missing" });
        if (state.intakeLockTimeout) return respond(response, 503, { code: "55P03", message: "fixture advisory lock wait expired" });
        const body = await jsonBody(request);
        const id = String(body.p_id).toLowerCase();
        const existing = state.leads.get(id);
        if (existing) return respond(response, 200, { outcome: "replayed", lead: existing, retry_after: null });
        if (state.intakeRetryAfter !== null) {
          return respond(response, 200, { outcome: "rate-limited", lead: null, retry_after: state.intakeRetryAfter });
        }
        const record = { ...body.p_payload as FixtureRecord, id, created_at: new Date().toISOString(),
          notification_status: "pending", notification_id: null };
        state.leads.set(id, record);
        return respond(response, 200, { outcome: "inserted", lead: record, retry_after: null });
      }

      if (url.pathname === "/rest/v1/leads") {
        if (request.headers.apikey !== "fixture-service-role") return respond(response, 403, { message: "server key required" });
        if (state.databaseFailure) return respond(response, 500, { message: "fixture database outage" });
        if (request.method === "POST") {
          const body = await jsonBody(request);
          const id = String(body.id);
          if (state.leads.has(id)) return respond(response, 409, { code: "23505", message: "duplicate primary key" });
          const record = { ...body, id, created_at: new Date().toISOString(), notification_status: "pending", notification_id: null };
          state.leads.set(id, record);
          return respond(response, 201, record);
        }
        const id = url.searchParams.get("id")?.replace(/^eq\./, "") || "";
        const record = state.leads.get(id);
        if (request.method === "GET") return respond(response, record ? 200 : 404, record || { message: "not found" });
        if (request.method === "PATCH") {
          if (state.trackingFailure) return respond(response, 500, { message: "fixture tracking outage" });
          const body = await jsonBody(request);
          if (record && record.notification_status !== "sent") Object.assign(record, body);
          return respond(response, 204);
        }
      }

      if (url.pathname === "/resend/emails" && request.method === "POST") {
        if (request.headers.authorization !== "Bearer re_fixture_only") return respond(response, 401, { message: "invalid fixture key" });
        const key = String(request.headers["idempotency-key"]);
        const body = await jsonBody(request);
        state.mailAttempts.push(key);
        if (state.mailFailure) return respond(response, 500, { name: "application_error", message: "fixture email outage" });
        if (!state.notifications.has(key)) state.notifications.set(key, { ...body, id: `mail-${state.notifications.size + 1}` });
        return respond(response, 200, { id: state.notifications.get(key)!.id });
      }

      if (url.pathname.startsWith("/auth/v1/")) {
        if (url.pathname === "/auth/v1/verify" && request.method === "POST") state.verificationRequests += 1;
        if (state.authFailure) return respond(response, 503, { msg: "fixture auth outage" });
        if (url.pathname === "/auth/v1/otp") {
          state.otpRequests += 1;
          return respond(response, 200, {});
        }
        if (url.pathname === "/auth/v1/token" || url.pathname === "/auth/v1/verify") {
          const body = await jsonBody(request);
          if (url.searchParams.get("grant_type") === "refresh_token") state.refreshRequests += 1;
          if (body.auth_code !== "fixture-code" && body.token_hash !== "fixture-token-hash" && body.refresh_token !== "fixture-refresh") {
            return respond(response, 400, { error: "invalid_grant", error_description: "fixture expired link" });
          }
          return respond(response, 200, { access_token: accessToken, refresh_token: "fixture-refresh", expires_in: 3600, token_type: "bearer", user });
        }
        if (url.pathname === "/auth/v1/user") {
          return request.headers.authorization === `Bearer ${accessToken}`
            ? respond(response, 200, user)
            : respond(response, 401, { msg: "invalid token" });
        }
        if (url.pathname === "/auth/v1/logout") return respond(response, state.signOutFailure ? 500 : 204,
          state.signOutFailure ? { msg: "fixture signout outage" } : undefined);
      }
      return respond(response, 404, { message: "unknown local fixture endpoint" });
    } catch {
      return respond(response, 400, { message: "invalid local fixture request" });
    }
  });

  return { server, state, reset, user };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { server } = createProviderServer();
  server.listen(4319, "127.0.0.1", () => console.log("Local test providers ready on 4319"));
}
