"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products, categoryMeta } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

const categories = ["todos", "ramos", "arreglos", "plantas", "regalos"] as const;

export function CatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = (searchParams.get("cat") ?? "todos") as
    (typeof categories)[number];

  const filtered = useMemo(() => {
    if (active === "todos") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  function selectCat(cat: (typeof categories)[number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "todos") params.delete("cat");
    else params.set("cat", cat);
    const qs = params.toString();
    router.push(qs ? `/catalogo?${qs}` : "/catalogo", { scroll: false });
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = active === cat;
          const label =
            cat === "todos" ? "Todos" : categoryMeta[cat].label;
          return (
            <button
              key={cat}
              onClick={() => selectCat(cat)}
              className={cn(
                "rounded-full border border-border/60 px-4 py-1.5 text-sm transition-all",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "bg-card hover:bg-muted",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-muted-foreground">
            No hay productos en esta categoría.
          </p>
        </div>
      )}
    </>
  );
}
