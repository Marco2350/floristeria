"use client";

import { useMemo, useState } from "react";
import { Calendar, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { Reveal } from "@/components/reveal";
import { formatYMD, getAvailableDates, formatDateShort } from "@/lib/delivery";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Plan = {
  id: "semanal" | "quincenal" | "mensual";
  label: string;
  description: string;
  discount: string;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "semanal",
    label: "Semanal",
    description: "Un ramo nuevo cada semana.",
    badge: "Más popular",
    discount: "Ahorra 15%",
  },
  {
    id: "quincenal",
    label: "Quincenal",
    description: "Dos veces al mes, las flores duran lo justo.",
    discount: "Ahorra 10%",
  },
  {
    id: "mensual",
    label: "Mensual",
    description: "Un ramo grande, una vez al mes.",
    discount: "Ahorra 5%",
  },
];

const SIZES = [
  { id: "petit", label: "Petit", description: "8–12 tallos. Buró o escritorio.", price: 320 },
  { id: "clasico", label: "Clásico", description: "14–20 tallos. Mesa de comedor.", price: 520 },
  { id: "grande", label: "Grande", description: "22–30 tallos. Recibidor o regalo.", price: 780 },
] as const;

type PlanId = Plan["id"];
type SizeId = (typeof SIZES)[number]["id"];

export function SubscriptionClient() {
  const [plan, setPlan] = useState<PlanId>("semanal");
  const [size, setSize] = useState<SizeId>("clasico");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [palette, setPalette] = useState("");
  const [notes, setNotes] = useState("");
  const dates = useMemo(() => getAvailableDates(14), []);
  const [startDate, setStartDate] = useState(formatYMD(dates[0]));
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const sizeData = SIZES.find((s) => s.id === size)!;

  async function submit() {
    if (name.trim().length < 2 || !email.includes("@") || phone.length < 8) {
      toast.error("Completa contacto: nombre, correo y teléfono.");
      return;
    }
    if (address.length < 5 || city.length < 2) {
      toast.error("Completa dirección de entrega.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, address, city },
          plan,
          size,
          preferences: { palette, notes },
          startDate,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "No se pudo crear la suscripción");
        return;
      }
      setSuccess(true);
    } catch {
      toast.error("Error de red");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div
          className="mx-auto flex size-20 items-center justify-center rounded-full"
          style={{ background: "var(--secondary)" }}
        >
          <Check className="size-10 text-primary" strokeWidth={1.4} />
        </div>
        <h1 className="mt-8 font-display text-4xl tracking-tight">
          ¡Bienvenido al club!
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Te llegará un correo de confirmación. Tu primer ramo sale el{" "}
          <strong>{formatDateShort(new Date(startDate))}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      {/* Hero */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
            Suscripción
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Flores frescas, <span className="italic text-primary">siempre</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Recibe un ramo nuevo cada semana, quincena o mes. Cancelas cuando
            quieras. Sin cobros sorpresa, sin contratos largos.
          </p>
          <ul className="mt-6 grid max-w-md gap-3">
            {[
              "Variedad de temporada en cada entrega",
              "Indícanos paletas y flores que prefieres",
              "Cancela o pausa con un clic",
              "Hasta 15% de descuento vs comprar suelto",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-primary" />
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <LogoPlaceholder
              size={420}
              background="oklch(0.96 0.02 75)"
              className="flex aspect-square w-full max-w-md items-center justify-center rounded-3xl"
            />
          </div>
        </Reveal>
      </div>

      {/* Form */}
      <div className="mt-24 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          {/* Plan */}
          <section>
            <h2 className="font-display text-2xl tracking-tight">1. Frecuencia</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PLANS.map((p) => {
                const isActive = plan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlan(p.id)}
                    className={cn(
                      "relative rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/15"
                        : "border-border/60 hover:border-foreground/20",
                    )}
                  >
                    {p.badge && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary-foreground">
                        {p.badge}
                      </span>
                    )}
                    <p className="font-display text-lg">{p.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                    <p className="mt-3 text-xs text-primary">{p.discount}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Size */}
          <section>
            <h2 className="font-display text-2xl tracking-tight">2. Tamaño</h2>
            <div className="mt-4 grid gap-3">
              {SIZES.map((s) => {
                const isActive = size === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/15"
                        : "border-border/60 hover:border-foreground/20",
                    )}
                  >
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                    <span className="font-display text-xl tabular-nums">{formatPrice(s.price)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl tracking-tight">3. Tus datos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="s-name">Nombre</Label>
                <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="s-email">Correo</Label>
                <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="s-phone">Teléfono</Label>
                <Input id="s-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="s-addr">Dirección de entrega</Label>
                <Input id="s-addr" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="s-city">Ciudad / Alcaldía</Label>
                <Input id="s-city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Primera entrega</Label>
                <select
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {dates.map((d) => (
                    <option key={formatYMD(d)} value={formatYMD(d)}>
                      {formatDateShort(d)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="font-display text-2xl tracking-tight">
              4. Preferencias <span className="text-sm font-sans text-muted-foreground">(opcional)</span>
            </h2>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="s-pal">Paleta de colores</Label>
                <Input
                  id="s-pal"
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  placeholder="Tonos pastel, rojos, sin amarillos…"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="s-notes">Notas</Label>
                <Textarea
                  id="s-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Alérgico a polen fuerte, prefiero ramos bajos, sin lilies…"
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg">Tu suscripción</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Frecuencia" value={PLANS.find((p) => p.id === plan)!.label} />
              <Row label="Tamaño" value={sizeData.label} />
              <Row label="Primera entrega" value={formatDateShort(new Date(startDate))} />
              <Row label="Precio por entrega" value={formatPrice(sizeData.price)} />
            </dl>
            <Button
              onClick={submit}
              disabled={submitting}
              size="lg"
              className="mt-6 w-full rounded-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 size-4" />
                  Activar suscripción
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Sin contrato. Pausas o cancelas cuando quieras.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
