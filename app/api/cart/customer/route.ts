import { NextRequest, NextResponse } from "next/server";
import { wcStore, type StoreAddress, type StoreBillingAddress } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cart/customer
 *
 * Updates the cart's billing + shipping address. Woo uses these to calculate
 * applicable shipping rates, which come back on the same response so the
 * client can render the options immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      billing_address: StoreBillingAddress;
      shipping_address: StoreAddress;
    };
    const cart = await wcStore.updateCustomer(body);
    return NextResponse.json(cart);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status ?? 500 },
    );
  }
}
