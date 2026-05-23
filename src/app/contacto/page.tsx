import { Mail, MapPin, Phone } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export const metadata = {
  title: "Contacto · Lirios",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
        Contáctanos
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
        Háblanos. Te ayudamos.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Pedidos especiales, eventos, suscripciones semanales — escríbenos o
        pásate por el local.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <Row
            icon={<MapPin className="size-5" />}
            title="Visítanos"
            body="Av. de las Flores 142, Colonia Jardín, CDMX"
            sub="Frente al parque, junto a la panadería."
          />
          <Row
            icon={<Phone className="size-5" />}
            title="Llamada o WhatsApp"
            body="+52 55 1234 5678"
            sub="Lun–Sáb, 9:00 a 19:00."
          />
          <Row
            icon={<Mail className="size-5" />}
            title="Correo"
            body="hola@lirios.mx"
            sub="Respondemos en menos de 24 h."
          />
          <Row
            icon={<InstagramIcon className="size-5" />}
            title="Instagram"
            body="@lirios"
            sub="Ahí publicamos lo nuevo cada semana."
          />
        </div>

        <div
          className="rounded-2xl border border-border/60 p-6"
          style={{ background: "var(--secondary)" }}
        >
          <h2 className="font-display text-2xl tracking-tight">
            Pedidos para eventos
          </h2>
          <p className="mt-3 text-sm text-secondary-foreground/80">
            Bodas, cumpleaños, oficinas — cotizamos sin compromiso. Mándanos un
            correo con la fecha, presupuesto aproximado y referencias visuales.
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest text-secondary-foreground/60">
            Próximamente
          </p>
          <p className="mt-1 text-sm text-secondary-foreground/80">
            Formulario integrado y confirmación por correo automática.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  body,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  sub: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 font-display text-xl">{body}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
