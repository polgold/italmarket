/**
 * Ephemeral in-memory store for cart pairing codes.
 *
 * Flow:
 *   1. Browser calls POST /api/cart/pair → we generate a 6-digit code and
 *      associate it with the browser's current Cart-Token.
 *   2. User tells Claude "pareá con 123456".
 *   3. MCP server calls GET /api/cart/pair?code=123456 → we return the
 *      cart_token and delete the code (single-use).
 *
 * Codes expire after 5 minutes. Lives in module scope so it survives across
 * API route invocations within the same Next.js process — fine for dev and
 * single-instance deploys. For multi-instance prod, swap with Redis.
 */

type PairEntry = { token: string; expiresAt: number };

const TTL_MS = 5 * 60 * 1000;

// Use globalThis so hot-reload in dev doesn't lose pending pairings.
const g = globalThis as unknown as { __italmarketPair?: Map<string, PairEntry> };
const store: Map<string, PairEntry> = g.__italmarketPair ?? new Map();
if (!g.__italmarketPair) g.__italmarketPair = store;

function sweep() {
  const now = Date.now();
  for (const [code, entry] of store) {
    if (entry.expiresAt <= now) store.delete(code);
  }
}

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function createPairingCode(token: string): { code: string; expiresAt: number } {
  sweep();
  let code = randomCode();
  // Avoid collisions with any live code.
  while (store.has(code)) code = randomCode();
  const expiresAt = Date.now() + TTL_MS;
  store.set(code, { token, expiresAt });
  return { code, expiresAt };
}

export function consumePairingCode(code: string): string | null {
  sweep();
  const entry = store.get(code);
  if (!entry) return null;
  store.delete(code);
  return entry.token;
}
