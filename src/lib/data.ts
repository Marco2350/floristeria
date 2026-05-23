import type { Flower, Product, Ribbon, Wrap } from "./types";

export const flowers: Flower[] = [
  {
    id: "rose-red",
    name: "Rosa roja",
    kind: "rose",
    color: "#B91C3A",
    accentColor: "#7A0E22",
    pricePerStem: 35,
    description: "El clásico atemporal del amor y la pasión.",
    season: "todo el año",
    available: true,
  },
  {
    id: "rose-white",
    name: "Rosa blanca",
    kind: "rose",
    color: "#FBF6EF",
    accentColor: "#E7DDCB",
    pricePerStem: 35,
    description: "Pureza y elegancia en cada pétalo.",
    season: "todo el año",
    available: true,
  },
  {
    id: "rose-pink",
    name: "Rosa rosa",
    kind: "rose",
    color: "#E89BB0",
    accentColor: "#C26B85",
    pricePerStem: 35,
    description: "Dulzura discreta, ideal para gestos suaves.",
    season: "todo el año",
    available: true,
  },
  {
    id: "tulip-yellow",
    name: "Tulipán amarillo",
    kind: "tulip",
    color: "#F5C24A",
    accentColor: "#C99A2A",
    pricePerStem: 28,
    description: "Optimismo y alegría en forma de copa.",
    season: "primavera",
    available: true,
  },
  {
    id: "tulip-pink",
    name: "Tulipán rosa",
    kind: "tulip",
    color: "#EE9FB5",
    accentColor: "#C26B85",
    pricePerStem: 28,
    description: "Suavidad primaveral con tallo erguido.",
    season: "primavera",
    available: true,
  },
  {
    id: "daisy",
    name: "Margarita",
    kind: "daisy",
    color: "#FFFFFF",
    accentColor: "#F4B233",
    pricePerStem: 18,
    description: "Sencilla, fresca y siempre encantadora.",
    season: "verano",
    available: true,
  },
  {
    id: "sunflower",
    name: "Girasol",
    kind: "sunflower",
    color: "#E8A52F",
    accentColor: "#5C3A12",
    pricePerStem: 32,
    description: "Sol embotellado. Llena cualquier espacio.",
    season: "verano",
    available: true,
  },
  {
    id: "lily-white",
    name: "Lirio blanco",
    kind: "lily",
    color: "#FAF3E7",
    accentColor: "#C99A2A",
    pricePerStem: 40,
    description: "Aroma intenso, presencia escultural.",
    season: "todo el año",
    available: true,
  },
  {
    id: "peony-blush",
    name: "Peonía rubor",
    kind: "peony",
    color: "#F2C8CD",
    accentColor: "#C26B85",
    pricePerStem: 65,
    description: "Reina de la temporada. Pétalos abundantes.",
    season: "primavera",
    available: true,
  },
  {
    id: "hydrangea-blue",
    name: "Hortensia azul",
    kind: "hydrangea",
    color: "#9DB4D6",
    accentColor: "#5C7BA8",
    pricePerStem: 45,
    description: "Volumen sereno con tono acuarela.",
    season: "verano",
    available: true,
  },
  {
    id: "lavender",
    name: "Lavanda",
    kind: "lavender",
    color: "#A893C9",
    accentColor: "#7159A1",
    pricePerStem: 22,
    description: "Aroma relajante, color provenzal.",
    season: "verano",
    available: true,
  },
  {
    id: "eucalyptus",
    name: "Eucalipto",
    kind: "eucalyptus",
    color: "#9CAE93",
    accentColor: "#5E7257",
    pricePerStem: 15,
    description: "Verde plateado para dar estructura al ramo.",
    season: "todo el año",
    available: true,
  },
  {
    id: "babys-breath",
    name: "Velo de novia",
    kind: "babys-breath",
    color: "#FFFFFF",
    accentColor: "#E7DDCB",
    pricePerStem: 14,
    description: "Nubes diminutas que alivianan cualquier ramo.",
    season: "todo el año",
    available: true,
  },
];

export const wraps: Wrap[] = [
  {
    id: "wrap-kraft",
    name: "Papel kraft natural",
    description: "Estética rústica y artesanal.",
    color: "#C9A77C",
    texture: "kraft",
    price: 30,
  },
  {
    id: "wrap-korean",
    name: "Papel coreano blanco",
    description: "Translúcido, suave, contemporáneo.",
    color: "#F6EFE3",
    texture: "korean",
    price: 45,
  },
  {
    id: "wrap-linen",
    name: "Lino crudo",
    description: "Textil reutilizable, acabado boutique.",
    color: "#D8C9B0",
    texture: "linen",
    price: 70,
  },
  {
    id: "wrap-box",
    name: "Caja sombrerera",
    description: "Presentación premium, ideal para regalar.",
    color: "#3A4A39",
    texture: "boxed",
    price: 120,
  },
];

