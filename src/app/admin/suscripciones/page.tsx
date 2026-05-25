import { listSubscriptions } from "@/lib/server/storage";

export default async function AdminSubscriptionsPage() {
  const subs = await listSubscriptions();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Suscripciones
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Clientes recurrentes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {subs.length} {subs.length === 1 ? "suscripción" : "suscripciones"} totales
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {subs.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">
            Sin suscripciones todavía.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Plan / Tamaño</th>
                <th className="px-4 py-3 text-left">Primera entrega</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subs.map((s) => (
                <tr key={s.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{s.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{s.plan} · {s.size}</td>
                  <td className="px-4 py-3">{s.startDate}</td>
                  <td className="px-4 py-3 capitalize">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
