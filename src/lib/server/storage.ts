import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDir();
    const full = path.join(DATA_DIR, file);
    const text = await fs.readFile(full, "utf-8");
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  await fs.writeFile(full, JSON.stringify(data, null, 2), "utf-8");
}

/* ── Orders ───────────────────────────────────────────────── */
export type OrderItem =
  | { type: "product"; productId: string; qty: number; unitPrice: number; title: string }
  | {
      type: "custom";
      qty: number;
      unitPrice: number;
      flowers: { flowerId: string; qty: number }[];
      wrapId: string;
      ribbonId: string;
      cardMessage: string;
    };

export type Order = {
  id: string;
  createdAt: string;
  status: "pendiente" | "confirmado" | "preparando" | "en-camino" | "entregado" | "cancelado";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: "envio" | "pickup";
    date: string; // YYYY-MM-DD
    timeSlot: string; // "09:00-13:00" etc.
    address?: string;
    city?: string;
    zone?: string;
    zonePrice: number;
    recipientName?: string;
    recipientPhone?: string;
    cardMessage?: string;
    surprise: boolean;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: { code: string; amount: number } | null;
  total: number;
  notes?: string;
};

export async function listOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json", []);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await listOrders();
  return orders.find((o) => o.id === id);
}

export async function createOrder(o: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const orders = await listOrders();
  const order: Order = {
    ...o,
    id: `LIR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "pendiente",
  };
  orders.unshift(order);
  await writeJson("orders.json", orders);
  return order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
  const orders = await listOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx].status = status;
  await writeJson("orders.json", orders);
  return orders[idx];
}

/* ── Newsletter ───────────────────────────────────────────── */
export type Subscriber = {
  email: string;
  subscribedAt: string;
  source: "footer" | "popup" | "checkout";
};

export async function addSubscriber(email: string, source: Subscriber["source"]): Promise<boolean> {
  const subs = await readJson<Subscriber[]>("newsletter.json", []);
  if (subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) return false;
  subs.push({ email, subscribedAt: new Date().toISOString(), source });
  await writeJson("newsletter.json", subs);
  return true;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  return readJson<Subscriber[]>("newsletter.json", []);
}

/* ── Subscriptions (recurring) ────────────────────────────── */
export type FlowerSubscription = {
  id: string;
  createdAt: string;
  status: "activa" | "pausada" | "cancelada";
  customer: { name: string; email: string; phone: string; address: string; city: string };
  plan: "semanal" | "quincenal" | "mensual";
  size: "petit" | "clasico" | "grande";
  preferences: { palette: string; notes: string };
  startDate: string;
};

export async function createSubscription(
  s: Omit<FlowerSubscription, "id" | "createdAt" | "status">,
): Promise<FlowerSubscription> {
  const list = await readJson<FlowerSubscription[]>("subscriptions.json", []);
  const sub: FlowerSubscription = {
    ...s,
    id: `SUB-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "activa",
  };
  list.unshift(sub);
  await writeJson("subscriptions.json", list);
  return sub;
}

export async function listSubscriptions(): Promise<FlowerSubscription[]> {
  return readJson<FlowerSubscription[]>("subscriptions.json", []);
}

/* ── Discounts ────────────────────────────────────────────── */
export type DiscountCode = {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
  active: boolean;
  description: string;
};

const DEFAULT_DISCOUNTS: DiscountCode[] = [
  { code: "BIENVENIDA10", type: "percent", value: 10, minSubtotal: 0, active: true, description: "10% en tu primer pedido" },
  { code: "MAMA20", type: "percent", value: 20, minSubtotal: 600, active: true, description: "20% Día de la Madre — desde L. 600" },
  { code: "ENVIOGRATIS", type: "flat", value: 80, minSubtotal: 500, active: true, description: "Envío gratis — desde L. 500" },
];

export async function listDiscounts(): Promise<DiscountCode[]> {
  const stored = await readJson<DiscountCode[] | null>("discounts.json", null);
  if (stored === null) {
    await writeJson("discounts.json", DEFAULT_DISCOUNTS);
    return DEFAULT_DISCOUNTS;
  }
  return stored;
}

export async function saveDiscounts(codes: DiscountCode[]): Promise<void> {
  await writeJson("discounts.json", codes);
}

export async function findDiscount(code: string): Promise<DiscountCode | undefined> {
  const codes = await listDiscounts();
  return codes.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
}

/* ── Product overrides (admin) ────────────────────────────── */
export type ProductOverride = {
  id: string;
  outOfStock?: boolean;
  priceOverride?: number;
  hidden?: boolean;
};

export async function listOverrides(): Promise<ProductOverride[]> {
  return readJson<ProductOverride[]>("product-overrides.json", []);
}

export async function saveOverride(o: ProductOverride): Promise<void> {
  const list = await listOverrides();
  const idx = list.findIndex((x) => x.id === o.id);
  if (idx === -1) list.push(o);
  else list[idx] = { ...list[idx], ...o };
  await writeJson("product-overrides.json", list);
}

/* ── Contact messages ─────────────────────────────────────── */
export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
};

export async function addContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt">,
): Promise<ContactMessage> {
  const list = await readJson<ContactMessage[]>("contact.json", []);
  const msg: ContactMessage = {
    ...data,
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(msg);
  await writeJson("contact.json", list);
  return msg;
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  return readJson<ContactMessage[]>("contact.json", []);
}
