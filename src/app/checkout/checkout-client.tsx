"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Gift,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  PackageCheck,
  Truck,
  User,
} from "lucide-react";
import { buildWhatsappCartUrl } from "@/lib/whatsapp";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useCart,
  cartTotal,
  describeCartItem,
  getProductById,
} from "@/lib/cart-store";
import { formatPrice, getWrap } from "@/lib/data";
import {
  DELIVERY_ZONES,
  TIME_SLOTS,
  getAvailableDates,
  formatYMD,
  formatDateShort,
  formatDateLong,
  isToday,
  isTomorrow,
} from "@/lib/delivery";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { id: 0, label: "Contacto", icon: User },
  { id: 1, label: "Entrega", icon: Truck },
  { id: 2, label: "Detalles", icon: Gift },
  { id: 3, label: "Revisión", icon: PackageCheck },
] as const;

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);

  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);

  // Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery
  const [method, setMethod] = useState<"envio" | "pickup">("envio");
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const dates = useMemo(() => getAvailableDates(14), []);
  const [dateYMD, setDateYMD] = useState(formatYMD(dates[0]));
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0].range);

  // Recipient + gift details
  const [surprise, setSurprise] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [cardMessage, setCardMessage] = useState("");

  // Discount
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; amount: number; description: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = cartTotal(items);
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const shipping = method === "envio" ? zone?.price ?? 0 : 0;
  const discountAmount = coupon?.amount ?? 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  useEffect(() => {
    if (items.length === 0 && !submitting) {
      router.replace("/catalogo");
    }
  }, [items.length, submitting, router]);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "Código no válido");
        setCoupon(null);
      } else {
        setCoupon({
          code: data.code,
          amount: data.amount,
          description: data.description,
        });
        toast.success(data.description);
      }
    } catch {
      toast.error("No pudimos validar el código");
    } finally {
      setCouponLoading(false);
    }
  }

  function validateStep(s: Step): string | null {
    if (s === 0) {
      if (name.trim().length < 2) return "Tu nombre, por favor";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return "Correo no válido";
      if (phone.replace(/\D/g, "").length < 8)
        return "Teléfono no válido";
    }
    if (s === 1) {
      if (method === "envio") {
        if (address.trim().length < 5) return "Dirección requerida";
        if (city.trim().length < 2) return "Ciudad requerida";
      }
      if (!dateYMD) return "Elige una fecha";
      if (!timeSlot) return "Elige un horario";
    }
    if (s === 2) {
      // Optional fields
      if (!surprise && method === "envio" && recipientName.trim().length === 0) {
        return "Nombre del destinatario (o elige envío sorpresa)";
      }
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => (Math.min(3, s + 1) as Step));
  }
  function back() {
    setStep((s) => (Math.max(0, s - 1) as Step));
  }

  async function submit() {
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => {
        if (item.type === "product") {
          const p = getProductById(item.productId);
          return {
            type: "product" as const,
            productId: item.productId,
            qty: item.qty,
            unitPrice: p?.price ?? 0,
            title: p?.name ?? "Producto",
          };
        }
        return {
          type: "custom" as const,
          qty: item.qty,
          unitPrice: item.computedPrice,
          flowers: item.config.flowers,
          wrapId: item.config.wrapId,
          ribbonId: item.config.ribbonId,
          cardMessage: item.config.cardMessage,
        };
      });

      const payload = {
        customer: { name, email, phone },
        delivery: {
          method,
          date: dateYMD,
          timeSlot,
          address: method === "envio" ? address : undefined,
          city: method === "envio" ? city : undefined,
          zone: method === "envio" ? zone?.label : undefined,
          zonePrice: shipping,
          recipientName: recipientName || undefined,
          recipientPhone: recipientPhone || undefined,
          cardMessage: cardMessage || undefined,
          surprise,
        },
        items: orderItems,
        subtotal,
        shipping,
        discount: coupon ? { code: coupon.code, amount: coupon.amount } : null,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "No se pudo crear el pedido");
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/checkout/exito?id=${encodeURIComponent(data.id)}`);
    } catch (e) {
      toast.error("Error de red");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl">Tu canasta está vacía.</h1>
        <Link
          href="/catalogo"
          className={cn(buttonVariants({}), "mt-6 rounded-full")}
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Casi listo
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Finalizar pedido
        </h1>
      </div>

      {/* Steps indicator */}
      <ol className="mb-10 grid grid-cols-4 gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => i <= step && setStep(s.id as Step)}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : isDone
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
              </button>
              <div className="hidden text-sm sm:block">
                <p
                  className={cn(
                    "font-medium leading-none",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Paso {i + 1}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Form column */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
            >
              {step === 0 && (
                <ContactStep
                  name={name}
                  email={email}
                  phone={phone}
                  setName={setName}
                  setEmail={setEmail}
                  setPhone={setPhone}
                />
              )}
              {step === 1 && (
                <DeliveryStep
                  method={method}
                  setMethod={setMethod}
                  zoneId={zoneId}
                  setZoneId={setZoneId}
                  address={address}
                  setAddress={setAddress}
                  city={city}
                  setCity={setCity}
                  dates={dates}
                  dateYMD={dateYMD}
                  setDateYMD={setDateYMD}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                />
              )}
              {step === 2 && (
                <DetailsStep
                  surprise={surprise}
                  setSurprise={setSurprise}
                  recipientName={recipientName}
                  setRecipientName={setRecipientName}
                  recipientPhone={recipientPhone}
                  setRecipientPhone={setRecipientPhone}
                  cardMessage={cardMessage}
                  setCardMessage={setCardMessage}
                  method={method}
                />
              )}
              {step === 3 && (
                <ReviewStep
                  name={name}
                  email={email}
                  phone={phone}
                  method={method}
                  zone={zone?.label}
                  address={address}
                  city={city}
                  dateYMD={dateYMD}
                  timeSlot={timeSlot}
                  surprise={surprise}
                  recipientName={recipientName}
                  recipientPhone={recipientPhone}
                  cardMessage={cardMessage}
                />
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={back}
                  disabled={step === 0}
                  className="rounded-full"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Atrás
                </Button>
                <div className="flex flex-wrap items-center gap-3">
                  {step === 3 && (
                    <a
                      href={buildWhatsappCartUrl(items, total, {
                        recipientName: recipientName || name,
                        recipientPhone: recipientPhone || phone,
                        address: method === "envio" ? address : "Recojo en tienda",
                        city,
                        zoneLabel: method === "envio" ? zone?.label : undefined,
                        date: formatDateLong(new Date(dateYMD)),
                        slot: timeSlot,
                        note: cardMessage,
                        surprise,
                        shipping,
                        discount: coupon
                          ? { code: coupon.code, amount: coupon.amount }
                          : undefined,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-full px-5",
                      )}
                    >
                      <MessageCircle className="mr-1.5 size-4" />
                      Enviar por WhatsApp
                    </a>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={next}
                      className="rounded-full px-6"
                    >
                      Continuar
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="rounded-full px-6"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Procesando…
                        </>
                      ) : (
                        <>
                          Confirmar pedido
                          <Check className="ml-1 size-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {step === 3 && (
                <p className="mt-3 text-right text-[11px] text-muted-foreground">
                  ¿Prefieres efectivo o transferencia? Mándalo por WhatsApp.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="size-3" />
            Conexión segura. Tus datos se guardan cifrados.
          </p>
        </div>

        {/* Summary column */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg">Tu pedido</h2>
            <ul className="mt-4 divide-y divide-border/40">
              {items.map((item) => {
                const desc = describeCartItem(item);
                const lineTotal =
                  item.type === "product"
                    ? (getProductById(item.productId)?.price ?? 0) * item.qty
                    : item.computedPrice * item.qty;
                return (
                  <li key={item.key} className="flex items-start gap-3 py-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{desc.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {desc.subtitle} · {item.qty} {item.qty > 1 ? "uds" : "ud"}
                      </p>
                      {item.type === "custom" && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {getWrap(item.config.wrapId)?.name}
                        </p>
                      )}
                    </div>
                    <span className="tabular-nums">{formatPrice(lineTotal)}</span>
                  </li>
                );
              })}
            </ul>

            {/* Coupon */}
            <div className="mt-5">
              <Label htmlFor="coupon" className="text-xs uppercase tracking-widest text-muted-foreground">
                Código de descuento
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="BIENVENIDA10"
                  className="h-9 uppercase"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="shrink-0 rounded-md"
                >
                  Aplicar
                </Button>
              </div>
              {coupon && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  <Check className="size-3" /> {coupon.code} — {coupon.description}
                </p>
              )}
            </div>

            <dl className="mt-6 space-y-2 border-t border-border/40 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Envío {method === "pickup" && "(recoger)"}
                </dt>
                <dd className="tabular-nums">
                  {method === "pickup" ? "Gratis" : formatPrice(shipping)}
                </dd>
              </div>
              {coupon && (
                <div className="flex justify-between text-primary">
                  <dt>Descuento</dt>
                  <dd className="tabular-nums">−{formatPrice(coupon.amount)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-border/40 pt-3">
                <dt className="font-display text-base">Total</dt>
                <dd className="font-display text-2xl tracking-tight tabular-nums">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Steps ──────────────────────────────────────────────── */

function ContactStep({
  name, email, phone, setName, setEmail, setPhone,
}: {
  name: string; email: string; phone: string;
  setName: (v: string) => void; setEmail: (v: string) => void; setPhone: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl tracking-tight">¿Cómo te llamas?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Es información del que compra — más adelante decides quién lo recibe.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="c-name">Nombre completo</Label>
          <Input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María García"
            className="mt-1.5"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="c-email">Correo</Label>
          <Input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@correo.com"
            className="mt-1.5"
            autoComplete="email"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Te llega confirmación y actualizaciones.
          </p>
        </div>
        <div>
          <Label htmlFor="c-phone">Teléfono</Label>
          <Input
            id="c-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="55 1234 5678"
            className="mt-1.5"
            autoComplete="tel"
          />
        </div>
      </div>
    </div>
  );
}

function DeliveryStep({
  method, setMethod, zoneId, setZoneId, address, setAddress, city, setCity,
  dates, dateYMD, setDateYMD, timeSlot, setTimeSlot,
}: {
  method: "envio" | "pickup"; setMethod: (m: "envio" | "pickup") => void;
  zoneId: string; setZoneId: (s: string) => void;
  address: string; setAddress: (s: string) => void;
  city: string; setCity: (s: string) => void;
  dates: Date[]; dateYMD: string; setDateYMD: (s: string) => void;
  timeSlot: string; setTimeSlot: (s: string) => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl tracking-tight">¿Cómo lo entregamos?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Envío a domicilio o recoger en nuestro local.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { id: "envio" as const, title: "Envío a domicilio", desc: "Te lo llevamos hasta la puerta", icon: Truck },
          { id: "pickup" as const, title: "Recoger en tienda", desc: "Plaza Rosamanda, El Progreso · sin costo", icon: MapPin },
        ].map((opt) => {
          const Icon = opt.icon;
          const isActive = method === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMethod(opt.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                isActive
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/15"
                  : "border-border/60 hover:border-foreground/20",
              )}
            >
              <Icon className={cn("mt-0.5 size-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className="font-medium">{opt.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {method === "envio" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-5 overflow-hidden"
        >
          <div>
            <Label>Zona de entrega</Label>
            <div className="mt-2 grid gap-2">
              {DELIVERY_ZONES.map((z) => {
                const isActive = zoneId === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setZoneId(z.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/15"
                        : "border-border/60 hover:border-foreground/20",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{z.label}</p>
                      <p className="text-xs text-muted-foreground">{z.description} · {z.estimate}</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {z.price === 0 ? "Gratis" : formatPrice(z.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="addr">Dirección</Label>
              <Input
                id="addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, colonia, referencias"
                className="mt-1.5"
                autoComplete="street-address"
              />
            </div>
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="El Progreso"
                className="mt-1.5"
                autoComplete="address-level2"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <Label>Fecha de entrega</Label>
        <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dates.map((d) => {
            const ymd = formatYMD(d);
            const isActive = dateYMD === ymd;
            const labelTop = isToday(d) ? "Hoy" : isTomorrow(d) ? "Mañana" : formatDateShort(d).split(" ")[0];
            return (
              <button
                key={ymd}
                type="button"
                onClick={() => setDateYMD(ymd)}
                className={cn(
                  "flex w-20 shrink-0 flex-col items-center rounded-xl border p-3 transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 hover:border-foreground/20",
                )}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-75">
                  {labelTop}
                </span>
                <span className="mt-1 font-display text-2xl tracking-tight">
                  {d.getDate()}
                </span>
                <span className="text-[10px] uppercase tracking-widest opacity-75">
                  {formatDateShort(d).split(" ")[2]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Horario</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isActive = timeSlot === slot.range;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setTimeSlot(slot.range)}
                className={cn(
                  "rounded-xl border p-3 text-center transition",
                  isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary/15"
                    : "border-border/60 hover:border-foreground/20",
                )}
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {slot.label}
                </p>
                <p className="mt-1 text-sm font-medium">{slot.range}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailsStep({
  surprise, setSurprise, recipientName, setRecipientName, recipientPhone,
  setRecipientPhone, cardMessage, setCardMessage, method,
}: {
  surprise: boolean; setSurprise: (b: boolean) => void;
  recipientName: string; setRecipientName: (s: string) => void;
  recipientPhone: string; setRecipientPhone: (s: string) => void;
  cardMessage: string; setCardMessage: (s: string) => void;
  method: "envio" | "pickup";
}) {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl tracking-tight">¿Es un regalo?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Si lo es, cuéntanos a quién y qué quieres decirle.
        </p>
      </header>

      {method === "envio" && (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition hover:border-foreground/20">
          <input
            type="checkbox"
            checked={surprise}
            onChange={(e) => setSurprise(e.target.checked)}
            className="mt-0.5 size-4"
          />
          <div>
            <p className="font-medium">Envío sorpresa</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              No le decimos al destinatario quién lo envía hasta que abra la
              tarjeta.
            </p>
          </div>
        </label>
      )}

      {method === "envio" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="r-name">Nombre del destinatario</Label>
            <Input
              id="r-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Lucía Martínez"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="r-phone">Teléfono del destinatario</Label>
            <Input
              id="r-phone"
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="55 9876 5432"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Por si necesitamos coordinar la entrega.
            </p>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="card">Dedicatoria (opcional)</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          La escribimos a mano en cartulina de algodón. Máximo 240 caracteres.
        </p>
        <Textarea
          id="card"
          value={cardMessage}
          onChange={(e) => setCardMessage(e.target.value.slice(0, 240))}
          rows={5}
          placeholder="Para ti, porque sí. — Con cariño, ___"
          className="mt-2 resize-none"
        />
        <div className="mt-1 flex justify-end text-xs text-muted-foreground tabular-nums">
          {cardMessage.length}/240
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  name, email, phone, method, zone, address, city, dateYMD, timeSlot, surprise,
  recipientName, recipientPhone, cardMessage,
}: {
  name: string; email: string; phone: string;
  method: "envio" | "pickup"; zone?: string; address?: string; city?: string;
  dateYMD: string; timeSlot: string; surprise: boolean;
  recipientName: string; recipientPhone: string; cardMessage: string;
}) {
  const date = new Date(dateYMD + "T00:00");
  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl tracking-tight">Revisa todo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Si todo está bien, confirmamos y te llega correo en minutos.
        </p>
      </header>
      <dl className="divide-y divide-border/40 rounded-xl border border-border/60 bg-muted/20">
        <Row label="Contacto" value={`${name} · ${email} · ${phone}`} />
        <Row
          label="Entrega"
          value={method === "envio" ? `Envío · ${zone}` : "Recoger en tienda"}
        />
        {method === "envio" && (
          <Row label="Dirección" value={`${address}, ${city}`} />
        )}
        <Row label="Fecha" value={formatDateLong(date)} />
        <Row label="Horario" value={timeSlot} />
        {recipientName && (
          <Row
            label="Destinatario"
            value={`${recipientName}${recipientPhone ? ` · ${recipientPhone}` : ""}${surprise ? " · sorpresa" : ""}`}
          />
        )}
        {cardMessage && (
          <Row label="Dedicatoria" value={`"${cardMessage}"`} />
        )}
      </dl>

      <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <Badge variant="secondary" className="rounded-full">
          Por venir
        </Badge>
        <p className="text-muted-foreground">
          El cobro con tarjeta se habilitará al integrar Stripe. Por ahora se
          registra la orden y nos comunicamos por correo para coordinar el
          pago.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 px-4 py-3 sm:grid-cols-[140px_1fr]">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