export const ribbons: Ribbon[] = [
  { id: "ribbon-cream", name: "Crema", color: "#E7DDCB" },
  { id: "ribbon-rose", name: "Rosa polvo", color: "#E5A8B5" },
  { id: "ribbon-sage", name: "Verde sage", color: "#9CAE93" },
  { id: "ribbon-terra", name: "Terracota", color: "#C97B5C" },
  { id: "ribbon-burgundy", name: "Borgoña", color: "#732536" },
  { id: "ribbon-black", name: "Negro mate", color: "#1F1F1F" },
];

export const products: Product[] = [
  {
    id: "p-amanecer",
    slug: "ramo-amanecer",
    name: "Amanecer",
    category: "ramos",
    price: 680,
    shortDescription: "Girasoles y tulipanes amarillos con eucalipto.",
    description:
      "Un ramo solar que se siente como abrir las ventanas en domingo. Girasoles de tallo largo, tulipanes amarillos y un toque de eucalipto para dar estructura.",
    composition: [
      { flowerId: "sunflower", count: 5 },
      { flowerId: "tulip-yellow", count: 6 },
      { flowerId: "eucalyptus", count: 4 },
    ],
    badges: ["Más vendido"],
    palette: { background: "#FBF1DC", accent: "#E8A52F" },
    featured: true,
  },
  {
    id: "p-rubor",
    slug: "ramo-rubor",
    name: "Rubor",
    category: "ramos",
    price: 920,
    shortDescription: "Peonías rubor, rosas rosadas y velo de novia.",
    description:
      "Pétalos abundantes en tonos polvo. Peonías de temporada acompañadas de rosas rosa pálido y una nube de velo de novia.",
    composition: [
      { flowerId: "peony-blush", count: 4 },
      { flowerId: "rose-pink", count: 6 },
      { flowerId: "babys-breath", count: 5 },
    ],
    badges: ["Temporada"],
    palette: { background: "#FBE9EC", accent: "#E89BB0" },
    featured: true,
  },
  {
    id: "p-clasico",
    slug: "ramo-clasico-rojo",
    name: "Clásico Rojo",
    category: "ramos",
    price: 780,
    shortDescription: "Doce rosas rojas con velo de novia.",
    description:
      "El gesto que nunca falla. Doce rosas rojas de tallo largo, envueltas en papel coreano blanco.",
    composition: [
      { flowerId: "rose-red", count: 12 },
      { flowerId: "babys-breath", count: 4 },
    ],
    palette: { background: "#F3D9DE", accent: "#B91C3A" },
    featured: true,
  },
  {
    id: "p-provence",
    slug: "ramo-provence",
    name: "Provence",
    category: "ramos",
    price: 560,
    shortDescription: "Lavanda, hortensia azul y eucalipto.",
    description:
      "Inspirado en los campos del sur. Lavanda fresca, hortensia azul y eucalipto para un ramo aromático y silvestre.",
    composition: [
      { flowerId: "lavender", count: 8 },
      { flowerId: "hydrangea-blue", count: 3 },
      { flowerId: "eucalyptus", count: 4 },
    ],
    palette: { background: "#E6E0EE", accent: "#A893C9" },
  },
  {
    id: "p-margarita",
    slug: "ramo-campestre",
    name: "Campestre",
    category: "ramos",
    price: 420,
    shortDescription: "Margaritas, tulipanes rosas y eucalipto.",
    description:
      "Un ramo desenfadado, perfecto para sin razón. Margaritas, tulipanes rosados y verdes plateados.",
    composition: [
      { flowerId: "daisy", count: 9 },
      { flowerId: "tulip-pink", count: 5 },
      { flowerId: "eucalyptus", count: 3 },
    ],
    palette: { background: "#EDF1E7", accent: "#9CAE93" },
  },
  {
    id: "p-jardin-secreto",
    slug: "arreglo-jardin-secreto",
    name: "Jardín Secreto",
    category: "arreglos",
    price: 1450,
    shortDescription: "Arreglo bajo en jarrón de cerámica.",
    description:
      "Composición jardinera baja, pensada para mesa de comedor. Peonías, lirios, hortensia y verdes en jarrón de cerámica artesanal.",
    composition: [
      { flowerId: "peony-blush", count: 3 },
      { flowerId: "lily-white", count: 3 },
      { flowerId: "hydrangea-blue", count: 2 },
      { flowerId: "eucalyptus", count: 5 },
    ],
    badges: ["Premium"],
    palette: { background: "#EBE5D8", accent: "#3A4A39" },
    featured: true,
  },
  {
    id: "p-mesa-domingo",
    slug: "arreglo-mesa-domingo",
    name: "Mesa Domingo",
    category: "arreglos",
    price: 980,
    shortDescription: "Arreglo cilíndrico con tulipanes y rosas.",
    description:
      "Tulipanes amarillos y rosa con rosas blancas en jarrón de vidrio. Una mañana de domingo, pero en flores.",
    composition: [
      { flowerId: "tulip-yellow", count: 6 },
      { flowerId: "tulip-pink", count: 4 },
      { flowerId: "rose-white", count: 4 },
    ],
    palette: { background: "#F7EEDD", accent: "#F5C24A" },
  },
  {
    id: "p-monstera",
    slug: "planta-monstera",
    name: "Monstera Deliciosa",
    category: "plantas",
    price: 850,
    shortDescription: "Planta de interior en maceta de barro.",
    description:
      "Hojas escultóricas que crecen con el tiempo. Incluye maceta de barro artesanal de 25 cm.",
    palette: { background: "#E5EAD9", accent: "#3F5740" },
  },
  {
    id: "p-pothos",
    slug: "planta-pothos",
    name: "Pothos Dorado",
    category: "plantas",
    price: 420,
    shortDescription: "Trepadora resistente, perfecta para principiantes.",
    description:
      "La planta más indulgente del mundo. Sobrevive a casi todo y purifica el aire.",
    palette: { background: "#E2E9D6", accent: "#5E7257" },
  },
  {
    id: "p-orquidea",
    slug: "planta-orquidea",
    name: "Orquídea Phalaenopsis",
    category: "plantas",
    price: 1180,
    shortDescription: "Orquídea blanca de tallo doble.",
    description:
      "Floración por varios meses, mantenimiento sencillo. Maceta de cerámica blanca incluida.",
    badges: ["Larga duración"],
    palette: { background: "#F1ECE3", accent: "#E7DDCB" },
  },
  {
    id: "p-caja-trufas",
    slug: "regalo-trufas-belgas",
    name: "Caja de trufas belgas",
    category: "regalos",
    price: 320,
    shortDescription: "Doce trufas artesanales en caja madera.",
    description:
      "Selección de trufas de chocolate negro, leche y blanco. Ideal como complemento para un ramo.",
    palette: { background: "#E8D7C0", accent: "#5C3A12" },
  },
  {
    id: "p-vela-soja",
    slug: "regalo-vela-soja",
    name: "Vela de soja — Higo & Vetiver",
    category: "regalos",
    price: 480,
    shortDescription: "Vela artesanal de 220g, 50 horas.",
    description:
      "Cera de soja natural, aceites esenciales. Recipiente de vidrio reutilizable.",
    palette: { background: "#EDE5D6", accent: "#8B6A3F" },
  },
  {
    id: "p-osito",
    slug: "regalo-osito-felpa",
    name: "Osito de felpa premium",
    category: "regalos",
    price: 380,
    shortDescription: "Osito 45 cm color crema.",
    description:
      "Felpa supersuave, relleno hipoalergénico. El acompañante clásico para regalar.",
    palette: { background: "#F2EAD9", accent: "#C9A77C" },
  },
  {
    id: "p-tarjeta",
    slug: "regalo-tarjeta",
    name: "Tarjeta personalizada",
    category: "regalos",
    price: 60,
    shortDescription: "Cartulina de algodón con mensaje a mano.",
    description:
      "Tarjeta de cartulina de algodón con sobre. Mensaje escrito a mano por nuestro equipo.",
    palette: { background: "#F1ECE3", accent: "#3A4A39" },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getFlower(id: string) {
  return flowers.find((f) => f.id === id);
}

export function getWrap(id: string) {
  return wraps.find((w) => w.id === id);
}

export function getRibbon(id: string) {
  return ribbons.find((r) => r.id === id);
}

export const categoryMeta: Record<
  "ramos" | "arreglos" | "regalos" | "plantas",
  { label: string; description: string }
> = {
  ramos: {
    label: "Ramos",
    description: "Atados frescos para llevar en mano.",
  },
  arreglos: {
    label: "Arreglos",
    description: "Composiciones en jarrón o caja.",
  },
  plantas: {
    label: "Plantas",
    description: "Verdes vivos para casa u oficina.",
  },
  regalos: {
    label: "Regalos",
    description: "Para acompañar o regalar solo.",
  },
};

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-MX")}`;
}
