import type { Product } from "@/lib/types";
import { LogoPlaceholder } from "./logo-placeholder";

type Props = {
  product: Product;
  className?: string;
  size?: number;
};

export function ProductImage({ product, className, size = 280 }: Props) {
  return (
    <LogoPlaceholder
      size={size}
      background={product.palette.background}
      className={className}
    />
  );
}
