import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { BUSINESS } from "@/lib/business";

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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.5h2.55l.38-2.97H13.5V8.65c0-.86.24-1.45 1.48-1.45h1.58V4.55c-.27-.04-1.2-.12-2.29-.12-2.27 0-3.82 1.39-3.82 3.93v2.18H7.9v2.97h2.55V21h3.05Z" />
    </svg>
  );
}

export const metadata = {
  title: "Contacto · Lirios",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
        Contáctanos
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
        Háblanos. Te ayudamos.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Pedidos especiales, eventos, suscripciones semanales — escríbenos o
        pásate por el local en Plaza Rosamanda.
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <Row
            icon={<MapPin className="size-5" />}
            title="Visítanos"
            body={
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {BUSINESS.address.line1}
              </a>
            }
            sub={`${BUSINESS.address.line2} · ${BUSINESS.address.cityFull}. Envíos disponibles.`}
          />
          <Row
            icon={<Phone className="size-5" />}
            title="Llamada o WhatsApp"
            body={
              <a
                href={`tel:${BUSINESS.phone.tel}`}
                className="hover:underline"
              >
                {BUSINESS.phone.display}
              </a>
            }
            sub="Te respondemos en horario de tienda."
          />
          <Row
            icon={<Clock className="size-5" />}
            title="Horario"
            body={`${BUSINESS.hours.weekdays.label}: ${BUSINESS.hours.weekdays.range}`}
            sub={`${BUSINESS.hours.sunday.label}: ${BUSINESS.hours.sunday.range}`}
          />
          <Row
            icon={<Mail className="size-5" />}
            title="Correo"
            body={
              <a
                href={`mailto:${BUSINESS.email}`}
                className="hover:underline"
              >
                {BUSINESS.email}
              </a>
            }
            sub="Respondemos en menos de 24 h."
          />
          <Row
            icon={<InstagramIcon className="size-5" />}
            title="Instagram"
            body={
              <a
                href={BUSINESS.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {BUSINESS.social.instagram.handle}
              </a>
            }
            sub="Lo nuevo del taller, cada semana."
          />
          <Row
            icon={<FacebookIcon className="size-5" />}
            title="Facebook"
            body={
              <a
                href={BUSINESS.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {BUSINESS.social.facebook.handle}
              </a>
            }
            sub="También nos encuentras aquí."
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl tracking-tight">
            Escríbenos un mensaje
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuéntanos qué necesitas — pedido especial, evento, dudas. Te
            contestamos en menos de 24 horas hábiles.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
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
  body: React.ReactNode;
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
