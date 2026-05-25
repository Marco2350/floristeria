import Link from "next/link";
import { listOrders } from "@/lib/server/storage";
import { formatPrice } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
            Pedidos
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Todos los pedidos
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">
            Todavía no hay pedidos. Cuando los haya, aparecen aquí.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Pedido</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Entrega</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={`/admin/pedidos/${o.id}`}
                      className="font-mono text-xs font-medium text-primary hover:underline"
                    >
                      {o.id}
                    </Link>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString("es-HN")}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium">{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p>{o.delivery.method === "envio" ? "Envío" : "Recoger"}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.delivery.date} · {o.delivery.timeSlot}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right align-top tabular-nums">
                    {formatPrice(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
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
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest ${STATUS_STYLES[status] || "bg-muted"}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
