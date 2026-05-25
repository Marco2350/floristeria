"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  productId: string;
  productName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function WishlistButton({ productId, productName, className, size = "md" }: Props) {
  const toggle = useWishlist((s) => s.toggle);
  const ids = useWishlist((s) => s.productIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = mounted && ids.includes(productId);
  const sz = size === "sm" ? "size-7" : size === "lg" ? "size-11" : "size-9";
  const icon =
    size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
        if (!isActive) toast.success(`${productName} guardado en favoritos`);
      }}
      aria-label={isActive ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        sz,
        "inline-flex items-center justify-center rounded-full border border-border/60 bg-background/85 backdrop-blur transition-all duration-300",
        "hover:border-primary/40 hover:scale-105 active:scale-95",
        isActive && "border-primary/50 bg-primary/10",
        className,
      )}
    >
      <Heart
        className={cn(
          icon,
          "transition-colors duration-300",
          isActive ? "fill-primary stroke-primary" : "stroke-foreground/70",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}
