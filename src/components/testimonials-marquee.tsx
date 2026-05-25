import { Star, Quote } from "lucide-react";
import { testimonials, type Testimonial } from "@/lib/content";

export function TestimonialsMarquee() {
  // Duplicate so the loop is seamless (transform from 0 to -50%).
  const reel = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden border-y border-border/60 bg-card py-20">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display-md max-w-2xl text-balance">
            Pequeñas alegrías
            <br />
            <span className="italic" style={{ color: "var(--ochre-deep)" }}>
              que mandamos
            </span>{" "}
            a domicilio.
          </h2>
          <span className="hidden text-sm text-[var(--ink-soft)] sm:inline">
            ↻ Pasa el cursor para detener
          </span>
        </div>
      </div>
      <div className="marquee-group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" />
        <div
          className="marquee flex w-max flex-row flex-nowrap gap-6 px-4"
          style={{ ["--marquee-duration" as string]: "50s" }}
        >
          {reel.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="flex h-full w-80 shrink-0 flex-col justify-between rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
      <div>
        <Quote className="size-5 text-primary opacity-60" />
        <p className="mt-3 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
        <div>
          <p className="text-sm font-medium">{t.author}</p>
          <p className="text-xs text-muted-foreground">
            {t.city}
            {t.occasion ? ` · ${t.occasion}` : ""}
          </p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-primary stroke-primary" />
          ))}
        </div>
      </div>
    </article>
  );
}
