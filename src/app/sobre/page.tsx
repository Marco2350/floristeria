import { BouquetView } from "@/components/flowers/BouquetView";

export const metadata = {
  title: "Nuestra historia · Lirios",
};

export default function SobrePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
        Nuestra historia
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
        Quince años haciéndolo a mano.
      </h1>

      <div className="mt-12 grid gap-12 md:grid-cols-3 md:items-start">
        <div className="md:col-span-2 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            En 2010 empezamos con un puesto de tres metros cuadrados en el
            mercado de Coyoacán. Mi mamá me enseñó a hacer nudos antes que a
            sumar. Hoy seguimos levantándonos a las 4:30 para escoger los
            tallos antes que nadie.
          </p>
          <p>
            Trabajamos con productores locales que conocemos por nombre. No
            usamos preservantes raros, no compramos a quien no sabemos de dónde
            viene, y cada ramo se compone a mano — porque eso se nota.
          </p>
          <p>
            Si tu ramo no llega como debe, lo reponemos. Sin discutir. Las
            flores son un gesto, y un gesto a medias no nos sirve.
          </p>
        </div>
        <div
          className="aspect-[3/4] rounded-2xl"
          style={{ background: "var(--secondary)" }}
        >
          <div className="flex h-full items-center justify-center">
            <BouquetView
              flowers={[
                { flowerId: "peony-blush", qty: 4 },
                { flowerId: "rose-pink", qty: 3 },
                { flowerId: "eucalyptus", qty: 3 },
              ]}
              wrapId="wrap-linen"
              ribbonId="ribbon-cream"
              size={260}
            />
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Frescura",
            body: "Cortadas el mismo día. Si dura menos de 7 días, te lo reponemos.",
          },
          {
            title: "Local",
            body: "Trabajamos con tres invernaderos a menos de 60 km.",
          },
          {
            title: "A mano",
            body: "Cada ramo lo compone una persona, nunca una máquina.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/60 bg-card p-6"
          >
            <h3 className="font-display text-2xl tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
