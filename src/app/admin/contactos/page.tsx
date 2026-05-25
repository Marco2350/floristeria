import { listContactMessages } from "@/lib/server/storage";

export default async function AdminContactsPage() {
  const messages = await listContactMessages();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Mensajes
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Contacto
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"}
        </p>
      </header>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
            Sin mensajes nuevos.
          </p>
        ) : (
          messages.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString("es-HN")}
                </span>
              </header>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
              <a
                href={`mailto:${m.email}`}
                className="mt-3 inline-block text-xs text-primary underline-offset-4 hover:underline"
              >
                Responder por correo →
              </a>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
