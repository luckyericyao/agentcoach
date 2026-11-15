import "server-only";

export class RequestError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export function requestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") || requestUrl.host;
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProtocol === "https" || forwardedProtocol === "http"
    ? `${forwardedProtocol}:` : requestUrl.protocol;
  return `${protocol}//${host}`;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" ||
    (origin && origin !== requestOrigin(request))) {
    throw new RequestError(403, "invalid-origin", "Please submit this form from AgentCoach.");
  }
}

export async function readJsonBody(request: Request, maxBytes = 16_384, maxReadMs = 5_000): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new RequestError(415, "validation", "Please submit a JSON form request.");
  }

  const length = request.headers.get("content-length");
  if (length && Number(length) > maxBytes) {
    throw new RequestError(413, "validation", "Your submission is too large. Please shorten the notes.");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "validation", "Please submit a valid lead form.");

  let size = 0;
  const chunks: Uint8Array[] = [];
  const cancelBody = () => {
    // An underlying stream's cancellation promise can itself be stalled.
    void reader.cancel().catch(() => {});
  };
  let timedOut = false;
  const deadline = setTimeout(() => {
    timedOut = true;
    cancelBody();
  }, maxReadMs);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new RequestError(408, "request-timeout", "Your submission took too long to arrive. Please try again.");
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        cancelBody();
        throw new RequestError(413, "validation", "Your submission is too large. Please shorten the notes.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, "validation", "Please submit a valid lead form.");
  } finally {
    clearTimeout(deadline);
    reader.releaseLock();
  }
}

export function createRateLimiter(maxRequests = 5, windowMs = 60_000, maxEntries = 1000) {
  const requests = new Map<string, { count: number; resetAt: number }>();
  return (key: string, now = Date.now()) => {
    for (const [entryKey, entry] of requests) {
      if (entry.resetAt <= now) requests.delete(entryKey);
    }
    let current = requests.get(key);
    if (!current) {
      if (requests.size >= maxEntries) return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
      current = { count: 0, resetAt: now + windowMs };
      requests.set(key, current);
    }
    current.count += 1;
    return { allowed: current.count <= maxRequests, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  };
}
