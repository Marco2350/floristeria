import { Suspense } from "react";
import { CatalogClient } from "./catalog-client";

export const metadata = {
  title: "Catálogo · Lirios",
  description: "Ramos, arreglos, plantas y regalos cuidadosamente elegidos.",
};

export default function CatalogoPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col items-start gap-4">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
          Catálogo
        </p>
        <h1 className="max-w-2xl font-display text-5xl tracking-tight sm:text-6xl">
          Cada pieza, pensada a detalle.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Selección curada por nuestro equipo. Todos los productos se preparan
          el mismo día del envío.
        </p>
      </div>

      <Suspense fallback={<div className="mt-12 h-96" />}>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
