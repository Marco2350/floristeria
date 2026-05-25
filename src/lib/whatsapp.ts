import { BUSINESS } from "./business";
import { formatPrice, getFlower, getWrap, getRibbon, products } from "./data";
import type { CartItem } from "./types";

export type CheckoutSnapshot = {
  recipientName?: string;
  recipientPhone?: string;
  address?: string;
  city?: string;
  zoneLabel?: string;
  date?: string;
  slot?: string;
  note?: string;
  surprise?: boolean;
  shipping?: number;
  discount?: { code: string; amount: number };
};

function lineForItem(item: CartItem): { title: string; details: string[]; unit: number } {
  if (item.type === "product") {
    const p = products.find((pp) => pp.id === item.productId);
    return {
      title: p?.name ?? "Producto",
      details: p?.shortDescription ? [p.shortDescription] : [],
      unit: p?.price ?? 0,
    };
  }
  const totalStems = item.config.flowers.reduce((s, f) => s + f.qty, 0);
  const flowerLines = item.config.flowers
    .map((f) => {
      const fl = getFlower(f.flowerId);
      return fl ? `${f.qty}× ${fl.name}` : null;
    })
    .filter(Boolean)
    .join(", ");
  const wrap = getWrap(item.config.wrapId);
  const ribbon = getRibbon(item.config.ribbonId);
  const details = [
    `${totalStems} tallos`,
    flowerLines,
    wrap?.name && `papel ${wrap.name.toLowerCase()}`,
    ribbon?.name && `listón ${ribbon.name.toLowerCase()}`,
    item.config.cardMessage && `dedicatoria: "${item.config.cardMessage}"`,
  ].filter(Boolean) as string[];
  return {
    title: "Ramo personalizado",
    details,
    unit: item.computedPrice,
  };
}

/**
 * Build a customer-friendly WhatsApp message describing the cart.
 * Returns a wa.me URL ready to open.
 */
export function buildWhatsappCartUrl(
  items: CartItem[],
  total: number,
  checkout?: CheckoutSnapshot,
): string {
  const lines: string[] = [];
  lines.push("¡Hola Lirios! Quiero hacer este pedido:");
  lines.push("");

  items.forEach((item, i) => {
    const li = lineForItem(item);
    const subtotal = li.unit * item.qty;
    lines.push(
      `${i + 1}. ${li.title} — ${formatPrice(li.unit)} × ${item.qty} = ${formatPrice(subtotal)}`,
    );
    li.details.forEach((d) => lines.push(`   · ${d}`));
  });

  lines.push("");

  if (checkout?.shipping && checkout.shipping > 0) {
    lines.push(`Envío (${checkout.zoneLabel ?? "zona"}): ${formatPrice(checkout.shipping)}`);
  }
  if (checkout?.discount) {
    lines.push(`Descuento (${checkout.discount.code}): -${formatPrice(checkout.discount.amount)}`);
  }
  lines.push(`*Total: ${formatPrice(total)}*`);

  if (
    checkout &&
    (checkout.recipientName ||
      checkout.address ||
      checkout.date ||
      checkout.slot ||
      checkout.note)
  ) {
    lines.push("");
    lines.push("Datos de entrega:");
    if (checkout.recipientName)
      lines.push(`• Para: ${checkout.recipientName}${checkout.recipientPhone ? ` (${checkout.recipientPhone})` : ""}`);
    if (checkout.address)
      lines.push(`• Dirección: ${checkout.address}${checkout.city ? `, ${checkout.city}` : ""}`);
    if (checkout.date)
      lines.push(`• Fecha: ${checkout.date}${checkout.slot ? ` (${checkout.slot})` : ""}`);
    if (checkout.surprise) lines.push("• Sorpresa: sí (no llamar al destinatario)");
    if (checkout.note) lines.push(`• Nota: ${checkout.note}`);
  }

  lines.push("");
  lines.push(
    "Quiero pagar por *efectivo* o *transferencia* — coordinemos por aquí. ¡Gracias!",
  );

  const text = encodeURIComponent(lines.join("\n"));
  const number = BUSINESS.phone.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${text}`;
}
