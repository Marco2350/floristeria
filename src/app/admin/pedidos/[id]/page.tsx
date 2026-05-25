import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Package, User } from "lucide-react";
import { getOrder } from "@/lib/server/storage";
import { formatPrice, getFlower, getWrap, getRibbon } from "@/lib/data";
import { OrderStatusControl } from "./status-control";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a pedidos
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {order.id}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            {order.customer.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("es-HN", { dateStyle: "full", timeStyle: "short" })}
          </p>
        </div>
        <OrderStatusControl id={order.id} initial={order.status} />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg">
              <Package className="mr-2 inline size-4" />
              Productos
            </h2>
            <ul className="mt-4 divide-y divide-border/40">
              {order.items.map((item, i) => (
                <li key={i} className="py-4">
                  {item.type === "product" ? (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.qty} {item.qty > 1 ? "unidades" : "unidad"}
                        </p>
                      </div>
                      <span className="tabular-nums">{formatPrice(item.unitPrice * item.qty)}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">Ramo personalizado</p>
                        <span className="tabular-nums">{formatPrice(item.unitPrice * item.qty)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getWrap(item.wrapId)?.name} · {getRibbon(item.ribbonId)?.name}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.flowers.map((f) => {
                          const fl = getFlower(f.flowerId);
                          return (
                            <span
                              key={f.flowerId}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-xs"
                            >
                              <span
                                className="size-2 rounded-full"
                                style={{ background: fl?.color }}
                              />
                              {fl?.name} × {f.qty}
                            </span>
                          );
                        })}
                      </div>
                      {item.cardMessage && (
                        <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm italic">
                          "{item.cardMessage}"
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Notes */}
          {order.notes && (
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-lg">Notas</h2>
              <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-display text-base">
              <User className="mr-1 inline size-4" /> Contacto
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Nombre" value={order.customer.name} />
              <Row label="Correo" value={order.customer.email} />
              <Row label="Teléfono" value={order.customer.phone} />
            </dl>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-display text-base">
              <MapPin className="mr-1 inline size-4" /> Entrega
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row
                label="Método"
                value={order.delivery.method === "envio" ? "Envío a domicilio" : "Recoger en tienda"}
              />
              <Row label="Fecha" value={order.delivery.date} />
              <Row label="Horario" value={order.delivery.timeSlot} />
              {order.delivery.address && <Row label="Dirección" value={order.delivery.address} />}
              {order.delivery.city && <Row label="Ciudad" value={order.delivery.city} />}
              {order.delivery.zone && <Row label="Zona" value={order.delivery.zone} />}
              {order.delivery.recipientName && (
                <Row
                  label="Destinatario"
                  value={`${order.delivery.recipientName}${order.delivery.recipientPhone ? ` · ${order.delivery.recipientPhone}` : ""}`}
                />
              )}
              {order.delivery.surprise && <Row label="Sorpresa" value="Sí" />}
              {order.delivery.cardMessage && (
                <div className="rounded-lg bg-muted/40 p-3 text-sm italic">
                  "{order.delivery.cardMessage}"
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-display text-base">
              <Calendar className="mr-1 inline size-4" /> Totales
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Envío" value={formatPrice(order.shipping)} />
              {order.discount && (
                <Row
                  label={`Descuento (${order.discount.code})`}
                  value={`−${formatPrice(order.discount.amount)}`}
                />
              )}
              <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-base font-medium">
                <dt>Total</dt>
                <dd className="font-display text-xl tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
