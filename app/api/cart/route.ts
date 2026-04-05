import { NextResponse } from "next/server";
import { wcStore } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cart = await wcStore.getCart();
    return NextResponse.json(cart);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status ?? 500 },
    );
  }
}

export async function DELETE() {
  try {
    const cart = await wcStore.clearCart();
    return NextResponse.json(cart);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status ?? 500 },
    );
  }
}
