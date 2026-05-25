import { listDiscounts } from "@/lib/server/storage";
import { DiscountsEditor } from "./discounts-editor";

export default async function AdminDiscountsPage() {
  const discounts = await listDiscounts();
  return (
    <div className="space-y-6">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Promociones
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Cupones de descuento
        </h1>
      </header>
      <DiscountsEditor initial={discounts} />
    </div>
  );
}
