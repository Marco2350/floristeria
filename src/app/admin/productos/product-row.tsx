"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import type { ProductOverride } from "@/lib/server/storage";
import { Switch } from "./switch";
import { toast } from "sonner";

export function ProductRow({
  product,
  initial,
  priceLabel,
}: {
  product: Product;
  initial: ProductOverride;
  priceLabel: string;
}) {
  const [outOfStock, setOutOfStock] = useState(!!initial.outOfStock);
  const [hidden, setHidden] = useState(!!initial.hidden);

  async function save(patch: Partial<ProductOverride>) {
    try {
      await fetch("/api/admin/overrides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: product.id, outOfStock, hidden, ...patch }),
      });
    } catch {
      toast.error("Error al guardar");
    }
  }

  return (
    <tr className="transition hover:bg-muted/30">
      <td className="px-4 py-3 align-middle">
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.shortDescription}</p>
      </td>
      <td className="px-4 py-3 align-middle text-xs uppercase tracking-widest text-muted-foreground">
        {product.category}
      </td>
      <td className="px-4 py-3 text-right align-middle tabular-nums">{priceLabel}</td>
      <td className="px-4 py-3 text-center align-middle">
        <Switch
          checked={outOfStock}
          onChange={(v) => {
            setOutOfStock(v);
            save({ outOfStock: v });
            toast.success(v ? "Marcado agotado" : "Disponible");
          }}
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <Switch
          checked={hidden}
          onChange={(v) => {
            setHidden(v);
            save({ hidden: v });
          }}
        />
      </td>
    </tr>
  );
}
