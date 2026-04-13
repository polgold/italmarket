#!/usr/bin/env node
const readline = require('node:readline');

const BASE = 'https://shop.italmarket.com.ar';
const TOKEN_ENDPOINT = `${BASE}/wp-json/jwt-auth/v1/token`;
const MCP_ENDPOINT = `${BASE}/wp-json/wp/v2/wpmcp/streamable`;
const TOKEN_REFRESH_MARGIN_MS = 60_000;

function log(msg) {
  process.stderr.write(`italmarket-wp: ${msg}\n`);
}

function die(msg, err) {
  log(`${msg}${err ? ` — ${err.stack || err.message || err}` : ''}`);
  process.exit(1);
}

const user = process.env.WP_USER;
const pass = process.env.WP_APP_PASSWORD;
if (!user || !pass) die('missing WP_USER or WP_APP_PASSWORD');

const cleanPass = pass.replace(/\s+/g, '');

if (typeof fetch !== 'function') {
  die('global fetch() missing — Node 18+ required');
}

let cachedToken = null;
let cachedExpiresAt = 0;
let sessionId = null;
let tokenRefreshInFlight = null;

async function fetchFreshToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: cleanPass }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`token endpoint returned HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`token endpoint returned non-JSON: ${text.slice(0, 300)}`);
  }
  if (!parsed.token) {
    throw new Error(`token endpoint missing 'token' field: ${text.slice(0, 300)}`);
  }
  const expiresAt = parsed.expires_at
    ? parsed.expires_at * 1000
    : Date.now() + (parsed.expires_in ?? 3600) * 1000;
  return { token: parsed.token, expiresAt };
}

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < cachedExpiresAt - TOKEN_REFRESH_MARGIN_MS) {
    return cachedToken;
  }
  if (tokenRefreshInFlight) return tokenRefreshInFlight;
  tokenRefreshInFlight = (async () => {
    try {
      const { token, expiresAt } = await fetchFreshToken();
      cachedToken = token;
      cachedExpiresAt = expiresAt;
      log(`obtained fresh JWT, expires at ${new Date(expiresAt).toISOString()}`);
      return token;
    } finally {
      tokenRefreshInFlight = null;
    }
  })();
  return tokenRefreshInFlight;
}

function writeOut(text) {
  const trimmed = text.trim();
  if (trimmed) process.stdout.write(trimmed + '\n');
}

function parseRequestId(line) {
  try {
    const msg = JSON.parse(line);
    return 'id' in msg ? msg.id : null;
  } catch {
    return null;
  }
}

function emitJsonRpcError(id, code, message, data) {
  const payload = { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
  if (data !== undefined) payload.error.data = data;
  writeOut(JSON.stringify(payload));
}

function looksLikeJsonRpc(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && parsed.jsonrpc === '2.0';
  } catch {
    return false;
  }
}

async function forwardSse(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const event = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      for (const ln of event.split('\n')) {
        if (ln.startsWith('data:')) writeOut(ln.slice(5).trimStart());
      }
    }
  }
}

async function postWithToken(line, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    Authorization: `Bearer ${token}`,
  };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;
  return fetch(MCP_ENDPOINT, { method: 'POST', headers, body: line });
}

async function handleMessage(line) {
  if (!line.trim()) return;
  const requestId = parseRequestId(line);

  let token;
  try {
    token = await getToken();
  } catch (err) {
    log(`failed to obtain JWT — ${err.message}`);
    emitJsonRpcError(requestId, -32000, `Could not obtain JWT from WordPress: ${err.message}`);
    return;
  }

  let res;
  try {
    res = await postWithToken(line, token);
  } catch (err) {
    log(`fetch error — ${err.message}`);
    emitJsonRpcError(requestId, -32000, `Network error contacting WordPress: ${err.message}`);
    return;
  }

  if (res.status === 401 || res.status === 403) {
    log(`got ${res.status} from MCP endpoint, invalidating cached JWT and retrying once`);
    cachedToken = null;
    cachedExpiresAt = 0;
    try {
      token = await getToken();
      res = await postWithToken(line, token);
    } catch (err) {
      log(`retry failed — ${err.message}`);
      emitJsonRpcError(requestId, -32000, `Auth retry failed: ${err.message}`);
      return;
    }
  }

  const newSession = res.headers.get('mcp-session-id');
  if (newSession) sessionId = newSession;

  if (res.status === 202 || res.status === 204) return;

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('text/event-stream')) {
    await forwardSse(res.body);
    return;
  }

  const text = await res.text();
  if (looksLikeJsonRpc(text)) {
    writeOut(text);
    return;
  }

  log(`non-JSON-RPC response (HTTP ${res.status}): ${text.slice(0, 300)}`);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text };
  }
  const message = parsed?.message
    ? String(parsed.message).replace(/<[^>]+>/g, '')
    : `HTTP ${res.status} from WordPress MCP endpoint`;
  emitJsonRpcError(requestId, -32000, message, {
    httpStatus: res.status,
    wpCode: parsed?.code,
    wpData: parsed?.data,
  });
}

let chain = Promise.resolve();
const rl = readline.createInterface({ input: process.stdin });

rl.on('line', (line) => {
  chain = chain.then(() => handleMessage(line)).catch((err) => log(`handler error — ${err.stack || err.message}`));
});

rl.on('close', () => {
  chain.finally(() => process.exit(0));
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => process.exit(0));
}
