import { NextRequest, NextResponse } from "next/server";
import { wcStore, type StoreAddress, type StoreBillingAddress } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 *
 * Places the order via WC Store API. Woo creates a real WooCommerce order
 * (persisted, visible in wp-admin) and returns its metadata plus a redirect
 * URL for the chosen payment method. For bacs (transferencia) the order is
 * immediately "on-hold" — the buyer sees confirmation + bank details and the
 * shop admin marks it paid once the transfer clears.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      billing_address: StoreBillingAddress;
      shipping_address: StoreAddress;
      payment_method: string;
      customer_note?: string;
    };

    if (!body.billing_address?.email) {
      return NextResponse.json({ error: "Missing billing email" }, { status: 400 });
    }
    if (!body.payment_method) {
      return NextResponse.json({ error: "Missing payment_method" }, { status: 400 });
    }

    const order = await wcStore.placeOrder(body);
    return NextResponse.json(order);
  } catch (e) {
    // Woo returns structured errors with helpful messages; surface them.
    const err = e as { message?: string; status?: number; data?: { message?: string } };
    return NextResponse.json(
      { error: err.data?.message || err.message || "Checkout failed" },
      { status: err.status ?? 500 },
    );
  }
}
