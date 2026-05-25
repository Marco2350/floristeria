import { products } from "./data";
import type { Product } from "./types";

export type Occasion = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  hero: { gradient: string; accent: string };
  productIds: string[];
  flowersHint: string[];
  emoji?: string;
};

export const occasions: Occasion[] = [
  {
    slug: "san-valentin",
    name: "San Valentín",
    tagline: "Para decirlo sin decirlo.",
    description:
      "Rojos, rosas y todo lo que se ve cuando alguien te importa de verdad. Lo armamos el 14 con flores cortadas esa misma mañana.",
    cta: "Pedir para el 14 de febrero",
    hero: { gradient: "from-rose-200 via-rose-100 to-amber-100", accent: "#B91C3A" },
    productIds: ["p-clasico", "p-rubor", "p-amanecer"],
    flowersHint: ["rose-red", "rose-pink", "peony-blush"],
  },
  {
    slug: "dia-de-la-madre",
    name: "Día de la Madre",
    tagline: "Como ella, no hay dos.",
    description:
      "Peonías, hortensias y las flores que más nos piden ese día. Reserva con anticipación porque la lista se llena.",
    cta: "Reservar para el 10 de mayo",
    hero: { gradient: "from-pink-100 via-orange-100 to-amber-100", accent: "#E89BB0" },
    productIds: ["p-rubor", "p-jardin-secreto", "p-mesa-domingo"],
    flowersHint: ["peony-blush", "hydrangea-blue", "tulip-pink"],
  },
  {
    slug: "cumpleanos",
    name: "Cumpleaños",
    tagline: "Festejar con flores no falla.",
    description:
      "Colores brillantes que se ven desde lejos. Acompáñalos con una caja de trufas o una vela para subir el detalle.",
    cta: "Ver ramos de cumpleaños",
    hero: { gradient: "from-amber-100 via-yellow-50 to-rose-100", accent: "#F5C24A" },
    productIds: ["p-amanecer", "p-margarita", "p-caja-trufas", "p-vela-soja"],
    flowersHint: ["sunflower", "tulip-yellow", "daisy"],
  },
  {
    slug: "aniversario",
    name: "Aniversario",
    tagline: "Los años se cuentan en flores.",
    description:
      "Elegancia clásica: rosas largas, peonías y un papel coreano blanco. Si quieres algo único, personaliza el ramo.",
    cta: "Ver opciones",
    hero: { gradient: "from-rose-100 via-amber-50 to-stone-100", accent: "#732536" },
    productIds: ["p-clasico", "p-rubor", "p-jardin-secreto"],
    flowersHint: ["rose-red", "rose-white", "peony-blush"],
  },
  {
    slug: "funeral",
    name: "Condolencias",
    tagline: "Las palabras se quedan cortas. Las flores no.",
    description:
      "Arreglos sobrios — blancos, verdes, sutiles. Para acompañar en silencio. Llamamos antes para confirmar dirección y hora.",
    cta: "Pedir arreglo de condolencias",
    hero: { gradient: "from-stone-100 via-stone-50 to-emerald-50", accent: "#3F5740" },
    productIds: ["p-jardin-secreto", "p-orquidea"],
    flowersHint: ["lily-white", "rose-white", "babys-breath"],
  },
  {
    slug: "felicitaciones",
    name: "Felicitaciones",
    tagline: "Para los grandes 'te quiero felicitar'.",
    description:
      "Graduaciones, ascensos, primer departamento, recién nacidos. Cualquier excusa es buena.",
    cta: "Ver opciones",
    hero: { gradient: "from-emerald-100 via-amber-50 to-stone-100", accent: "#3F5740" },
    productIds: ["p-amanecer", "p-mesa-domingo", "p-pothos", "p-monstera"],
    flowersHint: ["sunflower", "tulip-yellow", "daisy"],
  },
];

export function getOccasion(slug: string): Occasion | undefined {
  return occasions.find((o) => o.slug === slug);
}

export function getOccasionProducts(o: Occasion): Product[] {
  return o.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}
