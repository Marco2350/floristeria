import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/content";
import { BUSINESS } from "@/lib/business";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";

export const metadata = {
  title: "Preguntas frecuentes · Lirios",
  description:
    "Entregas, frescura, personalización, pagos. Aquí están las respuestas.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <Reveal>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Preguntas frecuentes
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Lo que la gente nos pregunta.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Si no encuentras tu respuesta, escríbenos por WhatsApp. Te
          contestamos en menos de una hora en horario hábil.
        </p>
      </Reveal>

      <div className="mt-14 space-y-12">
        {faqs.map((section) => (
          <Reveal key={section.category}>
            <section>
              <h2 className="font-display text-xl uppercase tracking-widest text-muted-foreground">
                {section.category}
              </h2>
              <div className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
                {section.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 transition hover:bg-muted/30">
                      <span className="font-display text-lg tracking-tight">
                        {item.q}
                      </span>
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* Contact CTA */}
      <Reveal>
        <div className="mt-20 rounded-3xl border border-border/60 bg-primary px-6 py-12 text-primary-foreground sm:px-12">
          <h2 className="font-display text-3xl tracking-tight">
            ¿Te queda alguna duda?
          </h2>
          <p className="mt-3 max-w-md opacity-90">
            Cualquier cosa, escríbenos. Mejor que adivines.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${BUSINESS.phone.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${BUSINESS.phone.tel}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-2.5 text-sm font-medium transition hover:bg-primary-foreground/10"
            >
              <Phone className="size-4" />
              Llamar
            </a>
            <a
              href={`mailto:${BUSINESS.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-2.5 text-sm font-medium transition hover:bg-primary-foreground/10"
            >
              <Mail className="size-4" />
              Correo
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
