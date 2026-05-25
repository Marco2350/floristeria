import { products, formatPrice } from "@/lib/data";
import { listOverrides } from "@/lib/server/storage";
import { ProductRow } from "./product-row";

export default async function AdminProductsPage() {
  const overrides = await listOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  return (
    <div className="space-y-6">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Productos
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Marca productos como agotados u ocultos sin tener que editarlos del
          catálogo base. Los cambios se aplican al instante en el sitio.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-right">Precio</th>
              <th className="px-4 py-3 text-center">Agotado</th>
              <th className="px-4 py-3 text-center">Oculto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                initial={overrideMap.get(p.id) ?? { id: p.id }}
                priceLabel={formatPrice(p.price)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
