export type FlowerKind =
  | "rose"
  | "tulip"
  | "daisy"
  | "sunflower"
  | "lily"
  | "peony"
  | "hydrangea"
  | "lavender"
  | "eucalyptus"
  | "babys-breath";

export type Flower = {
  id: string;
  name: string;
  kind: FlowerKind;
  color: string; // primary hex/oklch — drives SVG fill
  accentColor?: string;
  pricePerStem: number;
  description: string;
  season: "primavera" | "verano" | "otoño" | "invierno" | "todo el año";
  available: boolean;
};

export type Wrap = {
  id: string;
  name: string;
  description: string;
  color: string;
  texture: "kraft" | "korean" | "linen" | "boxed";
  price: number;
};

export type Ribbon = {
  id: string;
  name: string;
  color: string;
};

export type Category = "ramos" | "arreglos" | "regalos" | "plantas";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  shortDescription: string;
  description: string;
  composition?: { flowerId: string; count: number }[];
  badges?: string[];
  palette: { background: string; accent: string };
  featured?: boolean;
};

export type CustomBouquetConfig = {
  flowers: { flowerId: string; qty: number }[];
  wrapId: string;
  ribbonId: string;
  cardMessage: string;
};

export type CartItem =
  | {
      type: "product";
      key: string;
      productId: string;
      qty: number;
    }
  | {
      type: "custom";
      key: string;
      config: CustomBouquetConfig;
      qty: number;
      computedPrice: number;
    };
