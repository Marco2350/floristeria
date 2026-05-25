import Link from "next/link";
import { Check, Mail, MessageCircle, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pedido confirmado · Lirios",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div
        className="mx-auto flex size-20 items-center justify-center rounded-full"
        style={{ background: "var(--secondary)" }}
      >
        <Check className="size-10 text-primary" strokeWidth={1.4} />
      </div>
      <p className="mt-8 font-display text-sm uppercase tracking-[0.3em] text-primary">
        Pedido confirmado
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
        Gracias por tu pedido.
      </h1>
      <p className="mt-5 text-base text-muted-foreground">
        Recibimos todo. Te llega un correo con los detalles y nos comunicamos
        contigo para coordinar el pago en las próximas horas.
      </p>
      {id && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm">
          <Sparkles className="size-4 text-primary" />
          Tu número de pedido es{" "}
          <code className="font-mono font-semibold">{id}</code>
        </p>
      )}
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 text-left">
          <Mail className="size-5 text-primary" />
          <p className="mt-2 font-medium">1. Confirmación</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Te llega un correo con el resumen.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-left">
          <MessageCircle className="size-5 text-primary" />
          <p className="mt-2 font-medium">2. Te contactamos</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Coordinamos pago y entrega.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-left">
          <Sparkles className="size-5 text-primary" />
          <p className="mt-2 font-medium">3. Tu ramo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lo armamos a mano y lo llevamos.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
        >
          Volver al inicio
        </Link>
        <Link
          href="/catalogo"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "rounded-full",
          )}
        >
          Seguir explorando
        </Link>
      </div>
    </div>
  );
}
