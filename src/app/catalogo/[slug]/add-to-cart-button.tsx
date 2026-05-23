"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { getProductById } from "@/lib/cart-store";

export function AddToCartButton({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1);
  const addProduct = useCart((s) => s.addProduct);
  const product = getProductById(productId);

  function handleAdd() {
    addProduct(productId, qty);
    toast.success(`${product?.name ?? "Producto"} agregado`, {
      description: `${qty} ${qty === 1 ? "unidad" : "unidades"} en tu canasta.`,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-border">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-muted-foreground hover:text-foreground"
          aria-label="Restar"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2 text-muted-foreground hover:text-foreground"
          aria-label="Sumar"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button size="lg" className="rounded-full" onClick={handleAdd}>
        <ShoppingBag className="mr-1.5 size-4" />
        Agregar a la canasta
      </Button>
    </div>
  );
}
