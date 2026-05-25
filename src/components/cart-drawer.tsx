"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useCart,
  cartTotal,
  describeCartItem,
  getProductById,
} from "@/lib/cart-store";
import { formatPrice } from "@/lib/data";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { ProductImage } from "@/components/flowers/ProductImage";
import { buildWhatsappCartUrl } from "@/lib/whatsapp";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const total = cartTotal(items);

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-6 py-5">
          <SheetTitle className="font-display text-2xl tracking-tight">
            Tu canasta
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Aún no has agregado nada."
              : `${items.length} ${items.length === 1 ? "artículo" : "artículos"} listos para envolver.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                className="flex size-24 items-center justify-center rounded-full"
                style={{ background: "var(--secondary)" }}
              >
                <span className="font-display text-3xl text-secondary-foreground">
                  ✿
                </span>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Empieza explorando el catálogo o crea tu propio ramo flor por
                flor.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/catalogo"
                  onClick={close}
                  className={buttonVariants({ size: "sm" })}
                >
                  Ver catálogo
                </Link>
                <Link
                  href="/personalizar"
                  onClick={close}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Personalizar
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((item) => {
                const desc = describeCartItem(item);
                const lineTotal =
                  item.type === "product"
                    ? (getProductById(item.productId)?.price ?? 0) * item.qty
                    : item.computedPrice * item.qty;
                return (
                  <li key={item.key} className="flex gap-4 px-6 py-5">
                    <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.type === "product" ? (
                        <RenderProductThumb productId={item.productId} />
                      ) : (
                        <LogoPlaceholder
                          size={80}
                          background="var(--muted)"
                          className="h-full w-full"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium leading-tight">
                            {desc.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {desc.subtitle}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.key)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            aria-label="Restar"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="px-2 text-sm tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            aria-label="Sumar"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-muted/30 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl tracking-tight">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Envío y método de pago se calculan en el siguiente paso.
            </p>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={close}
                className={buttonVariants({ size: "lg" })}
              >
                Finalizar pedido →
              </Link>
              <a
                href={buildWhatsappCartUrl(items, total)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
              >
                <MessageCircle className="mr-1.5 size-4" />
                Pedir por WhatsApp
              </a>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              WhatsApp: pagas en efectivo o transferencia.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function RenderProductThumb({ productId }: { productId: string }) {
  const p = getProductById(productId);
  if (!p) return null;
  return <ProductImage product={p} size={80} className="h-full w-full" />;
}
