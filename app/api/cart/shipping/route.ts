import { NextRequest, NextResponse } from "next/server";
import { wcStore } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cart/shipping
 * Body: { package_id: number, rate_id: string }
 *
 * Selects one of the shipping rates Woo quoted for the current cart.
 */
export async function POST(req: NextRequest) {
  try {
    const { package_id, rate_id } = (await req.json()) as {
      package_id: number;
      rate_id: string;
    };
    if (rate_id === undefined || package_id === undefined) {
      return NextResponse.json({ error: "Missing package_id or rate_id" }, { status: 400 });
    }
    const cart = await wcStore.selectShippingRate(package_id, rate_id);
    return NextResponse.json(cart);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status ?? 500 },
    );
  }
}
