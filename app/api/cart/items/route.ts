import { NextRequest, NextResponse } from "next/server";
import { wcStore } from "@/lib/wc-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(e: unknown) {
  return NextResponse.json(
    { error: (e as Error).message },
    { status: (e as { status?: number }).status ?? 500 },
  );
}

// POST /api/cart/items — add item { id, quantity }
export async function POST(req: NextRequest) {
  try {
    const { id, quantity = 1 } = (await req.json()) as { id: number; quantity?: number };
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const cart = await wcStore.addItem(id, quantity);
    return NextResponse.json(cart);
  } catch (e) {
    return fail(e);
  }
}

// PATCH /api/cart/items — update quantity { key, quantity }
export async function PATCH(req: NextRequest) {
  try {
    const { key, quantity } = (await req.json()) as { key: string; quantity: number };
    if (!key) return NextResponse.json({ error: "Missing item key" }, { status: 400 });
    const cart =
      quantity <= 0 ? await wcStore.removeItem(key) : await wcStore.updateItem(key, quantity);
    return NextResponse.json(cart);
  } catch (e) {
    return fail(e);
  }
}

// DELETE /api/cart/items?key=... — remove a single item
export async function DELETE(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) return NextResponse.json({ error: "Missing item key" }, { status: 400 });
    const cart = await wcStore.removeItem(key);
    return NextResponse.json(cart);
  } catch (e) {
    return fail(e);
  }
}
