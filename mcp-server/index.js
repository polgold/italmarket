#!/usr/bin/env node
// MCP server for italmarket.com.ar WooCommerce cart.
// Transport: stdio. Register in Claude Code via `claude mcp add`.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  searchProducts,
  getProduct,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  getCheckoutUrl,
  getCartUrl,
  getState,
  resetCart,
  pairWithBrowser,
  pushTokenToBrowser,
} from "./store-client.js";

const server = new Server(
  { name: "italmarket-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const tools = [
  {
    name: "product_search",
    description:
      "Busca productos en italmarket.com.ar por nombre/palabra clave. Devuelve id, nombre, slug, precio, stock y descripción corta.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Texto a buscar" },
        per_page: { type: "number", default: 10, minimum: 1, maximum: 50 },
        category: {
          type: "number",
          description: "ID de categoría para filtrar (opcional)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "product_get",
    description:
      "Obtiene un producto por ID numérico o slug. Útil antes de agregarlo al carrito.",
    inputSchema: {
      type: "object",
      properties: { id_or_slug: { type: ["string", "number"] } },
      required: ["id_or_slug"],
    },
  },
  {
    name: "cart_get",
    description:
      "Devuelve el estado actual del carrito: items, subtotales, totales y cupones.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cart_add_item",
    description:
      "Agrega un producto al carrito por ID. Si ya está, Woo incrementa la cantidad.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "ID del producto" },
        quantity: { type: "number", default: 1, minimum: 1 },
      },
      required: ["id"],
    },
  },
  {
    name: "cart_update_item",
    description:
      "Cambia la cantidad de un item en el carrito. Usa la 'key' que devuelve cart_get (no el product id).",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Item key del cart_get" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["key", "quantity"],
    },
  },
  {
    name: "cart_remove_item",
    description: "Elimina un item del carrito por 'key'.",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string" } },
      required: ["key"],
    },
  },
  {
    name: "cart_clear",
    description: "Vacía todo el carrito.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cart_apply_coupon",
    description: "Aplica un código de cupón al carrito.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
    },
  },
  {
    name: "cart_remove_coupon",
    description: "Quita un cupón aplicado al carrito.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
    },
  },
  {
    name: "cart_checkout_url",
    description:
      "Devuelve la URL de checkout y la URL del carrito en el sitio, junto al cart-token actual (para abrir el carrito ya armado en el navegador).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cart_pair",
    description:
      "Conecta este MCP con el carrito del navegador del usuario. El usuario debe apretar 'Conectar con Claude' en el sitio, que le muestra un código de 6 dígitos. Pasando ese código acá, el MCP adopta el Cart-Token del browser y ambos comparten el mismo carrito de WooCommerce.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Código de 6 dígitos mostrado en el sitio" },
      },
      required: ["code"],
    },
  },
  {
    name: "cart_push_to_browser",
    description:
      "Envía el Cart-Token actual del MCP al sitio Next.js, para que el navegador adopte el mismo carrito. Útil si armaste el carrito por terminal y ahora querés verlo en el browser. El usuario debe recargar la página.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "cart_reset_session",
    description:
      "Descarta el cart-token guardado localmente y empieza un carrito nuevo en la próxima llamada. No vacía el carrito en Woo — solo olvida la sesión.",
    inputSchema: { type: "object", properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

// ---------- Formatters (compact so the model reads less noise) ----------

function fmtMoney(value, totals) {
  // Store API returns money as minor units when currency_minor_unit is set.
  const minor = totals?.currency_minor_unit ?? 2;
  const sym = totals?.currency_symbol ?? "$";
  const num = Number(value) / Math.pow(10, minor);
  return `${sym}${num.toFixed(minor)}`;
}

function summarizeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.prices ? fmtMoney(p.prices.price, p.prices) : p.price,
    regular_price: p.prices ? fmtMoney(p.prices.regular_price, p.prices) : undefined,
    on_sale: p.on_sale,
    in_stock: p.is_in_stock,
    short_description: (p.short_description || "")
      .replace(/<[^>]+>/g, "")
      .trim()
      .slice(0, 200),
    permalink: p.permalink,
  };
}

function summarizeCart(cart) {
  return {
    item_count: cart.items_count,
    items: cart.items.map((i) => ({
      key: i.key,
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unit_price: fmtMoney(i.prices.price, i.totals),
      line_total: fmtMoney(i.totals.line_total, i.totals),
      variation: i.variation,
    })),
    coupons: cart.coupons?.map((c) => c.code) ?? [],
    totals: {
      items: fmtMoney(cart.totals.total_items, cart.totals),
      discount: fmtMoney(cart.totals.total_discount, cart.totals),
      shipping: cart.totals.total_shipping
        ? fmtMoney(cart.totals.total_shipping, cart.totals)
        : null,
      tax: fmtMoney(cart.totals.total_tax, cart.totals),
      total: fmtMoney(cart.totals.total_price, cart.totals),
      currency: cart.totals.currency_code,
    },
  };
}

function ok(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(e) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `Error: ${e.message}${e.data ? `\n${JSON.stringify(e.data, null, 2)}` : ""}`,
      },
    ],
  };
}

// ---------- Dispatcher ----------

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  try {
    switch (name) {
      case "product_search": {
        const list = await searchProducts(args.query, {
          per_page: args.per_page,
          category: args.category,
        });
        return ok(list.map(summarizeProduct));
      }
      case "product_get": {
        const p = await getProduct(args.id_or_slug);
        return ok(p ? summarizeProduct(p) : null);
      }
      case "cart_get": {
        return ok(summarizeCart(await getCart()));
      }
      case "cart_add_item": {
        const cart = await addCartItem(args.id, args.quantity ?? 1);
        return ok(summarizeCart(cart));
      }
      case "cart_update_item": {
        const cart = await updateCartItem(args.key, args.quantity);
        return ok(summarizeCart(cart));
      }
      case "cart_remove_item": {
        const cart = await removeCartItem(args.key);
        return ok(summarizeCart(cart));
      }
      case "cart_clear": {
        const cart = await clearCart();
        return ok(summarizeCart(cart));
      }
      case "cart_apply_coupon": {
        const cart = await applyCoupon(args.code);
        return ok(summarizeCart(cart));
      }
      case "cart_remove_coupon": {
        const cart = await removeCoupon(args.code);
        return ok(summarizeCart(cart));
      }
      case "cart_checkout_url": {
        const s = getState();
        return ok({
          cart_url: getCartUrl(),
          checkout_url: getCheckoutUrl(),
          cart_token: s.cartToken,
          hint: "Para ver este mismo carrito en el navegador, el sitio debe enviar el header Cart-Token al Store API (o usar la sesión de Woo).",
        });
      }
      case "cart_pair": {
        const result = await pairWithBrowser(args.code);
        return ok({ paired: true, ...result });
      }
      case "cart_push_to_browser": {
        const result = await pushTokenToBrowser();
        return ok({ pushed: true, ...result });
      }
      case "cart_reset_session": {
        resetCart();
        return ok({ reset: true });
      }
      default:
        return err(new Error(`Tool desconocida: ${name}`));
    }
  } catch (e) {
    return err(e);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
