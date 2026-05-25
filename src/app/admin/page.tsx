import Link from "next/link";
import {
  listOrders,
  listSubscriptions,
  listSubscribers,
  listContactMessages,
} from "@/lib/server/storage";
import { formatPrice, products } from "@/lib/data";
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Package,
  Repeat,
  ShoppingBag,
} from "lucide-react";

export default async function AdminDashboard() {
  const [orders, subs, subscribers, contactMessages] = await Promise.all([
    listOrders(),
    listSubscriptions(),
    listSubscribers(),
    listContactMessages(),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter((o) => new Date(o.createdAt) >= today);
  const revenueToday = ordersToday.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pendiente").length;
  const activeSubs = subs.filter((s) => s.status === "activa").length;

  return (
    <div className="space-y-8">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Panel
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">
          Buenos días.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Resumen de hoy y operación. Empieza por las cosas que te piden tu
          atención.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Ventas de hoy"
          value={formatPrice(revenueToday)}
          sub={`${ordersToday.length} ${ordersToday.length === 1 ? "pedido" : "pedidos"}`}
          icon={<ShoppingBag className="size-4" />}
        />
        <KpiCard
          label="Pendientes"
          value={String(pending)}
          sub="Requieren confirmación"
          icon={<Package className="size-4" />}
          accent={pending > 0}
        />
        <KpiCard
          label="Suscripciones activas"
          value={String(activeSubs)}
          sub={`de ${subs.length} totales`}
          icon={<Repeat className="size-4" />}
        />
        <KpiCard
          label="Newsletter"
          value={String(subscribers.length)}
          sub="suscriptores"
          icon={<Mail className="size-4" />}
        />
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Pedidos recientes</h2>
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Ver todos <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No hay pedidos todavía.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border/40">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm transition hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{o.customer.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.id} · {new Date(o.createdAt).toLocaleString("es-HN")}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                    <span className="shrink-0 text-sm tabular-nums">
                      {formatPrice(o.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent contact messages */}
        <section className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Mensajes</h2>
            <Link
              href="/admin/contactos"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Ver todos <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {contactMessages.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No hay mensajes nuevos.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {contactMessages.slice(0, 5).map((m) => (
                <li key={m.id} className="rounded-lg border border-border/40 bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{m.name}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString("es-HN")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-display text-xl">Acciones rápidas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/pedidos"
            label="Ver pedidos del día"
            icon={<ShoppingBag />}
          />
          <QuickAction
            href="/admin/productos"
            label="Marcar productos agotados"
            icon={<Package />}
          />
          <QuickAction
            href="/admin/cupones"
            label="Crear cupón"
            icon={<MessageSquare />}
          />
          <QuickAction
            href="/admin/newsletter"
            label="Exportar suscriptores"
            icon={<Mail />}
          />
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 transition ${accent ? "border-primary/40 ring-1 ring-primary/15" : "border-border/60"}`}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <p className="mt-2 font-display text-3xl tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-900",
  confirmado: "bg-blue-100 text-blue-900",
  preparando: "bg-purple-100 text-purple-900",
  "en-camino": "bg-emerald-100 text-emerald-900",
  entregado: "bg-emerald-200 text-emerald-950",
  cancelado: "bg-stone-200 text-stone-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest ${STATUS_STYLES[status] || "bg-muted"}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
