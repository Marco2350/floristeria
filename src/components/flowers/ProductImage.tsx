"use client";

import type { Product } from "@/lib/types";
import { BouquetView } from "./BouquetView";
import { Leaf, Sparkles, Cookie, Flame, Heart } from "lucide-react";

type Props = {
  product: Product;
  className?: string;
  size?: number;
};

export function ProductImage({ product, className, size = 280 }: Props) {
  const { palette, category, composition, name } = product;

  if ((category === "ramos" || category === "arreglos") && composition?.length) {
    return (
      <div
        className={className}
        style={{ background: palette.background }}
      >
        <div className="flex h-full w-full items-center justify-center p-4">
          <BouquetView
            flowers={composition.map((c) => ({
              flowerId: c.flowerId,
              qty: c.count,
            }))}
            wrapId={category === "arreglos" ? undefined : "wrap-korean"}
            ribbonId={category === "arreglos" ? undefined : "ribbon-cream"}
            showWrap={category === "ramos"}
            size={size}
            className="drop-shadow-sm"
          />
        </div>
      </div>
    );
  }

  // Non-floral visuals — stylized for plants/gifts
  const icon = (() => {
    if (category === "plantas") return <Leaf strokeWidth={1.2} className="size-24" />;
    if (name.toLowerCase().includes("vela")) return <Flame strokeWidth={1.2} className="size-24" />;
    if (name.toLowerCase().includes("trufa")) return <Cookie strokeWidth={1.2} className="size-24" />;
    if (name.toLowerCase().includes("osito")) return <Heart strokeWidth={1.2} className="size-24" />;
    return <Sparkles strokeWidth={1.2} className="size-24" />;
  })();

  return (
    <div
      className={className}
      style={{ background: palette.background, color: palette.accent }}
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 opacity-80">
          {icon}
          <span
            className="font-display text-xl tracking-tight"
            style={{ color: palette.accent }}
          >
            {name.split(" ")[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
