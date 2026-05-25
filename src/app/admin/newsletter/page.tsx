import { listSubscribers } from "@/lib/server/storage";
import { NewsletterExport } from "./export-btn";

export default async function AdminNewsletterPage() {
  const subs = await listSubscribers();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
            Newsletter
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Suscriptores
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {subs.length} {subs.length === 1 ? "suscriptor" : "suscriptores"}
          </p>
        </div>
        <NewsletterExport subscribers={subs} />
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {subs.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">
            Sin suscriptores todavía.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Origen</th>
                <th className="px-4 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subs.map((s) => (
                <tr key={s.email}>
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.source}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(s.subscribedAt).toLocaleString("es-HN")}
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
