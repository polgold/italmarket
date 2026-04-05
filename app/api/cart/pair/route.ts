import { NextRequest, NextResponse } from "next/server";
import { consumePairingCode, createPairingCode } from "@/lib/pair-store";
import { ensureCartToken, writeCartTokenCookie } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cart/pair
 *
 * Called by the browser. Ensures the browser has a Cart-Token, then registers
 * a short-lived 6-digit pairing code for the MCP server to consume. Returns
 * { code, expires_in_seconds }.
 */
export async function POST() {
  try {
    const token = await ensureCartToken();
    if (!token) {
      return NextResponse.json(
        { error: "Could not obtain a cart token from WooCommerce" },
        { status: 502 },
      );
    }
    const { code, expiresAt } = createPairingCode(token);
    return NextResponse.json({
      code,
      expires_in_seconds: Math.round((expiresAt - Date.now()) / 1000),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/**
 * GET /api/cart/pair?code=123456
 *
 * Called by the MCP server. Exchanges a pairing code for the browser's
 * current Cart-Token. The code is consumed (single-use).
 *
 * PUT /api/cart/pair?token=...
 * (Reverse flow) The MCP server pushes its current token to the browser.
 * Not exposed via GET so tokens don't leak into browser history/logs.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const token = consumePairingCode(code);
  if (!token) return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
  return NextResponse.json({ cart_token: token });
}

/**
 * PUT /api/cart/pair — browser adopts a token the MCP already has.
 * Body: { cart_token: string }
 */
export async function PUT(req: NextRequest) {
  try {
    const { cart_token } = (await req.json()) as { cart_token?: string };
    if (!cart_token) return NextResponse.json({ error: "Missing cart_token" }, { status: 400 });
    await writeCartTokenCookie(cart_token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
